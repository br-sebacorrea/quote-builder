'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TemplateConfig, ExportConfig, Quote } from '@/types';
import { defaultTemplate, defaultMarkdown } from '@/lib/templates';
import {
  getStorageData,
  saveDraft,
  saveTemplate,
  generateQuoteNumber,
  saveQuote,
  getQuotes,
  deleteQuote,
  updateQuote,
  getAllTags,
} from '@/lib/storage';
import { generatePDFDocument } from '@/lib/pdf-generator';
import { parseMarkdownWithCover } from '@/lib/markdown';
import { defaultCaseStudyIds, getCaseStudiesByIds } from '@/lib/case-studies';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import Toolbar from '@/components/Toolbar';
import TemplateSettings from '@/components/TemplateSettings';
import ExportSettings from '@/components/ExportSettings';
import SaveQuoteModal from '@/components/SaveQuoteModal';
import SavedQuotesPanel from '@/components/SavedQuotesPanel';
import CaseStudiesSelector from '@/components/CaseStudiesSelector';

export default function Home() {
  const [content, setContent] = useState(defaultMarkdown);
  const [template, setTemplate] = useState<TemplateConfig>(defaultTemplate);
  const [quoteNumber, setQuoteNumber] = useState('BR-0001');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isSavedQuotesOpen, setIsSavedQuotesOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [selectedCaseStudyIds, setSelectedCaseStudyIds] = useState<string[]>(defaultCaseStudyIds);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const data = getStorageData();
    setContent(data.currentDraft);
    setTemplate(data.template);
    setQuoteNumber(generateQuoteNumber(data.template.quotePrefix));
    setSavedQuotes(getQuotes());
    setAllTags(getAllTags());
    setIsLoaded(true);
  }, []);

  // Helper to refresh quotes list
  const refreshQuotes = useCallback(() => {
    setSavedQuotes(getQuotes());
    setAllTags(getAllTags());
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(content);
    }, 5000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isLoaded]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleSaveTemplate = useCallback(
    (newTemplate: TemplateConfig) => {
      setTemplate(newTemplate);
      saveTemplate(newTemplate);
      setQuoteNumber(generateQuoteNumber(newTemplate.quotePrefix));
      showToast('Template saved successfully', 'success');
    },
    [showToast]
  );

  const handleExport = useCallback(
    async (exportConfig: ExportConfig) => {
      setIsExporting(true);
      try {
        const { coverData, html: htmlContent } = parseMarkdownWithCover(content);
        const selectedCaseStudies = getCaseStudiesByIds(selectedCaseStudyIds);
        await generatePDFDocument(htmlContent, template, exportConfig, quoteNumber, coverData, selectedCaseStudies);
        showToast('PDF exported successfully', 'success');
        setIsExportOpen(false);
      } catch (error) {
        console.error('Export failed:', error);
        showToast('Failed to export PDF. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
    },
    [content, template, quoteNumber, selectedCaseStudyIds, showToast]
  );

  const handleSaveQuote = useCallback(
    (title: string, tags: string[]) => {
      saveQuote(title, content, tags);
      refreshQuotes();
      setIsSaveOpen(false);
      showToast('Quote guardado exitosamente', 'success');
    },
    [content, refreshQuotes, showToast]
  );

  const handleLoadQuote = useCallback(
    (quote: Quote) => {
      // Save current draft first
      saveDraft(content);
      // Load the quote content
      setContent(quote.content);
      setIsSavedQuotesOpen(false);
      showToast(`Quote "${quote.title}" cargado`, 'success');
    },
    [content, showToast]
  );

  const handleDeleteQuote = useCallback(
    (id: string) => {
      deleteQuote(id);
      refreshQuotes();
      showToast('Quote eliminado', 'success');
    },
    [refreshQuotes, showToast]
  );

  const handleUpdateQuote = useCallback(
    (id: string, updates: { title?: string; tags?: string[] }) => {
      updateQuote(id, updates);
      refreshQuotes();
      showToast('Quote actualizado', 'success');
    },
    [refreshQuotes, showToast]
  );

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gray-600" viewBox="0 0 24 24">
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
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSave={() => setIsSaveOpen(true)}
        onOpenSavedQuotes={() => setIsSavedQuotesOpen(true)}
        onOpenCaseStudies={() => setIsCaseStudiesOpen(true)}
        quoteNumber={quoteNumber}
        savedQuotesCount={savedQuotes.length}
        selectedCaseStudiesCount={selectedCaseStudyIds.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-200 overflow-hidden dark-scrollbar">
          <Editor value={content} onChange={handleContentChange} />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 overflow-hidden light-scrollbar">
          <Preview
            content={content}
            template={template}
            quoteNumber={quoteNumber}
            selectedCaseStudies={getCaseStudiesByIds(selectedCaseStudyIds)}
          />
        </div>
      </div>

      {/* Modals */}
      <TemplateSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        template={template}
        onSave={handleSaveTemplate}
      />

      <ExportSettings
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        quoteNumber={quoteNumber}
        isExporting={isExporting}
      />

      <SaveQuoteModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        onSave={handleSaveQuote}
        existingTags={allTags}
        defaultTitle={quoteNumber}
      />

      <SavedQuotesPanel
        isOpen={isSavedQuotesOpen}
        onClose={() => setIsSavedQuotesOpen(false)}
        quotes={savedQuotes}
        allTags={allTags}
        onLoad={handleLoadQuote}
        onDelete={handleDeleteQuote}
        onUpdate={handleUpdateQuote}
      />

      <CaseStudiesSelector
        isOpen={isCaseStudiesOpen}
        onClose={() => setIsCaseStudiesOpen(false)}
        selectedIds={selectedCaseStudyIds}
        onSave={setSelectedCaseStudyIds}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 toast-enter">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
