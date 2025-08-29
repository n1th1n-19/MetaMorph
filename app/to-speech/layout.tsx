import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text to Speech',
  description: 'Convert text to natural-sounding speech with our advanced text-to-speech tool. Multiple voices, languages, and downloadable audio. Perfect for accessibility and content creation.',
  keywords: ['text to speech', 'TTS', 'voice synthesis', 'speech generator', 'text reader', 'voice over', 'accessibility'],
  openGraph: {
    title: 'Text to Speech | MetaMorph',
    description: 'Convert text to natural-sounding speech with multiple voices and languages.',
    url: '/to-speech',
  },
};

export default function TextToSpeechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}