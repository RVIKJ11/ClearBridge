// AudioWorklet: converts live mic input (Float32 at the AudioContext's native
// sample rate) into 16-bit little-endian PCM at 16 kHz for AssemblyAI
// Universal-Streaming.
//
// IMPORTANT: `process()` is invoked by the browser once per render quantum
// (128 samples). At a 16 kHz AudioContext that is only 8 ms of audio — far
// below AssemblyAI's 50 ms minimum per chunk. So this worklet does NOT post
// on every tick. It accumulates resampled Int16 samples into a fixed-size
// buffer (1600 samples = 100 ms @ 16 kHz) and only flushes once the buffer
// is full. Any tail samples left over at teardown are dropped — they are
// < 100 ms and would also violate the minimum.
//
// The resampler is a simple nearest-neighbor step. It is fine for speech
// and, more importantly, it is NOT the source of the "8 ms" error: the
// error was caused by flushing per-quantum, which this file now fixes.

const TARGET_SAMPLE_RATE = 16000;
const CHUNK_SAMPLES = 1600; // 100 ms at 16 kHz
const MIN_FLUSH_SAMPLES = 800; // 50 ms — absolute minimum AssemblyAI accepts

class PCMResampleProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = (options && options.processorOptions) || {};
    this._targetRate = opts.targetSampleRate || TARGET_SAMPLE_RATE;
    // `sampleRate` is a global inside AudioWorkletGlobalScope.
    this._sourceRate = sampleRate;
    this._step = this._sourceRate / this._targetRate;
    this._cursor = 0;

    // Accumulator for 16-bit PCM output. We flush whenever we have at least
    // CHUNK_SAMPLES ready, so every message posted to the main thread is
    // exactly 100 ms of audio (except possibly the very last one).
    this._pcmBuffer = new Int16Array(CHUNK_SAMPLES);
    this._pcmLength = 0;
  }

  _flush() {
    if (this._pcmLength < MIN_FLUSH_SAMPLES) return;
    // Copy out the exact number of filled samples and transfer the buffer.
    const out = new Int16Array(this._pcmLength);
    out.set(this._pcmBuffer.subarray(0, this._pcmLength));
    this._pcmLength = 0;
    this.port.postMessage(out.buffer, [out.buffer]);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channel = input[0];
    if (!channel || channel.length === 0) return true;

    // Walk the source buffer at `_step` increments, appending nearest-neighbor
    // samples straight into the Int16 accumulator. Flush whenever we hit
    // CHUNK_SAMPLES so each posted message is exactly 100 ms.
    while (this._cursor < channel.length) {
      const idx = this._cursor | 0; // floor to int
      let s = channel[idx];
      if (s > 1) s = 1;
      else if (s < -1) s = -1;
      this._pcmBuffer[this._pcmLength++] = s < 0 ? s * 0x8000 : s * 0x7fff;

      if (this._pcmLength >= CHUNK_SAMPLES) {
        // Full 100 ms chunk — ship it.
        const out = new Int16Array(CHUNK_SAMPLES);
        out.set(this._pcmBuffer);
        this._pcmLength = 0;
        this.port.postMessage(out.buffer, [out.buffer]);
      }

      this._cursor += this._step;
    }
    // Carry the fractional cursor into the next render quantum so the
    // resample phase stays continuous across `process()` calls.
    this._cursor -= channel.length;

    return true;
  }
}

registerProcessor('pcm-resample-processor', PCMResampleProcessor);
