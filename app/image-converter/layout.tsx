import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Format Converter',
  description: 'Convert images between different formats including JPG, PNG, WebP, and more. Free online image converter with high-quality output and batch processing support.',
  keywords: ['image converter', 'format converter', 'JPG to PNG', 'PNG to WebP', 'image format', 'convert images', 'batch converter'],
  openGraph: {
    title: 'Image Format Converter | MetaMorph',
    description: 'Convert images between JPG, PNG, WebP and other formats with high quality output.',
    url: '/image-converter',
  },
};

export default function ImageConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}