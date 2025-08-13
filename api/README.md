# MetaMorph Video Downloader API

This API provides endpoints for downloading videos from various platforms, deployed as Vercel serverless functions.

## Endpoints

### GET /api/info
Get video information including title, description, thumbnail, and available formats.

**Parameters:**
- `url` (required): Video URL to fetch information for

**Example:**
```
GET /api/info?url=https://www.youtube.com/watch?v=VIDEO_ID
```

**Response:**
```json
{
  "id": "VIDEO_ID",
  "title": "Video Title",
  "description": "Video description",
  "thumbnail": "https://thumbnail-url.jpg",
  "duration": 180,
  "platform": "youtube",
  "formats": [
    {
      "formatId": "22",
      "qualityLabel": "720p",
      "resolution": "1280x720",
      "filesize": 52428800,
      "ext": "mp4"
    }
  ]
}
```

### GET /api/download
Download a video in the specified format.

**Parameters:**
- `url` (required): Video URL to download
- `format` (optional): Format ID to download (defaults to best quality)

**Example:**
```
GET /api/download?url=https://www.youtube.com/watch?v=VIDEO_ID&format=22
```

## Supported Platforms

Currently supports:
- ✅ YouTube (fully functional)
- 🚧 Twitter (planned)
- 🚧 Instagram (planned)
- 🚧 Facebook (planned)

## Deployment

This API is designed to be deployed on Vercel with zero configuration. Simply push to your repository and Vercel will automatically deploy the functions.

## Local Development

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. API will be available at `http://localhost:3000/api/`

## Rate Limiting

Be respectful when using this API. Excessive usage may result in temporary blocks from video platforms.

## Legal Notice

This tool is for personal use only. Users must respect copyright laws and platform Terms of Service when downloading content.