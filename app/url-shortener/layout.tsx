import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Create short links instantly with our free URL shortener. Track clicks, manage your links, and share them easily. Perfect for social media and marketing.',
  keywords: ['URL shortener', 'short link', 'link shortener', 'tiny URL', 'shorten link', 'bit.ly alternative'],
  openGraph: {
    title: 'URL Shortener | MetaMorph',
    description: 'Create short links instantly with click tracking and analytics.',
    url: '/url-shortener',
  },
};

export default function URLShortenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}