import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speech to Text',
  description: 'Convert audio recordings to text with our advanced speech recognition tool. Upload audio files or record directly in your browser for accurate transcription.',
  keywords: ['speech to text', 'voice to text', 'audio transcription', 'speech recognition', 'STT', 'voice recognition'],
  openGraph: {
    title: 'Speech to Text | MetaMorph',
    description: 'Convert audio recordings to text with advanced speech recognition technology.',
    url: '/speech-to-text',
  },
};

export default function SpeechToTextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}