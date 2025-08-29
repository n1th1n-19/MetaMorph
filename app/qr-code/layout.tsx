import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate custom QR codes instantly. Create QR codes for URLs, text, WiFi credentials, and more with customizable colors and sizes. Free online QR code maker.',
  keywords: ['QR code generator', 'create QR code', 'custom QR code', 'QR code maker', 'free QR generator', 'QR scanner'],
  openGraph: {
    title: 'QR Code Generator | MetaMorph',
    description: 'Generate custom QR codes instantly with our free online tool. Perfect for URLs, text, WiFi, and more.',
    url: '/qr-code',
  },
};

export default function QRCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}