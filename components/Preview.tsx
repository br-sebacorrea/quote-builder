'use client';

import { useMemo, useState, useEffect } from 'react';
import { TemplateConfig } from '@/types';
import { parseMarkdownWithCover } from '@/lib/markdown';
import { generatePreviewStyles } from '@/lib/pdf';
import { CaseStudy } from '@/lib/case-studies';
import Image from 'next/image';

interface PreviewProps {
  content: string;
  template: TemplateConfig;
  quoteNumber: string;
  selectedCaseStudies: CaseStudy[];
}

export default function Preview({ content, template, quoteNumber, selectedCaseStudies }: PreviewProps) {
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

      {/* Cover Page - Dark Theme */}
      {coverData && (
        <div
          className="max-w-[816px] mx-auto shadow-2xl mb-8 overflow-hidden"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '1056px',
            position: 'relative',
            backgroundColor: '#0A0A0A',
          }}
        >
          {/* Gradient Glow Effect */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #9547FF 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-32 left-0 w-64 h-64 opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #DFF95F 0%, transparent 70%)',
            }}
          />

          <div className="relative p-12 flex flex-col h-full" style={{ minHeight: '1056px' }}>
            {/* Top Bar: Logo + Estimate Badge */}
            <div className="flex items-center justify-between mb-16">
              {template.logoUrl && (
                <Image
                  src={template.logoUrl}
                  alt={template.companyName}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              )}
              <div
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider"
                style={{
                  backgroundColor: 'rgba(149, 71, 255, 0.15)',
                  color: '#9547FF',
                  border: '1px solid rgba(149, 71, 255, 0.3)',
                }}
              >
                ESTIMATE #{quoteNumber}
              </div>
            </div>

            {/* Main Title */}
            <div className="mb-8">
              <h1
                className="text-6xl font-bold leading-none m-0"
                style={{
                  fontFamily: 'Poppins, Inter, sans-serif',
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                }}
              >
                {coverData.title}
              </h1>
              {coverData.titleAccent && (
                <h1
                  className="text-6xl font-bold leading-none m-0 mt-2"
                  style={{
                    fontFamily: 'Poppins, Inter, sans-serif',
                    color: '#DFF95F',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {coverData.titleAccent}
                </h1>
              )}
            </div>

            {/* Subtitle */}
            {coverData.subtitle && (
              <p
                className="text-base leading-relaxed max-w-md m-0"
                style={{ color: '#94A3B8' }}
              >
                {coverData.subtitle}
              </p>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Prepared For Card */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: '#64748B' }}
                >
                  Prepared For
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 112, 122, 0.15)',
                      border: '1px solid rgba(255, 112, 122, 0.3)',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="#FF707A"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {coverData.clientName || 'Client Name'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                      {coverData.clientAddress || 'Address'}
                    </div>
                    <div className="text-xs" style={{ color: '#64748B' }}>
                      {coverData.clientCity || 'City, State ZIP'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prepared By Card */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: '#64748B' }}
                >
                  Prepared By
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: '#9547FF',
                    }}
                  >
                    {template.logoUrl ? (
                      <Image
                        src={template.logoUrl}
                        alt={template.companyName}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain brightness-0 invert"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded bg-white/20" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {template.companyName}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                      {template.companyTagline}
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 mt-4 pt-3"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="#9547FF"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    {formattedDate}
                  </span>
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

      {/* Case Studies Page - Dark Theme */}
      {selectedCaseStudies.length > 0 && (
      <div
        className="max-w-[816px] mx-auto shadow-2xl mt-8 overflow-hidden"
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          minHeight: '1056px',
          position: 'relative',
          backgroundColor: '#0A0A0A',
        }}
      >
        <div className="relative p-12">
          {/* Header */}
          <div className="mb-12">
            <div
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4"
              style={{
                backgroundColor: '#1a1a2e',
                color: '#9547FF',
              }}
            >
              PORTFOLIO
            </div>
            <h2
              className="text-3xl font-bold m-0"
              style={{
                fontFamily: 'Poppins, Inter, sans-serif',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Our Work Speaks
            </h2>
            <p className="text-sm mt-2 max-w-md" style={{ color: '#64748B' }}>
              Explore how we&apos;ve helped businesses transform their operations.
            </p>
          </div>

          {/* Case Studies List */}
          <div className="space-y-4">
            {selectedCaseStudies.map((study, index) => (
              <div
                key={study.id}
                className="flex items-start gap-4 py-4"
                style={{
                  borderBottom: index < selectedCaseStudies.length - 1 ? '1px solid #1e1e2e' : 'none',
                }}
              >
                {/* Number */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{
                    backgroundColor: '#1a1a2e',
                    color: '#9547FF',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: '#FFFFFF' }}
                  >
                    {study.title}
                  </h3>
                  <p
                    className="text-xs m-0"
                    style={{ color: '#64748B' }}
                  >
                    {study.summary}
                  </p>
                </div>
                {/* Arrow */}
                <div className="shrink-0" style={{ color: '#9547FF' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="mt-10 py-4 text-center"
            style={{
              borderTop: '1px solid #1e1e2e',
            }}
          >
            <p className="text-sm m-0" style={{ color: '#64748B' }}>
              View all case studies at{' '}
              <span style={{ color: '#DFF95F', fontWeight: 600 }}>
                brokenrubik.com/case-studies
              </span>
            </p>
          </div>

          {/* Footer */}
          <div
            className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-xs"
            style={{ color: '#64748B' }}
          >
            <div className="flex items-center gap-2">
              {template.logoUrl && (
                <Image
                  src={template.logoUrl}
                  alt={template.companyName}
                  width={20}
                  height={20}
                  className="h-5 w-auto object-contain opacity-60"
                />
              )}
              <span>{template.companyName}</span>
            </div>
            <span>{template.website}</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
