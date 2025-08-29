import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate secure, random passwords with customizable options. Create strong passwords with uppercase, lowercase, numbers, and special characters for maximum security.',
  keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password maker', 'security tool'],
  openGraph: {
    title: 'Password Generator | MetaMorph',
    description: 'Generate secure, random passwords with customizable strength options.',
    url: '/password-generator',
  },
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}