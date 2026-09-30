'use client';

import Button from '@/components/ui/Button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

function getFileType(type: string, name: string): string {
  if (type === 'application/pdf') return 'PDF';
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('audio/')) return 'Audio';
  if (type === 'text/plain' || name.endsWith('.txt')) return 'Text';
  return 'File';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
      role="status"
      aria-label={`File selected: ${file.name}`}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-sm text-gray-500">
          {getFileType(file.type, file.name)} · {formatSize(file.size)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="flex-shrink-0 text-gray-400 hover:text-red-500"
      >
        Remove
      </Button>
    </div>
  );
}
