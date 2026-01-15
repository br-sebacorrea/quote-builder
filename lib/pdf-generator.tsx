'use client';

import { TemplateConfig, ExportConfig, CoverPageData } from '@/types';
import { CaseStudy } from '@/lib/case-studies';

interface ParsedSection {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'table' | 'blockquote' | 'hr';
  content: string;
  items?: string[];
  rows?: string[][];
  headers?: string[];
}

// Parse HTML content into structured sections
export function parseHTMLToSections(html: string): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // Remove extra whitespace
  html = html.replace(/\n\s*\n/g, '\n').trim();

  // Decode HTML entities
  const decodeHTMLEntities = (str: string): string => {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  };

  // Strip HTML tags from content and decode entities
  const stripTags = (str: string): string => decodeHTMLEntities(str.replace(/<[^>]+>/g, '').trim());

  // Simple regex-based parsing
  const tagRegex = /<(h[123]|p|ul|ol|table|blockquote|hr)[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1]?.toLowerCase() || 'hr';
    const content = match[2] || '';

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      sections.push({ type: tag, content: stripTags(content) });
    } else if (tag === 'p') {
      const text = stripTags(content);
      if (text) {
        sections.push({ type: 'p', content: text });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items: string[] = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(content)) !== null) {
        items.push(stripTags(liMatch[1]));
      }
      if (items.length > 0) {
        sections.push({ type: tag, content: '', items });
      }
    } else if (tag === 'table') {
      const headers: string[] = [];
      const rows: string[][] = [];

      // Parse headers
      const theadMatch = content.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
      if (theadMatch) {
        const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        let thMatch;
        while ((thMatch = thRegex.exec(theadMatch[1])) !== null) {
          headers.push(stripTags(thMatch[1]));
        }
      }

      // Parse rows
      const tbodyMatch = content.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
      if (tbodyMatch) {
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let trMatch;
        while ((trMatch = trRegex.exec(tbodyMatch[1])) !== null) {
          const row: string[] = [];
          const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
          let tdMatch;
          while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
            row.push(stripTags(tdMatch[1]));
          }
          if (row.length > 0) {
            rows.push(row);
          }
        }
      }

      if (headers.length > 0 || rows.length > 0) {
        sections.push({ type: 'table', content: '', headers, rows });
      }
    } else if (tag === 'blockquote') {
      sections.push({ type: 'blockquote', content: stripTags(content) });
    } else if (tag === 'hr' || match[0] === '<hr>' || match[0] === '<hr/>') {
      sections.push({ type: 'hr', content: '' });
    }
  }

  return sections;
}

// Load image as base64
async function loadImageAsBase64(src: string): Promise<string> {
  if (!src || src.startsWith('data:')) return src;

  try {
    const url = src.startsWith('http')
      ? src
      : `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`;
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

// Main export function
export async function generatePDFDocument(
  htmlContent: string,
  template: TemplateConfig,
  exportConfig: ExportConfig,
  quoteNumber: string,
  coverData?: CoverPageData | null,
  caseStudies?: CaseStudy[]
): Promise<void> {
  // Dynamic import the PDF component that has proper JSX compilation
  const { createPDFBlob } = await import('./pdf-components');

  const sections = parseHTMLToSections(htmlContent);
  const logoBase64 = template.logoUrl ? await loadImageAsBase64(template.logoUrl) : '';

  // Generate PDF blob
  const blob = await createPDFBlob({
    sections,
    template,
    exportConfig,
    quoteNumber,
    coverData,
    logoBase64,
    caseStudies: caseStudies || [],
  });

  // Download the PDF
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${exportConfig.filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
