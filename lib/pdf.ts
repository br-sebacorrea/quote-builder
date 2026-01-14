import { TemplateConfig, ExportConfig, CoverPageData } from '@/types';

declare global {
  interface Window {
    html2pdf?: {
      (): {
        set: (options: Html2PdfOptions) => {
          from: (element: HTMLElement) => {
            save: () => Promise<void>;
          };
        };
      };
    };
  }
}

interface Html2PdfOptions {
  margin: number[];
  filename: string;
  image: { type: string; quality: number };
  html2canvas: { scale: number; useCORS: boolean; logging: boolean; letterRendering: boolean };
  jsPDF: { unit: string; format: number[]; orientation: string };
  pagebreak: { mode: string[]; before: string[]; after: string[]; avoid: string[] };
}

// Page sizes in pixels at 96 DPI
const PAGE_SIZES_PX = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
  legal: { width: 816, height: 1344 },
};

// Margins in mm
const PAGE_MARGINS_MM = {
  top: 15,
  right: 15,
  bottom: 15,
  left: 15,
};

// Margins in pixels (at 96 DPI, 1mm ≈ 3.78px)
const MM_TO_PX = 3.78;
const PAGE_MARGINS_PX = {
  top: PAGE_MARGINS_MM.top * MM_TO_PX,
  right: PAGE_MARGINS_MM.right * MM_TO_PX,
  bottom: PAGE_MARGINS_MM.bottom * MM_TO_PX,
  left: PAGE_MARGINS_MM.left * MM_TO_PX,
};

// Page sizes in mm for jsPDF
const PAGE_SIZES_MM = {
  a4: [210, 297],
  letter: [215.9, 279.4],
  legal: [215.9, 355.6],
};

async function loadHtml2Pdf(): Promise<void> {
  if (typeof window !== 'undefined' && window.html2pdf) {
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => setTimeout(resolve, 200);
    script.onerror = () => reject(new Error('Failed to load html2pdf library'));
    document.head.appendChild(script);
  });
}

async function loadImage(src: string): Promise<string> {
  if (!src || src.startsWith('data:')) return src;

  try {
    const url = src.startsWith('http') ? src : `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`;
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

function createCoverPage(
  coverData: CoverPageData,
  template: TemplateConfig,
  quoteNumber: string,
  logoBase64: string,
  width: number,
  height: number
): HTMLElement {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const coverPage = document.createElement('div');
  coverPage.className = 'pdf-cover-page';
  coverPage.style.cssText = `
    width: ${width}px;
    height: ${height}px;
    padding: 48px;
    box-sizing: border-box;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: white;
    display: flex;
    flex-direction: column;
    page-break-after: always;
    break-after: page;
  `;

  // Logo at top
  if (logoBase64) {
    const logoContainer = document.createElement('div');
    logoContainer.style.cssText = 'margin-bottom: 16px;';
    const logo = document.createElement('img');
    logo.src = logoBase64;
    logo.style.cssText = 'height: 48px; width: auto;';
    logoContainer.appendChild(logo);
    coverPage.appendChild(logoContainer);
  }

  // Estimate label
  const estimateLabel = document.createElement('div');
  estimateLabel.style.cssText = `
    margin-bottom: 32px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  `;
  estimateLabel.innerHTML = `
    <span style="color: ${template.mutedColor}">ESTIMATE </span>
    <span style="color: ${template.primaryColor}">#${quoteNumber}</span>
  `;
  coverPage.appendChild(estimateLabel);

  // Main title
  const titleContainer = document.createElement('div');
  titleContainer.style.cssText = 'margin-bottom: 24px;';

  const title = document.createElement('h1');
  title.style.cssText = `
    font-family: Poppins, Inter, sans-serif;
    font-size: 48px;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
    letter-spacing: -0.02em;
    color: ${template.primaryColor};
  `;
  title.textContent = coverData.title;
  titleContainer.appendChild(title);

  if (coverData.titleAccent) {
    const titleAccent = document.createElement('h1');
    titleAccent.style.cssText = `
      font-family: Poppins, Inter, sans-serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.1;
      margin: 0;
      letter-spacing: -0.02em;
      color: ${template.accentColor};
    `;
    titleAccent.textContent = coverData.titleAccent;
    titleContainer.appendChild(titleAccent);
  }
  coverPage.appendChild(titleContainer);

  // Subtitle
  if (coverData.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.style.cssText = `
      font-size: 14px;
      line-height: 1.6;
      color: ${template.textColor};
      margin: 0;
      max-width: 480px;
    `;
    subtitle.textContent = coverData.subtitle;
    coverPage.appendChild(subtitle);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.cssText = 'flex: 1;';
  coverPage.appendChild(spacer);

  // Bottom section
  const bottomSection = document.createElement('div');
  bottomSection.style.cssText = `
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
  `;

  // Prepared For
  const preparedFor = document.createElement('div');
  preparedFor.innerHTML = `
    <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${template.mutedColor}; margin-bottom: 16px;">
      PREPARED FOR
    </div>
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <svg width="20" height="20" fill="none" stroke="${template.mutedColor}" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <div>
        <div style="font-size: 13px; font-weight: 600; color: ${template.primaryColor};">${coverData.clientName || 'Client Name'}</div>
        <div style="font-size: 11px; color: ${template.mutedColor}; margin-top: 4px;">
          ${coverData.clientAddress || 'Address'}<br/>
          ${coverData.clientCity || 'City, State ZIP'}
        </div>
      </div>
    </div>
  `;
  bottomSection.appendChild(preparedFor);

  // Prepared By
  const preparedBy = document.createElement('div');
  preparedBy.innerHTML = `
    <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${template.mutedColor}; margin-bottom: 16px;">
      PREPARED BY
    </div>
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <div style="width: 40px; height: 40px; background: ${template.primaryColor}; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        ${logoBase64 ? `<img src="${logoBase64}" style="width: 24px; height: 24px; object-fit: contain;" />` : '<div style="width: 20px; height: 20px; background: white; border-radius: 4px;"></div>'}
      </div>
      <div>
        <div style="font-size: 13px; font-weight: 600; color: ${template.primaryColor};">${template.companyName}</div>
        <div style="font-size: 11px; color: ${template.mutedColor}; margin-top: 4px;">${template.companyTagline}</div>
        <div style="font-size: 11px; color: ${template.mutedColor}; margin-top: 12px; display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Issued: ${formattedDate}</span>
        </div>
      </div>
    </div>
  `;
  bottomSection.appendChild(preparedBy);

  coverPage.appendChild(bottomSection);

  return coverPage;
}

export async function generatePDF(
  htmlContent: string,
  template: TemplateConfig,
  exportConfig: ExportConfig,
  quoteNumber: string,
  coverData?: CoverPageData | null
): Promise<void> {
  await loadHtml2Pdf();

  const { pageSize, orientation, filename, quality } = exportConfig;

  const pageSizePx = PAGE_SIZES_PX[pageSize];
  const pageSizeMm = PAGE_SIZES_MM[pageSize];

  const baseWidth = orientation === 'portrait' ? pageSizePx.width : pageSizePx.height;
  const baseHeight = orientation === 'portrait' ? pageSizePx.height : pageSizePx.width;
  const width = baseWidth - PAGE_MARGINS_PX.left - PAGE_MARGINS_PX.right;
  const height = baseHeight - PAGE_MARGINS_PX.top - PAGE_MARGINS_PX.bottom;
  const mmSize = orientation === 'portrait' ? pageSizeMm : [pageSizeMm[1], pageSizeMm[0]];

  const logoBase64 = await loadImage(template.logoUrl);

  // Create container
  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: ${width}px;
    background: white;
  `;

  // Add cover page if we have cover data
  if (coverData && (coverData.title || coverData.titleAccent)) {
    const coverPage = createCoverPage(coverData, template, quoteNumber, logoBase64, width, height);
    container.appendChild(coverPage);
  }

  // Build document content
  const documentEl = document.createElement('div');
  documentEl.className = 'pdf-document';
  documentEl.style.cssText = `
    width: ${width}px;
    padding: 24px 32px;
    box-sizing: border-box;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: ${template.textColor};
    background: white;
  `;

  // Header - only show if no cover page
  if (!coverData || (!coverData.title && !coverData.titleAccent)) {
    const header = document.createElement('header');
    header.className = 'pdf-header avoid-break';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid ${template.primaryColor};
      page-break-inside: avoid;
      break-inside: avoid;
    `;

    const logoSection = document.createElement('div');
    logoSection.style.cssText = 'display: flex; align-items: center; gap: 12px;';

    if (logoBase64) {
      const logo = document.createElement('img');
      logo.src = logoBase64;
      logo.style.cssText = 'height: 40px; width: auto;';
      logoSection.appendChild(logo);
    }

    const companyInfo = document.createElement('div');
    companyInfo.innerHTML = `
      <div style="font-size: 20px; font-weight: 700; color: ${template.primaryColor}; margin: 0; line-height: 1.2;">
        ${template.companyName}
      </div>
      <div style="font-size: 11px; color: ${template.mutedColor}; margin: 0;">
        ${template.companyTagline}
      </div>
    `;
    logoSection.appendChild(companyInfo);

    const quoteInfo = document.createElement('div');
    quoteInfo.style.cssText = 'text-align: right; font-size: 11px;';

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + template.validityDays);
    const formattedValidUntil = validUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let quoteInfoHtml = '';
    if (template.showQuoteNumber) {
      quoteInfoHtml += `<div style="font-size: 14px; font-weight: 600; color: ${template.primaryColor}; margin-bottom: 4px;">${quoteNumber}</div>`;
    }
    if (exportConfig.includeDate && template.showDate) {
      quoteInfoHtml += `<div style="color: ${template.mutedColor};">Date: ${formattedDate}</div>`;
    }
    if (template.showValidityPeriod) {
      quoteInfoHtml += `<div style="color: ${template.mutedColor};">Valid until: ${formattedValidUntil}</div>`;
    }
    quoteInfo.innerHTML = quoteInfoHtml;

    header.appendChild(logoSection);
    header.appendChild(quoteInfo);
    documentEl.appendChild(header);
  }

  // Content
  const content = document.createElement('main');
  content.className = 'pdf-content';
  content.innerHTML = htmlContent;

  // Apply styles and page break rules to content elements
  content.querySelectorAll('h1').forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break-after';
    htmlEl.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      color: ${template.primaryColor};
      margin: ${index === 0 ? '0' : '24px'} 0 16px 0;
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    `;
  });

  content.querySelectorAll('h2').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break-after';
    htmlEl.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${template.secondaryColor};
      margin: 28px 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    `;
  });

  content.querySelectorAll('h3').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break-after';
    htmlEl.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      color: ${template.textColor};
      margin: 20px 0 8px 0;
      line-height: 1.3;
      page-break-after: avoid;
      break-after: avoid;
    `;
  });

  content.querySelectorAll('p').forEach((el) => {
    (el as HTMLElement).style.cssText = 'margin: 0 0 12px 0; line-height: 1.6; orphans: 3; widows: 3;';
  });

  // Wrap each section (h2 + following content) to avoid breaking in the middle
  const sections: HTMLElement[] = [];
  let currentSection: HTMLElement | null = null;

  Array.from(content.children).forEach((child) => {
    if (child.tagName === 'H2') {
      if (currentSection) sections.push(currentSection);
      currentSection = document.createElement('section');
      currentSection.className = 'pdf-section avoid-break';
      currentSection.style.cssText = 'page-break-inside: avoid; break-inside: avoid;';
      currentSection.appendChild(child.cloneNode(true));
    } else if (currentSection) {
      currentSection.appendChild(child.cloneNode(true));
    } else {
      const wrapper = document.createElement('div');
      wrapper.appendChild(child.cloneNode(true));
      sections.push(wrapper);
    }
  });
  if (currentSection) sections.push(currentSection);

  // Clear content and add sections
  content.innerHTML = '';
  sections.forEach((section) => content.appendChild(section));

  // Re-apply styles after restructuring
  content.querySelectorAll('ul, ol').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break';
    htmlEl.style.cssText = `
      margin: 0 0 12px 0;
      padding-left: 24px;
      page-break-inside: avoid;
      break-inside: avoid;
    `;
  });

  content.querySelectorAll('li').forEach((el) => {
    (el as HTMLElement).style.cssText = 'margin-bottom: 4px;';
  });

  content.querySelectorAll('table').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break';
    htmlEl.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11px;
      page-break-inside: avoid;
      break-inside: avoid;
    `;
  });

  content.querySelectorAll('th').forEach((el) => {
    (el as HTMLElement).style.cssText = `background: ${template.primaryColor}; color: white; padding: 10px 12px; text-align: left; font-weight: 600;`;
  });

  content.querySelectorAll('td').forEach((el) => {
    (el as HTMLElement).style.cssText = 'padding: 10px 12px; border-bottom: 1px solid #e5e7eb;';
  });

  content.querySelectorAll('tr:nth-child(even)').forEach((el) => {
    (el as HTMLElement).style.background = '#f9fafb';
  });

  content.querySelectorAll('blockquote').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.className = 'avoid-break';
    htmlEl.style.cssText = `
      background: #f8f9fa;
      border-left: 4px solid ${template.primaryColor};
      padding: 16px 20px;
      margin: 16px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    `;
  });

  content.querySelectorAll('hr').forEach((el) => {
    (el as HTMLElement).style.cssText = 'border: none; height: 1px; background: #e5e7eb; margin: 24px 0;';
  });

  content.querySelectorAll('code').forEach((el) => {
    (el as HTMLElement).style.cssText = 'background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;';
  });

  content.querySelectorAll('a').forEach((el) => {
    (el as HTMLElement).style.cssText = `color: ${template.primaryColor}; text-decoration: none;`;
  });

  content.querySelectorAll('strong').forEach((el) => {
    (el as HTMLElement).style.fontWeight = '600';
  });

  content.querySelectorAll('em').forEach((el) => {
    (el as HTMLElement).style.color = template.mutedColor;
  });

  documentEl.appendChild(content);

  // Footer - should not break
  if (template.showFooter) {
    const footer = document.createElement('footer');
    footer.className = 'pdf-footer avoid-break';
    footer.style.cssText = `
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: ${template.mutedColor};
      page-break-inside: avoid;
      break-inside: avoid;
    `;
    footer.innerHTML = `
      <div style="display: flex; gap: 16px;">
        <span>${template.contactEmail}</span>
        <span>${template.website}</span>
      </div>
      <div>${template.footerText}</div>
    `;
    documentEl.appendChild(footer);
  }

  container.appendChild(documentEl);
  document.body.appendChild(container);

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 300));

  const scale = quality === 'high' ? 3 : quality === 'standard' ? 2 : 1.5;

  const options: Html2PdfOptions = {
    margin: [PAGE_MARGINS_MM.top, PAGE_MARGINS_MM.left, PAGE_MARGINS_MM.bottom, PAGE_MARGINS_MM.right],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: mmSize,
      orientation,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: [],
      after: ['.pdf-cover-page'],
      avoid: ['.avoid-break', '.pdf-section', 'table', 'blockquote', 'ul', 'ol', '.pdf-header', '.pdf-footer'],
    },
  };

  try {
    const html2pdf = window.html2pdf;
    if (!html2pdf) throw new Error('html2pdf not loaded');
    await html2pdf().set(options).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}

export function generatePreviewStyles(template: TemplateConfig): string {
  return `
    .preview-content h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${template.primaryColor};
      margin-bottom: 16px;
      margin-top: 24px;
    }
    .preview-content h1:first-child { margin-top: 0; }
    .preview-content h2 {
      font-size: 18px;
      font-weight: 600;
      color: ${template.secondaryColor};
      margin-bottom: 12px;
      margin-top: 24px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .preview-content h3 {
      font-size: 14px;
      font-weight: 600;
      color: ${template.textColor};
      margin-bottom: 8px;
      margin-top: 16px;
    }
    .preview-content p { margin-bottom: 12px; }
    .preview-content ul, .preview-content ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }
    .preview-content li { margin-bottom: 4px; }
    .preview-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11px;
    }
    .preview-content th {
      background: ${template.primaryColor};
      color: white;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
    }
    .preview-content td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .preview-content tr:nth-child(even) { background: #f9fafb; }
    .preview-content blockquote {
      background: linear-gradient(135deg, ${template.primaryColor}08, ${template.primaryColor}15);
      border-left: 4px solid ${template.primaryColor};
      padding: 16px 20px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
    }
    .preview-content blockquote strong { color: ${template.primaryColor}; }
    .preview-content hr {
      border: none;
      height: 1px;
      background: #e5e7eb;
      margin: 24px 0;
    }
    .preview-content code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.9em;
    }
    .preview-content a { color: ${template.primaryColor}; text-decoration: none; }
    .preview-content em { color: ${template.mutedColor}; }
  `;
}
