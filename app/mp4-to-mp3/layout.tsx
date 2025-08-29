import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MP4 to MP3 Converter',
  description: 'Convert MP4 videos to MP3 audio files instantly. Extract audio from video files with high quality output. Free online MP4 to MP3 converter.',
  keywords: ['MP4 to MP3', 'video to audio', 'audio extractor', 'MP4 converter', 'video converter', 'extract audio'],
  openGraph: {
    title: 'MP4 to MP3 Converter | MetaMorph',
    description: 'Convert MP4 videos to MP3 audio files with high quality output.',
    url: '/mp4-to-mp3',
  },
};

export default function MP4ToMP3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}