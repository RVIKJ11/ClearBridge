'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
};

export default function FileDropzone({ onFileSelect, disabled = false }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={[
        'border border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isDragReject
          ? 'border-red-300 bg-red-50'
          : isDragActive
          ? 'border-blue-400 bg-blue-50'
          : disabled
          ? 'border-gray-200 cursor-not-allowed opacity-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
      ].join(' ')}
      role="button"
      aria-label="Upload file. Click or drag and drop."
    >
      <input {...getInputProps()} aria-label="File upload input" />

      <div className="flex flex-col items-center gap-2">
        {isDragReject ? (
          <p className="text-red-600 font-medium">File type not supported</p>
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">Drop to upload</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium">
              Drop your file here, or click to browse
            </p>
            <p className="text-gray-400 text-sm">
              PDF, images, or text. Max 25MB.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
