'use client';

import Image from 'next/image';

interface ToolbarProps {
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenSave: () => void;
  onOpenSavedQuotes: () => void;
  onOpenCaseStudies: () => void;
  quoteNumber: string;
  savedQuotesCount: number;
  selectedCaseStudiesCount: number;
}

export default function Toolbar({
  onOpenSettings,
  onOpenExport,
  onOpenSave,
  onOpenSavedQuotes,
  onOpenCaseStudies,
  quoteNumber,
  savedQuotesCount,
  selectedCaseStudiesCount,
}: ToolbarProps) {
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
        {/* Save Quote Button */}
        <button
          onClick={onOpenSave}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Guardar quote"
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span className="hidden sm:inline">Guardar</span>
        </button>

        {/* Saved Quotes Button */}
        <button
          onClick={onOpenSavedQuotes}
          className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Mis quotes guardados"
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">Mis Quotes</span>
          {savedQuotesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-medium text-white bg-gray-900 rounded-full flex items-center justify-center">
              {savedQuotesCount > 9 ? '9+' : savedQuotesCount}
            </span>
          )}
        </button>

        {/* Case Studies Button */}
        <button
          onClick={onOpenCaseStudies}
          className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Case Studies"
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="hidden sm:inline">Cases</span>
          {selectedCaseStudiesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-medium text-white bg-purple-600 rounded-full flex items-center justify-center">
              {selectedCaseStudiesCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Configuración"
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
