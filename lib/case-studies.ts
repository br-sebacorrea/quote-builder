export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  link: string;
  category: string;
}

// All available case studies
export const allCaseStudies: CaseStudy[] = [
  {
    id: 'dynamic-promotions',
    title: 'Dynamic Promotions in NetSuite SuiteCommerce',
    summary: 'Turning manual promotion pages into dynamic, automated experiences',
    link: 'https://brokenrubik.com/case-studies/dynamic-promotions-in-netsuite-suitecommerce',
    category: 'SuiteCommerce',
  },
  {
    id: 'shopify-netsuite',
    title: 'Shopify Ordering, NetSuite Processing',
    summary: 'Unified NetSuite and Shopify integration for seamless order flow',
    link: 'https://brokenrubik.com/case-studies/shopify-netsuite',
    category: 'Integration',
  },
  {
    id: 'performance-overhaul',
    title: 'Performance Overhaul for SuiteCommerce',
    summary: 'Boosting speed and conversions with targeted technical optimization',
    link: 'https://brokenrubik.com/case-studies/performance-overhaul-for-icrealtime-suitecommerce-store',
    category: 'Performance',
  },
  {
    id: 'suitecommerce-to-shopify',
    title: 'From SuiteCommerce to Shopify',
    summary: 'Rebuilding eCommerce for speed, search, and scalability',
    link: 'https://brokenrubik.com/case-studies/from-suitecommerce-to-shopify',
    category: 'Migration',
  },
  {
    id: 'netsuite-deposco',
    title: 'NetSuite-Deposco Warehouse Integration',
    summary: 'Seamless NetSuite-WMS sync for accurate warehouse operations',
    link: 'https://brokenrubik.com/case-studies/netsuite-deposco-integration',
    category: 'Integration',
  },
  {
    id: 'klim-b2b',
    title: 'KLIM Collaborative B2B Order Manager',
    summary: 'From Excel spreadsheets to a seamless digital ordering tool',
    link: 'https://brokenrubik.com/case-studies/klim-preseason',
    category: 'B2B',
  },
  {
    id: 'kenwood-draft-orders',
    title: 'Kenwood: Draft Orders in SuiteCommerce',
    summary: 'Enable multiple in-progress B2B orders without cart limitations',
    link: 'https://brokenrubik.com/case-studies/draft-orders-in-suitecommerce',
    category: 'B2B',
  },
  {
    id: 'inventory-sync',
    title: 'Inventory Sync: NetSuite & Adobe Commerce',
    summary: 'Making inventory synchronization fast and reliable',
    link: 'https://brokenrubik.com/case-studies/inventory-synchronization-between-netsuite-and-adobe-commerce',
    category: 'Integration',
  },
  {
    id: 'hubspot-netsuite',
    title: 'Bridging HubSpot and NetSuite with Celigo',
    summary: 'Automating Sales Order Synchronization across platforms',
    link: 'https://brokenrubik.com/case-studies/hubspot-netsuite-celigo-automate-sales-orders',
    category: 'Integration',
  },
  {
    id: 'inventory-dashboard',
    title: 'Designer Wellness: Inventory Dashboard',
    summary: 'Smart inventory view in NetSuite for Amazon fulfillment',
    link: 'https://brokenrubik.com/case-studies/netsuite-inventory-management-amazon',
    category: 'NetSuite',
  },
  {
    id: 'landed-cost',
    title: 'WeLink: Landed Cost Automation',
    summary: 'Enhancing cost visibility in multi-step purchase flows',
    link: 'https://brokenrubik.com/case-studies/welink-landed-cost-automation-for-supply-chain-accuracy',
    category: 'NetSuite',
  },
  {
    id: 'stinger-redesign',
    title: 'Stinger: UX/UI Redesign',
    summary: 'UX/UI modernization to implement branding',
    link: 'https://brokenrubik.com/case-studies/stinger-redesign',
    category: 'Design',
  },
  {
    id: 'variant-navigation',
    title: 'Smarter Product Variant Navigation',
    summary: 'Simplifying Product Variant Navigation with Custom Structures',
    link: 'https://brokenrubik.com/case-studies/smarter-product-variant-navigation-on-suitecommerce',
    category: 'SuiteCommerce',
  },
  {
    id: 'klaviyo',
    title: 'Klaviyo Integration',
    summary: 'Seamless Transaction Sync: NetSuite with Klaviyo',
    link: 'https://brokenrubik.com/case-studies/klaviyo-integration',
    category: 'Integration',
  },
  {
    id: 'blog-suitecommerce',
    title: 'Blog Posting Made Easy for SuiteCommerce',
    summary: 'An exclusive product by BrokenRubik',
    link: 'https://brokenrubik.com/case-studies/blog-posting-made-easy-for-suitecommerce',
    category: 'SuiteCommerce',
  },
  {
    id: 'deckmatch',
    title: 'Deckmatch',
    summary: 'Simplifying Deck Plug and Screw Selection for DIY Customers',
    link: 'https://brokenrubik.com/case-studies/deckmatch',
    category: 'Product',
  },
  {
    id: 'prescription',
    title: 'Prescription Management and Patient Care',
    summary: 'A UX case study with Oborne Health Supplies',
    link: 'https://brokenrubik.com/case-studies/prescription-management',
    category: 'UX',
  },
  {
    id: 'godatafeed',
    title: 'Streamlining Sales and Order Management',
    summary: 'Integration connecting GoDataFeed and NetSuite',
    link: 'https://brokenrubik.com/case-studies/streamlining-sales',
    category: 'Integration',
  },
  {
    id: 'pergola',
    title: 'Pergola Planner',
    summary: 'Empowering DIY Pergola Customization and Purchase',
    link: 'https://brokenrubik.com/case-studies/pergola-planner',
    category: 'Product',
  },
  {
    id: 'cartridges',
    title: 'Cartridges Direct',
    summary: 'Find your cartridges in three easy steps',
    link: 'https://brokenrubik.com/case-studies/cartridges-direct',
    category: 'Product',
  },
  {
    id: 'amp-tab',
    title: 'B2B Order Management with AMP Tab',
    summary: 'AMP Tab and NetSuite Integration for RST Brands',
    link: 'https://brokenrubik.com/case-studies/b2b-amp-tab',
    category: 'B2B',
  },
];

// Get case studies by IDs
export function getCaseStudiesByIds(ids: string[]): CaseStudy[] {
  return ids
    .map((id) => allCaseStudies.find((cs) => cs.id === id))
    .filter((cs): cs is CaseStudy => cs !== undefined);
}

// Default selection for new quotes
export const defaultCaseStudyIds = [
  'dynamic-promotions',
  'shopify-netsuite',
  'performance-overhaul',
  'suitecommerce-to-shopify',
  'netsuite-deposco',
  'klim-b2b',
];
