'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/store/app-store';
import type { ContextFile, FileType } from '@/types';

const ACCEPTED_CONTEXT_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
};

function fileTypeIcon(fileType: FileType): string {
  if (fileType === 'pdf') return '📄';
  if (fileType === 'image') return '🖼';
  if (fileType === 'text') return '📝';
  return '📎';
}

interface ExtractingFile {
  id: string;
  name: string;
}

export default function ContextPanel() {
  const { sessionContext, addContextFile, removeContextFile, largeText } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [extracting, setExtracting] = useState<ExtractingFile[]>([]);
  const [extractError, setExtractError] = useState('');

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setExtractError('');

      for (const file of acceptedFiles) {
        const tempId = `extracting-${Date.now()}-${Math.random()}`;
        setExtracting((prev) => [...prev, { id: tempId, name: file.name }]);

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/extract-context', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error ?? 'Extraction failed');

          const contextFile: ContextFile = {
            id: `ctx-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileType: data.fileType,
            extractedContent: data.extractedContent,
            uploadedAt: Date.now(),
          };

          addContextFile(contextFile);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to process file';
          setExtractError(message);
        } finally {
          setExtracting((prev) => prev.filter((f) => f.id !== tempId));
        }
      }
    },
    [addContextFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_CONTEXT_TYPES,
    maxSize: 25 * 1024 * 1024,
    disabled: extracting.length > 0,
  });

  const totalFiles = sessionContext.length + extracting.length;

  return (
    <div className="border-b border-gray-200">
      {/* Toggle row */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-6 py-2 text-left hover:bg-gray-50 transition-colors ${
          largeText ? 'text-sm' : 'text-xs'
        }`}
        aria-expanded={isOpen}
        aria-controls="context-panel-body"
      >
        <span className="flex items-center gap-2 text-gray-600 font-medium">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Session Context
          {totalFiles > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">
              {totalFiles}
            </span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel body */}
      {isOpen && (
        <div id="context-panel-body" className="px-6 pb-3 space-y-2">
          {/* Attached files */}
          {(sessionContext.length > 0 || extracting.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sessionContext.map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium max-w-[200px]"
                >
                  <span aria-hidden="true">{fileTypeIcon(file.fileType)}</span>
                  <span className="truncate" title={file.fileName}>{file.fileName}</span>
                  <button
                    onClick={() => removeContextFile(file.id)}
                    className="ml-0.5 flex-shrink-0 rounded-full w-4 h-4 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    aria-label={`Remove ${file.fileName} from context`}
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}

              {extracting.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-xs"
                >
                  <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="truncate max-w-[140px]" title={f.name}>{f.name}</span>
                </span>
              ))}
            </div>
          )}

          {/* Error */}
          {extractError && (
            <p role="alert" className="text-xs text-red-600">
              {extractError}
            </p>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={[
              'border border-dashed rounded-lg px-4 py-3 text-center cursor-pointer transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isDragReject
                ? 'border-red-300 bg-red-50'
                : isDragActive
                ? 'border-blue-400 bg-blue-50'
                : extracting.length > 0
                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
            ].join(' ')}
            role="button"
            aria-label="Add context file. Click or drag and drop."
          >
            <input {...getInputProps()} aria-label="Context file input" />
            <p className="text-xs text-gray-500">
              {isDragReject
                ? 'File type not supported'
                : isDragActive
                ? 'Drop to add context'
                : 'Drop a file here, or click to browse — PDF, image, or text'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
