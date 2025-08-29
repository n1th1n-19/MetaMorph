import React from 'react';
import type { Metadata, Viewport } from 'next';
import ClientThemeProvider from './components/ClientThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'MetaMorph - One app, endless transformations',
    template: '%s | MetaMorph'
  },
  description: 'A powerful multi-utility web application featuring QR code generation, URL shortening, text-to-speech, speech-to-text, OCR extraction, file conversion, and MP4 to MP3 conversion. All tools in one place.',
  keywords: [
    'QR code generator',
    'URL shortener',
    'text to speech',
    'speech to text',
    'OCR',
    'file converter',
    'MP4 to MP3',
    'web tools',
    'utility app',
    'online tools'
  ],
  authors: [{ name: 'MetaMorph Team' }],
  creator: 'MetaMorph',
  publisher: 'MetaMorph',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MetaMorph - One app, endless transformations',
    description: 'A powerful multi-utility web application with QR codes, URL shortening, text-to-speech, OCR, and more.',
    url: '/',
    siteName: 'MetaMorph',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MetaMorph - Multi-utility web application',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetaMorph - One app, endless transformations',
    description: 'Powerful web tools for QR codes, URL shortening, text-to-speech, OCR, and file conversion.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0c' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MetaMorph",
              "description": "A powerful multi-utility web application featuring QR code generation, URL shortening, text-to-speech, speech-to-text, OCR extraction, file conversion, and MP4 to MP3 conversion.",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "QR Code Generator",
                "URL Shortener", 
                "Text to Speech",
                "Speech to Text",
                "OCR Text Extractor",
                "File Converter",
                "MP4 to MP3 Converter"
              ],
              "author": {
                "@type": "Organization",
                "name": "MetaMorph Team"
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}