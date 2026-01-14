import { TemplateConfig } from '@/types';

export const defaultTemplate: TemplateConfig = {
  // Company Info - BrokenRubik branding
  companyName: 'BrokenRubik Inc.',
  companyTagline: 'Specialized NetSuite Engineering',
  contactEmail: 'contact@brokenrubik.co',
  website: 'brokenrubik.com',
  logoUrl: '/logo.webp',

  // Colors - Professional theme inspired by BrokenRubik
  primaryColor: '#1e293b',      // Slate-800 - main dark blue-gray
  secondaryColor: '#334155',    // Slate-700 - section headers
  accentColor: '#64748b',       // Slate-500 - accent text
  textColor: '#334155',         // Slate-700 - body text
  mutedColor: '#64748b',        // Slate-500 - muted text
  backgroundColor: '#ffffff',   // White

  // Typography
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  baseFontSize: '11pt',

  // Header
  showQuoteNumber: true,
  showDate: true,
  showValidityPeriod: true,
  validityDays: 30,
  quotePrefix: 'BR',

  // Footer
  footerText: 'Thank you for considering BrokenRubik for your project.',
  showFooter: true,

  // Spacing
  pagePadding: '48px 56px',
};

export const defaultMarkdown = `---
title: NetSuite ERP Optimization &
titleAccent: Shopify Integration.
subtitle: A comprehensive proposal to stabilize your ERP environment, automate order-to-cash workflows, and implement a scalable B2B portal.
clientName: Acme Industries Inc.
clientAddress: 100 Innovation Dr, Suite 500
clientCity: San Francisco, CA 94105
---

## Executive Summary

This proposal outlines a comprehensive solution to optimize your NetSuite ERP environment and integrate it seamlessly with your Shopify e-commerce platform. Our approach focuses on three key areas:

- **ERP Stabilization**: Address performance bottlenecks and data integrity issues
- **Workflow Automation**: Streamline order-to-cash and procure-to-pay processes
- **B2B Portal Implementation**: Create a scalable self-service portal for your wholesale customers

## Scope of Work

### Phase 1: Discovery & Assessment

During the discovery phase, we will conduct a thorough analysis of your current NetSuite environment:

- Comprehensive audit of existing customizations and scripts
- Performance analysis and bottleneck identification
- Data integrity review and cleanup recommendations
- Integration architecture assessment
- Stakeholder interviews to understand pain points

### Phase 2: ERP Optimization

Based on our findings, we will implement the following optimizations:

- Script refactoring for improved performance
- Saved search optimization
- Role and permission restructuring
- Custom record cleanup and consolidation
- Scheduled script efficiency improvements

### Phase 3: Shopify Integration

Our integration approach ensures real-time synchronization between platforms:

- Bidirectional inventory sync
- Order import with custom field mapping
- Customer data synchronization
- Product information management
- Fulfillment status updates

### Phase 4: B2B Portal Development

A custom SuiteCommerce implementation tailored to your wholesale business:

- Customer-specific pricing and catalogs
- Quick order functionality
- Order history and reordering
- Account statement access
- Credit limit management

## Investment Summary

| Phase | Description | Hours | Rate | Total |
|-------|-------------|-------|------|-------|
| Phase 1 | Discovery & Assessment | 24 | $175 | $4,200 |
| Phase 2 | ERP Optimization | 48 | $175 | $8,400 |
| Phase 3 | Shopify Integration | 64 | $175 | $11,200 |
| Phase 4 | B2B Portal | 80 | $175 | $14,000 |
| - | Project Management | 20 | $150 | $3,000 |
| - | QA & Testing | 24 | $150 | $3,600 |

> **Total Investment: $44,400 USD**

## Project Timeline

The project will be delivered over a 12-week period:

1. **Weeks 1-2**: Discovery & Assessment
2. **Weeks 3-5**: ERP Optimization
3. **Weeks 6-9**: Shopify Integration Development
4. **Weeks 10-12**: B2B Portal Development & Go-Live

## Deliverables

Upon project completion, you will receive:

- Fully optimized NetSuite environment
- Real-time Shopify integration
- Custom B2B portal with wholesale features
- Complete technical documentation
- Admin training sessions (4 hours)
- End-user training sessions (8 hours)
- 30 days of post-launch support

## Terms & Conditions

- 50% deposit required to commence work
- Remaining balance due upon project completion
- Change requests quoted separately
- This proposal is valid for 30 days

## Next Steps

1. Review and approve this proposal
2. Sign Statement of Work
3. Submit initial deposit
4. Schedule project kickoff meeting

---

*Questions? Contact us at contact@brokenrubik.co*
`;
