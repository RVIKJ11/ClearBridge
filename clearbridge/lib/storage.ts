import type {
  ProcessedResults,
  Bookmark,
  TranscriptChunk,
  LineAnnotation,
} from '@/types';
import { HIGHLIGHT_STYLES } from '@/lib/ai/highlight-styles';

function formatDuration(ms?: number): string {
  if (!ms) return '';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export function exportSessionAsText(
  title: string,
  results: ProcessedResults,
  bookmarks?: Bookmark[],
  duration?: number
): void {
  const lines: string[] = [
    `ClearBridge Session Export`,
    `Title: ${title}`,
    `Exported: ${new Date().toLocaleString()}`,
    duration ? `Duration: ${formatDuration(duration)}` : '',
    '',
    '='.repeat(60),
    '',
    'SUMMARY',
    '-'.repeat(40),
    results.summary,
    '',
  ];

  if (results.detailedSummary) {
    lines.push('DETAILED SUMMARY', '-'.repeat(40), results.detailedSummary, '');
  }

  lines.push('SIMPLIFIED EXPLANATION', '-'.repeat(40), results.simplifiedExplanation, '');

  if (results.whatMatters.length > 0) {
    lines.push('WHAT MATTERS MOST', '-'.repeat(40));
    results.whatMatters.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push('');
  }

  lines.push('KEY POINTS', '-'.repeat(40));
  results.keyPoints.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push('');

  if (results.actionItems.length > 0) {
    lines.push('ACTION ITEMS', '-'.repeat(40));
    results.actionItems.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push('');
  }

  if (results.dates.length > 0) {
    lines.push('DATES & DEADLINES', '-'.repeat(40));
    results.dates.forEach((d) => lines.push(`• ${d}`));
    lines.push('');
  }

  if (results.questions.length > 0) {
    lines.push('QUESTIONS', '-'.repeat(40));
    results.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    lines.push('');
  }

  if (results.steps.length > 0) {
    lines.push('STEPS & INSTRUCTIONS', '-'.repeat(40));
    results.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }

  if (results.glossary.length > 0) {
    lines.push('GLOSSARY', '-'.repeat(40));
    results.glossary.forEach((g) => lines.push(`${g.term}: ${g.definition}`));
    lines.push('');
  }

  if (results.namesAndTerms.length > 0) {
    lines.push('NAMES & TERMS', '-'.repeat(40));
    results.namesAndTerms.forEach((n) => lines.push(`• ${n}`));
    lines.push('');
  }

  if (results.topicBreakdown.length > 0) {
    lines.push('TOPIC BREAKDOWN', '-'.repeat(40));
    results.topicBreakdown.forEach((t) => lines.push(`[${t.topic}] ${t.summary}`));
    lines.push('');
  }

  if (results.studyGuide) {
    lines.push('STUDY GUIDE', '-'.repeat(40), results.studyGuide, '');
  }

  if (results.nextSteps.length > 0) {
    lines.push('NEXT STEPS', '-'.repeat(40));
    results.nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }

  if (results.learnMore.length > 0) {
    lines.push('LEARN MORE', '-'.repeat(40));
    results.learnMore.forEach((l) => lines.push(`• ${l}`));
    lines.push('');
  }

  if (results.funFacts.length > 0) {
    lines.push('FUN FACTS', '-'.repeat(40));
    results.funFacts.forEach((f) => lines.push(`• ${f}`));
    lines.push('');
  }

  if (bookmarks && bookmarks.length > 0) {
    lines.push('BOOKMARKS', '-'.repeat(40));
    bookmarks.forEach((b) => lines.push(`[${new Date(b.timestamp).toLocaleTimeString()}] ${b.label}`));
    lines.push('');
  }

  if (results.imageDescriptions.length > 0) {
    lines.push('IMAGE DESCRIPTIONS', '-'.repeat(40));
    results.imageDescriptions.forEach((img) => {
      lines.push(`[${img.filename}]`);
      lines.push(img.description);
      lines.push('');
    });
  }

  if (results.cleanedTranscript && results.cleanedTranscript !== results.originalText) {
    lines.push('CLEANED TRANSCRIPT', '-'.repeat(40), results.cleanedTranscript, '');
  }

  lines.push('FULL ORIGINAL TRANSCRIPT', '-'.repeat(40), results.originalText);

  const blob = new Blob([lines.filter(Boolean).join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clearbridge-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSessionAsJSON(
  title: string,
  results: ProcessedResults,
  bookmarks?: Bookmark[],
  duration?: number
): void {
  const data = {
    title,
    exportedAt: new Date().toISOString(),
    duration: duration ? formatDuration(duration) : undefined,
    bookmarks,
    results,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clearbridge-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSessionAsMarkdown(
  title: string,
  results: ProcessedResults,
  bookmarks?: Bookmark[],
  duration?: number
): void {
  const lines: string[] = [
    `# ${title}`,
    '',
    `> Exported: ${new Date().toLocaleString()}${duration ? ` | Duration: ${formatDuration(duration)}` : ''}`,
    '',
    '---',
    '',
    '## Summary',
    results.summary,
    '',
  ];

  if (results.detailedSummary) {
    lines.push('## Detailed Summary', results.detailedSummary, '');
  }

  if (results.whatMatters.length > 0) {
    lines.push('## What Matters Most');
    results.whatMatters.forEach((item, i) => lines.push(`${i + 1}. **${item}**`));
    lines.push('');
  }

  lines.push('## Key Points');
  results.keyPoints.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push('');

  if (results.actionItems.length > 0) {
    lines.push('## Action Items');
    results.actionItems.forEach((item) => lines.push(`- [ ] ${item}`));
    lines.push('');
  }

  if (results.dates.length > 0) {
    lines.push('## Dates & Deadlines');
    results.dates.forEach((d) => lines.push(`- ${d}`));
    lines.push('');
  }

  if (results.questions.length > 0) {
    lines.push('## Questions');
    results.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    lines.push('');
  }

  if (results.glossary.length > 0) {
    lines.push('## Glossary');
    results.glossary.forEach((g) => lines.push(`- **${g.term}**: ${g.definition}`));
    lines.push('');
  }

  if (results.studyGuide) {
    lines.push('## Study Guide', results.studyGuide, '');
  }

  if (results.nextSteps.length > 0) {
    lines.push('## Next Steps');
    results.nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }

  if (results.learnMore.length > 0) {
    lines.push('## Learn More');
    results.learnMore.forEach((l) => lines.push(`- ${l}`));
    lines.push('');
  }

  if (bookmarks && bookmarks.length > 0) {
    lines.push('## Bookmarks');
    bookmarks.forEach((b) => lines.push(`- \`${new Date(b.timestamp).toLocaleTimeString()}\` ${b.label}`));
    lines.push('');
  }

  lines.push('## Full Transcript', '```', results.originalText, '```');

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clearbridge-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface PrintOptions {
  transcriptChunks?: TranscriptChunk[];
  annotations?: Record<string, LineAnnotation>;
}

export function printSession(
  title: string,
  results: ProcessedResults,
  options: PrintOptions = {}
): void {
  const html = buildPrintHTML(title, results, options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildAnnotatedTranscriptSection(
  chunks: TranscriptChunk[] | undefined,
  annotations: Record<string, LineAnnotation> | undefined
): string {
  if (!chunks || chunks.length === 0) return '';
  const finals = chunks.filter((c) => c.isFinal);
  if (finals.length === 0) return '';
  const ann = annotations ?? {};
  const hasAnyAnnotation = finals.some(
    (c) => ann[c.id] && ann[c.id].category !== 'general'
  );
  if (!hasAnyAnnotation) return '';

  const lines = finals
    .map((chunk) => {
      const a = ann[chunk.id];
      const blocks: string[] = [];

      if (a?.isTopicShift) {
        const topic = a.topicLabel ? ` &middot; ${esc(a.topicLabel)}` : '';
        blocks.push(
          `<div style="display:flex;align-items:center;gap:10px;margin:14px 0 8px 0;color:#4f46e5;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">` +
            `<span style="flex:1;height:1px;background:#c7d2fe"></span>` +
            `<span>Topic Shift${topic}</span>` +
            `<span style="flex:1;height:1px;background:#c7d2fe"></span>` +
            `</div>`
        );
      }

      const isHighlighted = a && a.category !== 'general';
      const style = a ? HIGHLIGHT_STYLES[a.category] : null;
      const bg = isHighlighted && style ? style.pdfBg : '#ffffff';
      const tagBg = isHighlighted && style ? style.pdfTagBg : '#f3f4f6';
      const tagText = isHighlighted && style ? style.pdfTagText : '#4b5563';
      const borderColor =
        isHighlighted && style ? style.pdfTagText : '#e5e7eb';

      const tag =
        isHighlighted && style
          ? `<span style="display:inline-block;margin-left:8px;padding:1px 6px;border-radius:4px;background:${tagBg};color:${tagText};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;vertical-align:middle">${esc(
              a.label || style.defaultLabel || style.displayName
            )}</span>`
          : '';

      blocks.push(
        `<div style="background:${bg};border-left:3px solid ${borderColor};padding:6px 10px;border-radius:6px;margin-bottom:4px;font-size:13px;line-height:1.65;color:#1f2937;page-break-inside:avoid">` +
          `${esc(chunk.text)}${tag}` +
          `</div>`
      );

      return blocks.join('');
    })
    .join('');

  return (
    `<div class="section">` +
    `<div class="section-label" style="color:#111827">Annotated Transcript <span class="count">${finals.length} lines</span></div>` +
    `<div style="background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;padding:14px">${lines}</div>` +
    `</div>`
  );
}

function buildPrintHTML(
  title: string,
  results: ProcessedResults,
  options: PrintOptions = {}
): string {
  const card = (content: string, style = '') =>
    `<div class="card" style="${style}">${content}</div>`;

  const sectionHeader = (label: string, color: string) =>
    `<div class="section-label" style="color:${color}">${label}</div>`;

  const numberedBadge = (n: number, bg: string, fg: string) =>
    `<span class="badge" style="background:${bg};color:${fg}">${n}</span>`;

  const iconCheck =
    `<span style="color:#10b981;flex-shrink:0;margin-top:2px">` +
    `<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>` +
    `</span>`;

  const iconCalendar =
    `<span style="color:#f59e0b;flex-shrink:0;margin-top:2px">` +
    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>` +
    `</span>`;

  const iconInfo =
    `<span style="color:#3b82f6;flex-shrink:0;margin-top:2px">` +
    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` +
    `</span>`;

  const rowItem = (icon: string, text: string, bg: string, border: string) =>
    `<div class="row-item" style="background:${bg};border:1px solid ${border}">` +
    `${icon}<span class="row-text">${esc(text)}</span>` +
    `</div>`;

  /* ── Sections ── */

  const summarySection = card(
    `<div class="card-heading"><span class="h3">Summary</span></div>` +
    `<p class="body-text">${esc(results.summary || 'No summary available.')}</p>`,
    'background:#ffffff;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.08)'
  );

  const whatMattersSection = results.whatMatters.length > 0
    ? card(
        `<div class="card-heading"><span class="h3" style="color:#9f1239">What Matters Most</span></div>` +
        `<ol class="bare-list">` +
        results.whatMatters.map((item, i) =>
          `<li class="row-item" style="background:#fff1f2;border:1px solid #fecdd3">` +
          `${numberedBadge(i + 1, '#fecdd3', '#be123c')}` +
          `<span class="row-text">${esc(item)}</span>` +
          `</li>`
        ).join('') +
        `</ol>`,
        'background:#fff1f2;border:1px solid #fecdd3'
      )
    : '';

  const detailedSummarySection = results.detailedSummary
    ? card(
        `<div class="card-heading"><span class="h3">Detailed Summary</span></div>` +
        `<p class="body-text" style="white-space:pre-wrap">${esc(results.detailedSummary)}</p>`,
        'background:#ffffff;border:1px solid #e5e7eb'
      )
    : '';

  const simplifiedSection = card(
    `<div class="card-heading"><span class="h3">Simplified Explanation</span></div>` +
    `<p class="body-text" style="white-space:pre-wrap">${esc(results.simplifiedExplanation || 'No simplified explanation available.')}</p>`,
    'background:#eff6ff;border:1px solid #bfdbfe'
  );

  const keyPointsSection = results.keyPoints.length > 0
    ? `<div class="section">` +
      sectionHeader(`Key Points <span class="count">${results.keyPoints.length}</span>`, '#111827') +
      `<ol class="bare-list">` +
      results.keyPoints.map((point, i) =>
        `<li class="row-item" style="background:#ffffff;border:1px solid #f3f4f6">` +
        `${numberedBadge(i + 1, '#eff6ff', '#2563eb')}` +
        `<span class="row-text">${esc(point)}</span>` +
        `</li>`
      ).join('') +
      `</ol></div>`
    : '';

  const actionItemsSection = results.actionItems.length > 0
    ? `<div class="section">` +
      sectionHeader(`Action Items <span class="count">${results.actionItems.length}</span>`, '#111827') +
      `<ul class="bare-list">` +
      results.actionItems.map((item) => rowItem(iconCheck, item, '#ecfdf5', '#a7f3d0')).join('') +
      `</ul></div>`
    : '';

  const datesSection = results.dates.length > 0
    ? `<div class="section">` +
      sectionHeader(`Dates &amp; Deadlines <span class="count">${results.dates.length}</span>`, '#111827') +
      `<ul class="bare-list">` +
      results.dates.map((d) => rowItem(iconCalendar, d, '#fffbeb', '#fde68a')).join('') +
      `</ul></div>`
    : '';

  const questionsSection = results.questions.length > 0
    ? `<div class="section">` +
      sectionHeader(`Questions Asked <span class="count">${results.questions.length}</span>`, '#111827') +
      `<ul class="bare-list">` +
      results.questions.map((q) =>
        `<div class="row-item" style="background:#faf5ff;border:1px solid #e9d5ff">` +
        `<span class="badge" style="background:#f3e8ff;color:#a855f7;font-weight:700">Q</span>` +
        `<span class="row-text">${esc(q)}</span>` +
        `</div>`
      ).join('') +
      `</ul></div>`
    : '';

  const stepsSection = results.steps.length > 0
    ? `<div class="section">` +
      sectionHeader(`Steps &amp; Instructions <span class="count">${results.steps.length}</span>`, '#111827') +
      `<ol class="bare-list">` +
      results.steps.map((step, i) =>
        `<li class="row-item" style="background:#f0f9ff;border:1px solid #bae6fd">` +
        `${numberedBadge(i + 1, '#bae6fd', '#0369a1')}` +
        `<span class="row-text">${esc(step)}</span>` +
        `</li>`
      ).join('') +
      `</ol></div>`
    : '';

  const glossarySection = results.glossary.length > 0
    ? `<div class="section">` +
      sectionHeader(`Glossary <span class="count">${results.glossary.length}</span>`, '#111827') +
      `<div class="bare-list">` +
      results.glossary.map((g) =>
        `<div class="row-item" style="background:#ffffff;border:1px solid #e5e7eb;align-items:flex-start">` +
        `<span style="flex-shrink:0;padding:2px 8px;border-radius:4px;background:#ede9fe;color:#6d28d9;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">${esc(g.term)}</span>` +
        `<span class="row-text" style="color:#4b5563;font-size:14px">${esc(g.definition)}</span>` +
        `</div>`
      ).join('') +
      `</div></div>`
    : '';

  const namesSection = results.namesAndTerms.length > 0
    ? `<div class="section">` +
      sectionHeader('Names, Terms &amp; Topics', '#111827') +
      `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">` +
      results.namesAndTerms.map((term) =>
        `<span style="padding:4px 12px;border-radius:8px;background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;font-size:13px">${esc(term)}</span>`
      ).join('') +
      `</div></div>`
    : '';

  const topicSection = results.topicBreakdown.length > 0
    ? `<div class="section">` +
      sectionHeader(`Topic Breakdown <span class="count">${results.topicBreakdown.length}</span>`, '#111827') +
      `<div class="bare-list">` +
      results.topicBreakdown.map((t) =>
        `<div style="padding:12px 14px;border-radius:10px;border:1px solid #e5e7eb;border-left:4px solid #818cf8;background:#ffffff;margin-bottom:8px">` +
        `<div style="font-weight:600;color:#4338ca;font-size:13px;margin-bottom:4px">${esc(t.topic)}</div>` +
        `<div style="color:#4b5563;font-size:14px;line-height:1.6">${esc(t.summary)}</div>` +
        `</div>`
      ).join('') +
      `</div></div>`
    : '';

  const studyGuideSection = results.studyGuide
    ? card(
        `<div class="card-heading"><span class="h3">Study Guide</span></div>` +
        `<div class="body-text" style="white-space:pre-wrap">${esc(results.studyGuide)}</div>`,
        'background:#ffffff;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.08)'
      )
    : '';

  const nextStepsSection = results.nextSteps.length > 0
    ? card(
        `<div class="card-heading"><span class="h3" style="color:#134e4a">Next Steps</span></div>` +
        `<ol class="bare-list">` +
        results.nextSteps.map((step, i) =>
          `<li style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px">` +
          `${numberedBadge(i + 1, '#99f6e4', '#0f766e')}` +
          `<span class="row-text">${esc(step)}</span>` +
          `</li>`
        ).join('') +
        `</ol>`,
        'background:#f0fdfa;border:1px solid #99f6e4'
      )
    : '';

  const learnMoreSection = results.learnMore.length > 0
    ? card(
        `<div class="card-heading"><span class="h3">Learn More</span></div>` +
        `<ul class="bare-list">` +
        results.learnMore.map((item) =>
          `<li style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px">` +
          `${iconInfo}<span class="row-text" style="color:#4b5563;font-size:14px">${esc(item)}</span>` +
          `</li>`
        ).join('') +
        `</ul>`,
        'background:#ffffff;border:1px solid #e5e7eb'
      )
    : '';

  const funFactsSection = results.funFacts && results.funFacts.length > 0
    ? card(
        `<div class="card-heading"><span class="h3" style="color:#9a3412">Fun Facts</span></div>` +
        `<ul class="bare-list">` +
        results.funFacts.map((fact) =>
          `<li style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px">` +
          `<span style="color:#f97316;flex-shrink:0;font-size:14px">&#9733;</span>` +
          `<span class="row-text" style="color:#374151;font-size:14px">${esc(fact)}</span>` +
          `</li>`
        ).join('') +
        `</ul>`,
        'background:#fff7ed;border:1px solid #fed7aa'
      )
    : '';

  const annotatedTranscriptSection = buildAnnotatedTranscriptSection(
    options.transcriptChunks,
    options.annotations
  );

  const transcriptSection =
    `<div class="section">` +
    sectionHeader('Full Transcript', '#111827') +
    `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap;color:#374151;font-family:ui-monospace,monospace">${esc(results.originalText)}</div>` +
    `</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)} - ClearBridge</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
    body{padding:0}
    .section,.card{page-break-inside:avoid}
  }
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    max-width:820px;
    margin:0 auto;
    padding:40px 28px;
    color:#111827;
    line-height:1.6;
    background:#ffffff;
  }
  /* Header */
  .doc-header{margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #e5e7eb}
  .doc-title{font-size:26px;font-weight:700;color:#4f46e5;letter-spacing:-.02em;margin-bottom:6px}
  .doc-brand{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#4f46e5;margin-bottom:8px}
  .doc-meta{font-size:13px;color:#6b7280}
  /* Section wrappers */
  .section{margin-bottom:28px}
  .card{border-radius:12px;padding:20px;margin-bottom:20px;page-break-inside:avoid}
  .card-heading{margin-bottom:12px}
  .h3{font-size:15px;font-weight:600;color:#111827}
  .body-text{font-size:14px;color:#4b5563;line-height:1.7}
  .section-label{font-size:15px;font-weight:600;margin-bottom:10px}
  .count{font-size:13px;font-weight:400;color:#9ca3af;margin-left:6px}
  /* Row items */
  .bare-list{list-style:none;display:flex;flex-direction:column;gap:8px}
  .row-item{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:10px}
  .row-text{font-size:14px;color:#374151;line-height:1.6;flex:1}
  .badge{
    flex-shrink:0;
    width:24px;height:24px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:700;
    margin-top:1px;
  }
</style>
</head>
<body>
<div class="doc-header">
  <div class="doc-brand">ClearBridge</div>
  <div class="doc-title">${esc(title)}</div>
  <div class="doc-meta">Session Export &bull; ${new Date().toLocaleString()}</div>
</div>

${summarySection}
${whatMattersSection}
${detailedSummarySection}
${simplifiedSection}
${keyPointsSection}
${actionItemsSection}
${datesSection}
${questionsSection}
${stepsSection}
${glossarySection}
${namesSection}
${topicSection}
${studyGuideSection}
${nextStepsSection}
${learnMoreSection}
${funFactsSection}
${annotatedTranscriptSection}
${transcriptSection}
</body>
</html>`;
}
