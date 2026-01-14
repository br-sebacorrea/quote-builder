import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quote Builder - BrokenRubik',
  description: 'Generate professional quotes and proposals in PDF format',
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
