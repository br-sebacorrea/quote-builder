'use client';

import { useState, useRef } from 'react';
import { TemplateConfig } from '@/types';
import { defaultTemplate } from '@/lib/templates';
import { exportConfiguration, importConfiguration } from '@/lib/storage';

interface TemplateSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateConfig;
  onSave: (template: TemplateConfig) => void;
}

type TabType = 'company' | 'colors' | 'header' | 'typography';

export default function TemplateSettings({
  isOpen,
  onClose,
  template,
  onSave,
}: TemplateSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [localTemplate, setLocalTemplate] = useState<TemplateConfig>(template);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (key: keyof TemplateConfig, value: string | number | boolean) => {
    setLocalTemplate((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localTemplate);
    onClose();
  };

  const handleReset = () => {
    setLocalTemplate(defaultTemplate);
  };

  const handleExport = () => {
    const data = exportConfiguration();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quote-builder-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importConfiguration(content)) {
        const imported = JSON.parse(content);
        setLocalTemplate({ ...defaultTemplate, ...imported.template });
      }
    };
    reader.readAsText(file);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'company', label: 'Company Info' },
    { id: 'colors', label: 'Colors' },
    { id: 'header', label: 'Header/Footer' },
    { id: 'typography', label: 'Typography' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Template Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={localTemplate.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={localTemplate.companyTagline}
                  onChange={(e) => handleChange('companyTagline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={localTemplate.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={localTemplate.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={localTemplate.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="/logo.webp or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color (Cover Page)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Muted Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.mutedColor}
                    onChange={(e) => handleChange('mutedColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.mutedColor}
                    onChange={(e) => handleChange('mutedColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localTemplate.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTemplate.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'header' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quote Prefix
                </label>
                <input
                  type="text"
                  value={localTemplate.quotePrefix}
                  onChange={(e) => handleChange('quotePrefix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showQuoteNumber"
                  checked={localTemplate.showQuoteNumber}
                  onChange={(e) => handleChange('showQuoteNumber', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="showQuoteNumber" className="text-sm text-gray-700">
                  Show Quote Number
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showDate"
                  checked={localTemplate.showDate}
                  onChange={(e) => handleChange('showDate', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="showDate" className="text-sm text-gray-700">
                  Show Date
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showValidityPeriod"
                  checked={localTemplate.showValidityPeriod}
                  onChange={(e) => handleChange('showValidityPeriod', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="showValidityPeriod" className="text-sm text-gray-700">
                  Show Validity Period
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity Days
                </label>
                <input
                  type="number"
                  value={localTemplate.validityDays}
                  onChange={(e) => handleChange('validityDays', parseInt(e.target.value) || 30)}
                  min={1}
                  max={365}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <hr className="my-4" />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showFooter"
                  checked={localTemplate.showFooter}
                  onChange={(e) => handleChange('showFooter', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="showFooter" className="text-sm text-gray-700">
                  Show Footer
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={localTemplate.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select
                  value={localTemplate.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                    Inter (Default)
                  </option>
                  <option value="Georgia, 'Times New Roman', serif">Georgia (Serif)</option>
                  <option value="Arial, Helvetica, sans-serif">Arial</option>
                  <option value="'SF Pro', -apple-system, sans-serif">SF Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Font Size
                </label>
                <select
                  value={localTemplate.baseFontSize}
                  onChange={(e) => handleChange('baseFontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="10pt">10pt (Small)</option>
                  <option value="11pt">11pt (Default)</option>
                  <option value="12pt">12pt (Large)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Padding
                </label>
                <input
                  type="text"
                  value={localTemplate.pagePadding}
                  onChange={(e) => handleChange('pagePadding', e.target.value)}
                  placeholder="48px 56px"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Export Config
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Import Config
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
