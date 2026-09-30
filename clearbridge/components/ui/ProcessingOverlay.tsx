'use client';

interface ProcessingOverlayProps {
  step: string;
  subtext?: string;
}

export default function ProcessingOverlay({ step, subtext }: ProcessingOverlayProps) {
  return (
    <div
      className="flex flex-col items-center py-16 gap-5"
      role="status"
      aria-live="polite"
      aria-label={step}
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900 mb-1">
          {step}
        </p>
        {subtext && (
          <p className="text-sm text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}
