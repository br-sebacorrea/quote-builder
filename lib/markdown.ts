import { CoverPageData } from '@/types';

export interface ParsedContent {
  coverData: CoverPageData | null;
  html: string;
}

const defaultCoverData: CoverPageData = {
  title: '',
  titleAccent: '',
  subtitle: '',
  clientName: '',
  clientAddress: '',
  clientCity: '',
};

export function parseFrontmatter(md: string): { frontmatter: CoverPageData | null; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = md.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, content: md };
  }

  const frontmatterStr = match[1];
  const content = md.slice(match[0].length);

  const coverData: CoverPageData = { ...defaultCoverData };

  frontmatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key in coverData) {
      (coverData as unknown as Record<string, string>)[key] = value;
    }
  });

  // Check if we have at least a title
  if (!coverData.title && !coverData.titleAccent) {
    return { frontmatter: null, content: md };
  }

  return { frontmatter: coverData, content };
}

export function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML entities first (but preserve our markdown)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers (must be at start of line)
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Tables
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, body) => {
    const headers = header
      .split('|')
      .filter((h: string) => h.trim())
      .map((h: string) => `<th>${h.trim()}</th>`)
      .join('');
    const rows = body
      .trim()
      .split('\n')
      .map((row: string) => {
        const cells = row
          .split('|')
          .filter((c: string) => c.trim())
          .map((c: string) => `<td>${c.trim()}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Unordered lists (process after tables)
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^- (.+)$/);
    const olMatch = line.match(/^\d+\. (.+)$/);

    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
  }

  html = processedLines.join('\n');

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Paragraphs - wrap text blocks that aren't already wrapped
  const blocks = html.split('\n\n');
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Don't wrap if already an HTML element
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<p') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<div')
      ) {
        return trimmed;
      }
      // Wrap in paragraph, convert single newlines to <br>
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');

  return html;
}

export function parseMarkdownWithCover(md: string): ParsedContent {
  const { frontmatter, content } = parseFrontmatter(md);
  const html = parseMarkdown(content);
  return { coverData: frontmatter, html };
}
