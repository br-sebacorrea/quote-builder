'use client';

import { useState } from 'react';
import { ExportConfig } from '@/types';

interface ExportSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  quoteNumber: string;
  isExporting: boolean;
}

export default function ExportSettings({
  isOpen,
  onClose,
  onExport,
  quoteNumber,
  isExporting,
}: ExportSettingsProps) {
  const [config, setConfig] = useState<ExportConfig>({
    pageSize: 'a4',
    orientation: 'portrait',
    filename: quoteNumber,
    quality: 'standard',
    includeDate: true,
  });

  if (!isOpen) return null;

  const handleChange = (key: keyof ExportConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    onExport(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Export to PDF</h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filename
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={config.filename}
                onChange={(e) => handleChange('filename', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm">
                .pdf
              </span>
            </div>
          </div>

          {/* Page Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['a4', 'letter', 'legal'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleChange('pageSize', size)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    config.pageSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['portrait', 'landscape'] as const).map((orientation) => (
                <button
                  key={orientation}
                  onClick={() => handleChange('orientation', orientation)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    config.orientation === orientation
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${orientation === 'landscape' ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth={2} />
                  </svg>
                  {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['draft', 'standard', 'high'] as const).map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleChange('quality', quality)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    config.quality === quality
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Include Date */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeDate"
              checked={config.includeDate}
              onChange={(e) => handleChange('includeDate', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="includeDate" className="text-sm text-gray-700">
              Include date in document
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              'Export PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
