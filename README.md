# Quote Builder - BrokenRubik

A professional quote/proposal generator that allows you to write content in Markdown, see a live preview, and export to PDF with a customizable template.

## Features

- **Markdown Editor**: Write your proposals using familiar Markdown syntax
- **Live Preview**: See exactly how your document will look in real-time
- **PDF Export**: Generate professional PDFs with html2pdf.js
- **Customizable Templates**: Adjust colors, fonts, company info, and more
- **Auto-Save**: Your work is automatically saved to localStorage
- **Quote Numbering**: Automatic quote number generation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

### Editor (Left Panel)
Write your proposal using Markdown syntax:
- `# H1`, `## H2`, `### H3` for headers
- `**bold**` and `*italic*` for text formatting
- `- item` for bullet lists
- `1. item` for numbered lists
- Tables with pipe syntax
- `> quote` for blockquotes
- `---` for horizontal rules

### Preview (Right Panel)
See a live preview of your document with the current template settings applied.

### Settings
Click "Settings" to customize:
- **Company Info**: Name, tagline, email, website, logo
- **Colors**: Primary, secondary, text, and muted colors
- **Header/Footer**: Quote numbering, dates, validity period
- **Typography**: Font family, size, page padding

### Export
Click "Export PDF" to generate your document:
- Choose page size (A4, Letter, Legal)
- Select orientation (Portrait, Landscape)
- Set quality level (Draft, Standard, High)
- Customize filename

## Project Structure

```
quote-builder/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page component
│   └── globals.css       # Global styles
├── components/
│   ├── Editor.tsx        # Markdown editor
│   ├── Preview.tsx       # Document preview
│   ├── Toolbar.tsx       # Top toolbar
│   ├── TemplateSettings.tsx  # Settings panel
│   └── ExportSettings.tsx    # Export modal
├── lib/
│   ├── markdown.ts       # Markdown parser
│   ├── pdf.ts            # PDF generation
│   ├── storage.ts        # localStorage helpers
│   └── templates.ts      # Default templates
├── types/
│   └── index.ts          # TypeScript types
└── public/
    └── logo.webp         # Company logo
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **PDF Generation**: html2pdf.js (client-side)
- **Persistence**: localStorage
- **Language**: TypeScript

## Deployment

Ready for deployment on Vercel:

```bash
npm run build
```

Or deploy directly with the Vercel CLI:

```bash
npx vercel
```

## License

Private - BrokenRubik
