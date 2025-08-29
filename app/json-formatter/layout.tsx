import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Format, validate, and beautify JSON data. Parse JSON, detect errors, minify, and prettify with syntax highlighting. Free online JSON tool for developers.',
  keywords: ['JSON formatter', 'JSON validator', 'JSON prettify', 'JSON minify', 'JSON parser', 'JSON beautifier', 'validate JSON'],
  openGraph: {
    title: 'JSON Formatter & Validator | MetaMorph',
    description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
    url: '/json-formatter',
  },
};

export default function JSONFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}