'use client';

import { useState, useEffect } from 'react';

interface SaveQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, tags: string[]) => void;
  existingTags: string[];
  defaultTitle?: string;
}

export default function SaveQuoteModal({
  isOpen,
  onClose,
  onSave,
  existingTags,
  defaultTitle = '',
}: SaveQuoteModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [tagsInput, setTagsInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
      setTagsInput('');
      setSelectedTags([]);
    }
  }, [isOpen, defaultTitle]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    // Combine selected tags with new tags from input
    const newTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const allTags = [...new Set([...selectedTags, ...newTags])];
    onSave(title.trim(), allTags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Guardar Quote</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Quote
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Propuesta Website Corporativo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Existing Tags */}
          {existingTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags Existentes
              </label>
              <div className="flex flex-wrap gap-2">
                {existingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nuevos Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Separados por coma: web, diseño, urgente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separa múltiples tags con comas
            </p>
          </div>

          {/* Selected Tags Preview */}
          {(selectedTags.length > 0 || tagsInput.trim()) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags a guardar
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tagsInput
                  .split(',')
                  .map((t) => t.trim().toLowerCase())
                  .filter((t) => t.length > 0 && !selectedTags.includes(t))
                  .map((tag) => (
                    <span
                      key={`new-${tag}`}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {tag} (nuevo)
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
