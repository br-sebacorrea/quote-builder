'use client';

import Image from 'next/image';

interface ToolbarProps {
  onOpenSettings: () => void;
  onOpenExport: () => void;
  quoteNumber: string;
}

export default function Toolbar({ onOpenSettings, onOpenExport, quoteNumber }: ToolbarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.webp"
          alt="BrokenRubik"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Quote Builder</h1>
          <p className="text-xs text-gray-500">{quoteNumber}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
      </div>
    </header>
  );
}
