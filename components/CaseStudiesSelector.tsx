'use client';

import { useState } from 'react';
import { CaseStudy, allCaseStudies } from '@/lib/case-studies';

interface CaseStudiesSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
}

export default function CaseStudiesSelector({
  isOpen,
  onClose,
  selectedIds,
  onSave,
}: CaseStudiesSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedIds);

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const selectedCount = selected.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Case Studies</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Selecciona los case studies para incluir en el PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Case Studies List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {allCaseStudies.map((study) => {
              const isSelected = selected.includes(study.id);
              return (
                <button
                  key={study.id}
                  onClick={() => toggleSelection(study.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {study.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {study.summary}
                      </p>
                      <span className="inline-block text-xs text-purple-600 mt-2">
                        {study.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected([])}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
