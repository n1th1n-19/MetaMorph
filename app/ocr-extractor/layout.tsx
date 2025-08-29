import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR Text Extractor',
  description: 'Extract text from images using advanced OCR technology. Upload photos, screenshots, or scanned documents to convert them to editable text instantly.',
  keywords: ['OCR', 'text extraction', 'image to text', 'document scanner', 'text recognition', 'photo to text'],
  openGraph: {
    title: 'OCR Text Extractor | MetaMorph',
    description: 'Extract text from images using advanced OCR technology. Fast and accurate.',
    url: '/ocr-extractor',
  },
};

export default function OCRExtractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}