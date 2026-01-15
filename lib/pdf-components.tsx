'use client';

import React from 'react';
import { Document, Page, Text, View, Image, Link, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { TemplateConfig, ExportConfig, CoverPageData } from '@/types';
import { CaseStudy } from '@/lib/case-studies';

// Track if fonts have been registered
let fontsRegistered = false;

// Register fonts dynamically with absolute URLs
function registerFonts() {
  if (fontsRegistered) return;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Register Inter font from local files
  Font.register({
    family: 'Inter',
    fonts: [
      { src: `${origin}/fonts/Inter-Regular.ttf`, fontWeight: 400 },
      { src: `${origin}/fonts/Inter-Medium.ttf`, fontWeight: 500 },
      { src: `${origin}/fonts/Inter-SemiBold.ttf`, fontWeight: 600 },
      { src: `${origin}/fonts/Inter-Bold.ttf`, fontWeight: 700 },
    ],
  });

  // Register Poppins font from local files
  Font.register({
    family: 'Poppins',
    fonts: [
      { src: `${origin}/fonts/Poppins-Regular.ttf`, fontWeight: 400 },
      { src: `${origin}/fonts/Poppins-Medium.ttf`, fontWeight: 500 },
      { src: `${origin}/fonts/Poppins-SemiBold.ttf`, fontWeight: 600 },
      { src: `${origin}/fonts/Poppins-Bold.ttf`, fontWeight: 700 },
    ],
  });

  // Disable hyphenation for cleaner text
  Font.registerHyphenationCallback(word => [word]);

  fontsRegistered = true;
}

interface ParsedSection {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'table' | 'blockquote' | 'hr';
  content: string;
  items?: string[];
  rows?: string[][];
  headers?: string[];
}

interface PDFDocumentProps {
  sections: ParsedSection[];
  template: TemplateConfig;
  exportConfig: ExportConfig;
  quoteNumber: string;
  coverData?: CoverPageData | null;
  logoBase64?: string;
  caseStudies: CaseStudy[];
}

const PAGE_SIZES: Record<string, 'A4' | 'LETTER' | 'LEGAL'> = {
  a4: 'A4',
  letter: 'LETTER',
  legal: 'LEGAL',
};

// Export function to generate PDF blob
export async function createPDFBlob(props: PDFDocumentProps): Promise<Blob> {
  // Register fonts before creating PDF
  registerFonts();

  const { sections, template, exportConfig, quoteNumber, coverData, logoBase64, caseStudies } = props;
  const pageSize = PAGE_SIZES[exportConfig.pageSize] || 'A4';

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const hasCover = coverData && (coverData.title || coverData.titleAccent);

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Inter',
      fontSize: 11,
      paddingTop: 40,
      paddingBottom: 60,
      paddingHorizontal: 50,
      backgroundColor: '#ffffff',
      lineHeight: 1.6,
    },
    coverPage: {
      fontFamily: 'Inter',
      padding: 50,
      backgroundColor: '#0A0A0A',
      position: 'relative',
    },
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 64,
    },
    coverLogo: {
      width: 48,
      height: 48,
    },
    coverEstimateBadge: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 1,
      color: '#9547FF',
      backgroundColor: '#1a1a2e',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    coverTitle: {
      fontFamily: 'Poppins',
      fontSize: 42,
      fontWeight: 700,
      lineHeight: 1.1,
      marginBottom: 8,
      letterSpacing: -1,
      color: '#FFFFFF',
    },
    coverTitleAccent: {
      fontFamily: 'Poppins',
      fontSize: 42,
      fontWeight: 700,
      lineHeight: 1.1,
      marginBottom: 8,
      letterSpacing: -1,
      color: '#DFF95F',
    },
    coverSubtitle: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.6,
      marginTop: 16,
      maxWidth: 320,
      color: '#94A3B8',
    },
    coverBottom: {
      position: 'absolute',
      bottom: 50,
      left: 50,
      right: 50,
      flexDirection: 'row',
      gap: 16,
    },
    coverCard: {
      flex: 1,
      backgroundColor: '#141414',
      borderRadius: 16,
      padding: 20,
    },
    coverSectionLabel: {
      fontFamily: 'Inter',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: 1.5,
      marginBottom: 16,
      color: '#64748B',
    },
    coverCardRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    coverIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    coverIconBoxClient: {
      backgroundColor: '#2a1a1c',
    },
    coverIconBoxCompany: {
      backgroundColor: '#9547FF',
    },
    coverCompanyName: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 600,
      color: '#FFFFFF',
    },
    coverCompanyTagline: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 400,
      marginTop: 2,
      color: '#64748B',
    },
    coverDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#1e1e2e',
      gap: 8,
    },
    coverDate: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 400,
      color: '#94A3B8',
    },
    h1: {
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 14,
      lineHeight: 1.3,
    },
    h2: {
      fontFamily: 'Poppins',
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 10,
      marginTop: 24,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Poppins',
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 8,
      marginTop: 16,
      lineHeight: 1.3,
    },
    paragraph: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 400,
      lineHeight: 1.7,
      marginBottom: 10,
    },
    listContainer: {
      marginBottom: 12,
      paddingLeft: 16,
    },
    listItem: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 400,
      lineHeight: 1.6,
      marginBottom: 4,
      flexDirection: 'row',
    },
    listBullet: {
      width: 16,
      fontSize: 11,
    },
    listContent: {
      flex: 1,
    },
    table: {
      marginVertical: 12,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#1e293b',
    },
    tableHeaderCell: {
      fontFamily: 'Inter',
      padding: 8,
      fontSize: 10,
      fontWeight: 600,
      color: '#ffffff',
      flex: 1,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    tableRowEven: {
      backgroundColor: '#f9fafb',
    },
    tableCell: {
      fontFamily: 'Inter',
      padding: 8,
      fontSize: 10,
      fontWeight: 400,
      flex: 1,
    },
    blockquote: {
      backgroundColor: '#f8fafc',
      borderLeftWidth: 3,
      padding: 14,
      marginVertical: 12,
    },
    blockquoteText: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      marginVertical: 20,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 50,
      right: 50,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 9,
    },
    // Case Studies Page Styles
    caseStudiesPage: {
      fontFamily: 'Inter',
      padding: 50,
      backgroundColor: '#0A0A0A',
      position: 'relative',
    },
    caseStudiesHeader: {
      marginBottom: 40,
    },
    caseStudiesBadge: {
      fontFamily: 'Inter',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: 1,
      color: '#9547FF',
      backgroundColor: '#1a1a2e',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    caseStudiesTitle: {
      fontFamily: 'Poppins',
      fontSize: 28,
      fontWeight: 700,
      color: '#FFFFFF',
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    caseStudiesSubtitle: {
      fontFamily: 'Inter',
      fontSize: 11,
      color: '#64748B',
      maxWidth: 320,
    },
    caseStudyRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#1e1e2e',
      gap: 12,
    },
    caseStudyRowLast: {
      borderBottomWidth: 0,
    },
    caseStudyNumber: {
      width: 28,
      height: 28,
      backgroundColor: '#1a1a2e',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    caseStudyNumberText: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 600,
      color: '#9547FF',
    },
    caseStudyContent: {
      flex: 1,
    },
    caseStudyTitle: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 600,
      color: '#FFFFFF',
      marginBottom: 3,
    },
    caseStudySummary: {
      fontFamily: 'Inter',
      fontSize: 9,
      color: '#64748B',
      lineHeight: 1.4,
    },
    caseStudiesCta: {
      borderTopWidth: 1,
      borderTopColor: '#1e1e2e',
      paddingTop: 16,
      marginTop: 24,
      alignItems: 'center',
    },
    caseStudiesCtaText: {
      fontFamily: 'Inter',
      fontSize: 11,
      color: '#64748B',
    },
    caseStudiesCtaLink: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 600,
      color: '#DFF95F',
    },
    caseStudiesFooter: {
      position: 'absolute',
      bottom: 30,
      left: 50,
      right: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    caseStudiesFooterLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    caseStudiesFooterLogo: {
      width: 16,
      height: 16,
    },
    caseStudiesFooterText: {
      fontFamily: 'Inter',
      fontSize: 9,
      color: '#64748B',
    },
  });

  const doc = (
    <Document>
      {hasCover && (
        <Page size={pageSize} style={styles.coverPage}>
          {/* Header with Logo and Estimate Badge */}
          <View style={styles.coverHeader}>
            {logoBase64 && <Image src={logoBase64} style={styles.coverLogo} />}
            <Text style={styles.coverEstimateBadge}>ESTIMATE #{quoteNumber}</Text>
          </View>

          {/* Main Title */}
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.coverTitle}>{coverData?.title}</Text>
            {coverData?.titleAccent && (
              <Text style={styles.coverTitleAccent}>{coverData.titleAccent}</Text>
            )}
          </View>

          {/* Subtitle */}
          {coverData?.subtitle && (
            <Text style={styles.coverSubtitle}>{coverData.subtitle}</Text>
          )}

          {/* Bottom Cards */}
          <View style={styles.coverBottom}>
            {/* Prepared For Card */}
            <View style={styles.coverCard}>
              <Text style={styles.coverSectionLabel}>PREPARED FOR</Text>
              <View style={styles.coverCardRow}>
                <View style={[styles.coverIconBox, styles.coverIconBoxClient]}>
                  <Text style={{ fontSize: 16, color: '#FF707A' }}>🏢</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.coverCompanyName}>
                    {coverData?.clientName || 'Client Name'}
                  </Text>
                  <Text style={styles.coverCompanyTagline}>
                    {coverData?.clientAddress || 'Address'}
                  </Text>
                  <Text style={styles.coverCompanyTagline}>
                    {coverData?.clientCity || 'City, State ZIP'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Prepared By Card */}
            <View style={styles.coverCard}>
              <Text style={styles.coverSectionLabel}>PREPARED BY</Text>
              <View style={styles.coverCardRow}>
                <View style={[styles.coverIconBox, styles.coverIconBoxCompany]}>
                  {logoBase64 ? (
                    <Image src={logoBase64} style={{ width: 24, height: 24 }} />
                  ) : (
                    <View style={{ width: 20, height: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.coverCompanyName}>{template.companyName}</Text>
                  <Text style={styles.coverCompanyTagline}>{template.companyTagline}</Text>
                </View>
              </View>
              <View style={styles.coverDateRow}>
                <Text style={{ fontSize: 12, color: '#9547FF' }}>📅</Text>
                <Text style={styles.coverDate}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </Page>
      )}

      <Page size={pageSize} orientation={exportConfig.orientation} style={styles.page}>
        {sections.map((section, index) => {
          switch (section.type) {
            case 'h1':
              return (
                <Text
                  key={`h1-${index}`}
                  style={[styles.h1, { color: template.primaryColor, marginTop: index === 0 ? 0 : 20 }]}
                >
                  {section.content}
                </Text>
              );
            case 'h2':
              return (
                <Text key={`h2-${index}`} style={[styles.h2, { color: template.secondaryColor }]}>
                  {section.content}
                </Text>
              );
            case 'h3':
              return (
                <Text key={`h3-${index}`} style={[styles.h3, { color: template.textColor }]}>
                  {section.content}
                </Text>
              );
            case 'p':
              return (
                <Text key={`p-${index}`} style={[styles.paragraph, { color: template.textColor }]}>
                  {section.content}
                </Text>
              );
            case 'ul':
            case 'ol':
              return (
                <View key={`list-${index}`} style={styles.listContainer}>
                  {section.items?.map((item, i) => (
                    <View key={`item-${i}`} style={styles.listItem}>
                      <Text style={[styles.listBullet, { color: template.textColor }]}>
                        {section.type === 'ul' ? '•' : `${i + 1}.`}
                      </Text>
                      <Text style={[styles.listContent, { color: template.textColor }]}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            case 'table':
              return (
                <View key={`table-${index}`} style={styles.table}>
                  {section.headers && section.headers.length > 0 && (
                    <View style={[styles.tableHeader, { backgroundColor: template.primaryColor }]}>
                      {section.headers.map((header, i) => (
                        <Text key={`th-${i}`} style={styles.tableHeaderCell}>
                          {header}
                        </Text>
                      ))}
                    </View>
                  )}
                  {section.rows?.map((row, rowIndex) => (
                    <View
                      key={`row-${rowIndex}`}
                      style={[styles.tableRow, rowIndex % 2 === 1 ? styles.tableRowEven : {}]}
                    >
                      {row.map((cell, cellIndex) => (
                        <Text
                          key={`cell-${cellIndex}`}
                          style={[styles.tableCell, { color: template.textColor }]}
                        >
                          {cell}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              );
            case 'blockquote':
              return (
                <View
                  key={`quote-${index}`}
                  style={[styles.blockquote, { borderLeftColor: template.primaryColor }]}
                >
                  <Text style={[styles.blockquoteText, { color: template.primaryColor }]}>
                    {section.content}
                  </Text>
                </View>
              );
            case 'hr':
              return <View key={`hr-${index}`} style={styles.hr} />;
            default:
              return null;
          }
        })}

        {template.showFooter && (
          <View style={styles.footer} fixed>
            <Text style={{ color: template.mutedColor }}>
              {template.contactEmail} | {template.website}
            </Text>
            <Text style={{ color: template.mutedColor }}>{template.footerText}</Text>
          </View>
        )}
      </Page>

      {/* Case Studies Page */}
      {caseStudies.length > 0 && (
        <Page size={pageSize} style={styles.caseStudiesPage}>
          {/* Header */}
          <View style={styles.caseStudiesHeader}>
            <Text style={styles.caseStudiesBadge}>PORTFOLIO</Text>
            <Text style={styles.caseStudiesTitle}>Our Work Speaks</Text>
            <Text style={styles.caseStudiesSubtitle}>
              Explore how we've helped businesses transform their operations.
            </Text>
          </View>

          {/* Case Studies List */}
          <View>
            {caseStudies.map((study, index) => (
              <Link
                key={study.id}
                src={study.link}
                style={[
                  styles.caseStudyRow,
                  index === caseStudies.length - 1 ? styles.caseStudyRowLast : {},
                ]}
              >
                <View style={styles.caseStudyNumber}>
                  <Text style={styles.caseStudyNumberText}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.caseStudyContent}>
                  <Text style={styles.caseStudyTitle}>{study.title}</Text>
                  <Text style={styles.caseStudySummary}>{study.summary}</Text>
                </View>
              </Link>
            ))}
          </View>

          {/* CTA */}
          <Link src="https://brokenrubik.com/case-studies" style={styles.caseStudiesCta}>
            <Text style={styles.caseStudiesCtaText}>
              View all case studies at{' '}
              <Text style={styles.caseStudiesCtaLink}>brokenrubik.com/case-studies</Text>
            </Text>
          </Link>

          {/* Footer */}
          <View style={styles.caseStudiesFooter}>
            <View style={styles.caseStudiesFooterLeft}>
              {logoBase64 && <Image src={logoBase64} style={styles.caseStudiesFooterLogo} />}
              <Text style={styles.caseStudiesFooterText}>{template.companyName}</Text>
            </View>
            <Text style={styles.caseStudiesFooterText}>{template.website}</Text>
          </View>
        </Page>
      )}
    </Document>
  );

  return pdf(doc).toBlob();
}
