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

  const { url, format } = req.query;

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
      
      // Determine format to download
      let selectedFormat;
      if (format) {
        selectedFormat = info.formats.find(f => f.itag.toString() === format);
      }
      
      // Default to best quality with both video and audio
      if (!selectedFormat) {
        selectedFormat = ytdl.chooseFormat(info.formats, {
          quality: 'highestvideo',
          filter: format => format.hasVideo && format.hasAudio
        });
      }

      if (!selectedFormat) {
        return res.status(400).json({ error: 'No suitable format found' });
      }

      // Set response headers for file download
      const filename = `${sanitizeFilename(videoDetails.title)}.${selectedFormat.container || 'mp4'}`;
      
      res.setHeader('Content-Type', selectedFormat.mimeType || 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', selectedFormat.contentLength || '');

      // Stream the video
      const videoStream = ytdl(url, {
        format: selectedFormat,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }
      });

      // Handle stream errors
      videoStream.on('error', (error) => {
        console.error('Video stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream video' });
        }
      });

      // Pipe the video stream to the response
      videoStream.pipe(res);

      // Handle client disconnect
      req.on('close', () => {
        if (videoStream && !videoStream.destroyed) {
          videoStream.destroy();
        }
      });

      return;
    }

    // For other platforms, return error for now
    return res.status(400).json({ 
      error: 'Currently only YouTube videos are supported in this demo' 
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    
    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'Video not found or unavailable' });
    }
    
    if (error.message.includes('private')) {
      return res.status(403).json({ error: 'Video is private' });
    }

    if (error.message.includes('Sign in to confirm your age')) {
      return res.status(403).json({ error: 'Age-restricted video cannot be downloaded' });
    }

    return res.status(500).json({ 
      error: 'Failed to download video',
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

function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, 100); // Limit length
}