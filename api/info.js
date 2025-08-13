import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // For YouTube videos
    if (isYouTubeUrl(url)) {
      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;
      
      // Get available formats
      const formats = info.formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          formatId: format.itag,
          qualityLabel: format.qualityLabel || format.quality,
          resolution: `${format.width}x${format.height}`,
          filesize: format.contentLength ? parseInt(format.contentLength) : 0,
          ext: format.container,
          vcodec: format.videoCodec,
          acodec: format.audioCodec,
        }))
        .sort((a, b) => {
          // Sort by quality (higher first)
          const qualityA = parseInt(a.qualityLabel) || 0;
          const qualityB = parseInt(b.qualityLabel) || 0;
          return qualityB - qualityA;
        });

      const videoInfo = {
        id: videoDetails.videoId,
        title: videoDetails.title,
        description: videoDetails.description || '',
        thumbnail: videoDetails.thumbnails?.[0]?.url || '',
        duration: parseInt(videoDetails.lengthSeconds) || 0,
        platform: 'youtube',
        formats: formats.slice(0, 10), // Limit to top 10 formats
      };

      return res.status(200).json(videoInfo);
    }

    // For other platforms, return mock data for now
    // In production, you'd integrate with other APIs like twitter-video-dl, etc.
    return res.status(400).json({ 
      error: 'Currently only YouTube videos are supported in this demo' 
    });

  } catch (error) {
    console.error('Error fetching video info:', error);
    
    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }
    
    if (error.message.includes('private')) {
      return res.status(403).json({ error: 'Video is private' });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch video information',
      details: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function isYouTubeUrl(url) {
  return ytdl.validateURL(url);
}