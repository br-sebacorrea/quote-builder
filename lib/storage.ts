import { TemplateConfig, Quote, StorageData } from '@/types';
import { defaultTemplate, defaultMarkdown } from './templates';

const STORAGE_KEY = 'quote-builder-data';

export function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return getDefaultStorageData();
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as StorageData;
      // Merge with defaults to handle new fields
      return {
        ...getDefaultStorageData(),
        ...parsed,
        template: { ...defaultTemplate, ...parsed.template },
      };
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  return getDefaultStorageData();
}

function getDefaultStorageData(): StorageData {
  return {
    currentDraft: defaultMarkdown,
    template: defaultTemplate,
    quotes: [],
    lastQuoteNumber: 0,
  };
}

export function saveStorageData(data: Partial<StorageData>): void {
  if (typeof window === 'undefined') return;

  try {
    const currentData = getStorageData();
    const newData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function saveDraft(content: string): void {
  saveStorageData({ currentDraft: content });
}

export function saveTemplate(template: TemplateConfig): void {
  saveStorageData({ template });
}

export function saveQuote(title: string, content: string): Quote {
  const data = getStorageData();
  const newQuoteNumber = data.lastQuoteNumber + 1;

  const quote: Quote = {
    id: `${data.template.quotePrefix}-${String(newQuoteNumber).padStart(4, '0')}`,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Keep only the last 10 quotes
  const quotes = [quote, ...data.quotes].slice(0, 10);

  saveStorageData({
    quotes,
    lastQuoteNumber: newQuoteNumber,
  });

  return quote;
}

export function getQuotes(): Quote[] {
  return getStorageData().quotes;
}

export function getQuote(id: string): Quote | undefined {
  return getStorageData().quotes.find((q) => q.id === id);
}

export function deleteQuote(id: string): void {
  const data = getStorageData();
  const quotes = data.quotes.filter((q) => q.id !== id);
  saveStorageData({ quotes });
}

export function generateQuoteNumber(prefix: string): string {
  const data = getStorageData();
  const nextNumber = data.lastQuoteNumber + 1;
  return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
}

export function exportConfiguration(): string {
  const data = getStorageData();
  return JSON.stringify(
    {
      template: data.template,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

export function importConfiguration(jsonString: string): boolean {
  try {
    const imported = JSON.parse(jsonString);
    if (imported.template) {
      saveTemplate({ ...defaultTemplate, ...imported.template });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing configuration:', error);
    return false;
  }
}
