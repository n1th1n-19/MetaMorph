import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Converter',
  description: 'Convert files between different formats quickly and easily. Support for documents, images, and various file types. Fast, secure, and free online conversion.',
  keywords: ['file converter', 'document converter', 'format converter', 'file conversion', 'online converter'],
  openGraph: {
    title: 'File Converter | MetaMorph',
    description: 'Convert files between different formats quickly and securely.',
    url: '/file-converter',
  },
};

export default function FileConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}