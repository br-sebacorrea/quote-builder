'use client';

import { useMemo, useState, useEffect } from 'react';
import { TemplateConfig } from '@/types';
import { parseMarkdownWithCover } from '@/lib/markdown';
import { generatePreviewStyles } from '@/lib/pdf';
import Image from 'next/image';

interface PreviewProps {
  content: string;
  template: TemplateConfig;
  quoteNumber: string;
}

export default function Preview({ content, template, quoteNumber }: PreviewProps) {
  const [formattedDate, setFormattedDate] = useState('');

  const { coverData, html: htmlContent } = useMemo(
    () => parseMarkdownWithCover(content),
    [content]
  );
  const previewStyles = useMemo(() => generatePreviewStyles(template), [template]);

  useEffect(() => {
    const today = new Date();
    setFormattedDate(today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }));
  }, []);

  return (
    <div className="h-full overflow-auto bg-gray-100 p-8">
      <style dangerouslySetInnerHTML={{ __html: previewStyles }} />

      {/* Cover Page */}
      {coverData && (
        <div
          className="max-w-[816px] mx-auto bg-white shadow-lg mb-8"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '1056px',
            position: 'relative',
          }}
        >
          <div className="p-12 flex flex-col h-full" style={{ minHeight: '1056px' }}>
            {/* Logo at top */}
            <div className="mb-4">
              {template.logoUrl && (
                <Image
                  src={template.logoUrl}
                  alt={template.companyName}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              )}
            </div>

            {/* Estimate Label */}
            <div className="mb-8">
              <span
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: template.mutedColor }}
              >
                ESTIMATE{' '}
                <span style={{ color: template.primaryColor }}>#{quoteNumber}</span>
              </span>
            </div>

            {/* Main Title */}
            <div className="mb-6">
              <h1
                className="text-5xl font-bold leading-tight m-0"
                style={{
                  fontFamily: 'Poppins, Inter, sans-serif',
                  color: template.primaryColor,
                  letterSpacing: '-0.02em',
                }}
              >
                {coverData.title}
                {coverData.titleAccent && (
                  <>
                    <br />
                    <span style={{ color: template.accentColor }}>
                      {coverData.titleAccent}
                    </span>
                  </>
                )}
              </h1>
            </div>

            {/* Subtitle */}
            {coverData.subtitle && (
              <p
                className="text-base leading-relaxed max-w-lg m-0"
                style={{ color: template.textColor }}
              >
                {coverData.subtitle}
              </p>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Section */}
            <div
              className="pt-6"
              style={{ borderTop: `1px solid #e5e7eb` }}
            >
              <div className="flex justify-between items-start">
                {/* Prepared For */}
                <div>
                  <div
                    className="text-xs font-semibold tracking-wider uppercase mb-4"
                    style={{ color: template.mutedColor }}
                  >
                    PREPARED FOR
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#f1f5f9' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke={template.mutedColor}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ color: template.primaryColor }}
                      >
                        {coverData.clientName || 'Client Name'}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: template.mutedColor }}
                      >
                        {coverData.clientAddress || 'Address'}
                        <br />
                        {coverData.clientCity || 'City, State ZIP'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prepared By */}
                <div>
                  <div
                    className="text-xs font-semibold tracking-wider uppercase mb-4"
                    style={{ color: template.mutedColor }}
                  >
                    PREPARED BY
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: template.primaryColor }}
                    >
                      {template.logoUrl ? (
                        <Image
                          src={template.logoUrl}
                          alt={template.companyName}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded bg-white" />
                      )}
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ color: template.primaryColor }}
                      >
                        {template.companyName}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: template.mutedColor }}
                      >
                        {template.companyTagline}
                      </div>
                      <div
                        className="text-xs mt-3 flex items-center gap-2"
                        style={{ color: template.mutedColor }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Issued: {formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Page */}
      <div
        className="max-w-[816px] mx-auto bg-white shadow-lg"
        style={{
          fontFamily: template.fontFamily,
          fontSize: template.baseFontSize,
          color: template.textColor,
          lineHeight: 1.6,
        }}
      >
        <div style={{ padding: template.pagePadding }}>
          {/* Header - only show if no cover page */}
          {!coverData && (
            <header
              className="flex justify-between items-start mb-8 pb-6"
              style={{ borderBottom: `2px solid ${template.primaryColor}` }}
            >
              <div className="flex items-center gap-3">
                {template.logoUrl && (
                  <Image
                    src={template.logoUrl}
                    alt={template.companyName}
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                )}
                <div>
                  <h1
                    className="text-xl font-bold m-0 leading-tight"
                    style={{ color: template.primaryColor }}
                  >
                    {template.companyName}
                  </h1>
                  <p className="text-xs m-0" style={{ color: template.mutedColor }}>
                    {template.companyTagline}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                {template.showQuoteNumber && (
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: template.primaryColor }}
                  >
                    {quoteNumber}
                  </div>
                )}
                {template.showDate && (
                  <div style={{ color: template.mutedColor }}>Date: {formattedDate}</div>
                )}
                {template.showValidityPeriod && (
                  <div style={{ color: template.mutedColor }}>
                    Valid for {template.validityDays} days
                  </div>
                )}
              </div>
            </header>
          )}

          {/* Content */}
          <main
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Footer */}
          {template.showFooter && (
            <footer
              className="mt-8 pt-4 flex justify-between items-center text-xs"
              style={{
                borderTop: '1px solid #e5e7eb',
                color: template.mutedColor,
              }}
            >
              <div className="flex gap-4">
                <span>{template.contactEmail}</span>
                <span>{template.website}</span>
              </div>
              <div>{template.footerText}</div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
