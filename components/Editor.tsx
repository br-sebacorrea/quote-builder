'use client';

import { useEffect, useRef } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Auto-resize textarea
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      // Set cursor position after the tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 overflow-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full min-h-full p-6 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-slate-500"
          placeholder="Start writing your quote in Markdown..."
          spellCheck={false}
        />
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Markdown supported</span>
          <span className="w-2 h-2 rounded-full bg-green-500" title="Auto-saving" />
        </div>
      </div>
    </div>
  );
}
