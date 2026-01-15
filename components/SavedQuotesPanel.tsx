'use client';

import { useState, useMemo } from 'react';
import { Quote } from '@/types';

interface SavedQuotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: Quote[];
  allTags: string[];
  onLoad: (quote: Quote) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; tags?: string[] }) => void;
}

export default function SavedQuotesPanel({
  isOpen,
  onClose,
  quotes,
  allTags,
  onLoad,
  onDelete,
  onUpdate,
}: SavedQuotesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        searchQuery === '' ||
        quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === null || (quote.tags && quote.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [quotes, searchQuery, selectedTag]);

  if (!isOpen) return null;

  const startEditing = (quote: Quote) => {
    setEditingId(quote.id);
    setEditTitle(quote.title);
    setEditTags((quote.tags || []).join(', '));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditTags('');
  };

  const saveEditing = () => {
    if (!editingId || !editTitle.trim()) return;

    const newTags = editTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onUpdate(editingId, { title: editTitle.trim(), tags: newTags });
    cancelEditing();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Mis Quotes</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b space-y-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedTag === null
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                Todos
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg
                className="w-12 h-12 mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">
                {quotes.length === 0 ? 'No hay quotes guardados' : 'No hay resultados'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  {editingId === quote.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        placeholder="Nombre del quote"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        placeholder="Tags separados por coma"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEditing}
                          disabled={!editTitle.trim()}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : deleteConfirmId === quote.id ? (
                    // Delete Confirmation
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        ¿Eliminar &quot;{quote.title}&quot;?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {quote.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {quote.id} · {formatDate(quote.updatedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => onLoad(quote)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Cargar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => startEditing(quote)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(quote.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {quote.tags && quote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {quote.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
          {quotes.length} quote{quotes.length !== 1 ? 's' : ''} guardado{quotes.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
