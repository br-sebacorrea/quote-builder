'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { TemplateConfig, ExportConfig, CoverPageData } from '@/types';

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

  const { sections, template, exportConfig, quoteNumber, coverData, logoBase64 } = props;
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
      backgroundColor: '#ffffff',
    },
    coverLogo: {
      width: 48,
      height: 48,
      marginBottom: 16,
    },
    coverEstimateLabel: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 1,
      marginBottom: 32,
    },
    coverTitle: {
      fontFamily: 'Poppins',
      fontSize: 38,
      fontWeight: 700,
      lineHeight: 1.1,
      marginBottom: 4,
      letterSpacing: -0.5,
    },
    coverSubtitle: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.6,
      marginTop: 16,
      maxWidth: 400,
    },
    coverBottom: {
      position: 'absolute',
      bottom: 50,
      left: 50,
      right: 50,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingTop: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    coverSection: {
      width: '45%',
    },
    coverSectionLabel: {
      fontFamily: 'Inter',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: 1,
      marginBottom: 12,
    },
    coverCompanyName: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 600,
    },
    coverCompanyTagline: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 400,
      marginTop: 2,
    },
    coverDate: {
      fontFamily: 'Inter',
      fontSize: 10,
      fontWeight: 400,
      marginTop: 10,
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
  });

  const doc = (
    <Document>
      {hasCover && (
        <Page size={pageSize} style={styles.coverPage}>
          {logoBase64 && <Image src={logoBase64} style={styles.coverLogo} />}

          <Text style={styles.coverEstimateLabel}>
            <Text style={{ color: template.mutedColor }}>ESTIMATE </Text>
            <Text style={{ color: template.primaryColor }}>#{quoteNumber}</Text>
          </Text>

          <Text style={[styles.coverTitle, { color: template.primaryColor }]}>
            {coverData?.title}
          </Text>
          {coverData?.titleAccent && (
            <Text style={[styles.coverTitle, { color: template.accentColor }]}>
              {coverData.titleAccent}
            </Text>
          )}

          {coverData?.subtitle && (
            <Text style={[styles.coverSubtitle, { color: template.textColor }]}>
              {coverData.subtitle}
            </Text>
          )}

          <View style={styles.coverBottom}>
            <View style={styles.coverSection}>
              <Text style={[styles.coverSectionLabel, { color: template.mutedColor }]}>
                PREPARED FOR
              </Text>
              <Text style={[styles.coverCompanyName, { color: template.primaryColor }]}>
                {coverData?.clientName || 'Client Name'}
              </Text>
              <Text style={[styles.coverCompanyTagline, { color: template.mutedColor }]}>
                {coverData?.clientAddress || 'Address'}
              </Text>
              <Text style={[styles.coverCompanyTagline, { color: template.mutedColor }]}>
                {coverData?.clientCity || 'City, State ZIP'}
              </Text>
            </View>

            <View style={styles.coverSection}>
              <Text style={[styles.coverSectionLabel, { color: template.mutedColor }]}>
                PREPARED BY
              </Text>
              <Text style={[styles.coverCompanyName, { color: template.primaryColor }]}>
                {template.companyName}
              </Text>
              <Text style={[styles.coverCompanyTagline, { color: template.mutedColor }]}>
                {template.companyTagline}
              </Text>
              <Text style={[styles.coverDate, { color: template.mutedColor }]}>
                Issued: {formattedDate}
              </Text>
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
    </Document>
  );

  return pdf(doc).toBlob();
}
