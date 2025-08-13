# MetaMorph Development Guide

## Video Downloader Local Development

The Video Downloader feature requires a backend API that is designed to run on Vercel serverless functions. When running locally, you'll encounter API errors because the `/api/info` and `/api/download` endpoints don't exist in the local Vite development server.

### 🚀 Quick Start for Production

**To test the Video Downloader:**

1. **Deploy to Vercel** (recommended):
   ```bash
   # Connect your repository to Vercel
   # Push changes to trigger automatic deployment
   git add .
   git commit -m "Deploy video downloader"
   git push origin main
   ```

2. **Or run locally with Vercel CLI**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Run in development mode
   vercel dev
   ```

### 🔧 Local Development Workaround

If you need to develop other features locally:

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Expected behavior**:
   - ✅ All other tools work normally
   - ❌ Video Downloader shows "API not available" error
   - ⚠️ Yellow warning banner appears in development mode

### 📁 Project Structure

```
MetaMorph/
├── api/                    # Vercel serverless functions
│   ├── info.js            # Get video information
│   ├── download.js        # Download video files
│   └── README.md          # API documentation
├── src/
│   └── pages/
│       └── VideoDownloader.jsx
├── vercel.json            # Vercel configuration
└── package.json
```

### 🛠 API Endpoints

- `GET /api/info?url={VIDEO_URL}` - Fetch video metadata
- `GET /api/download?url={VIDEO_URL}&format={FORMAT_ID}` - Download video

### 🔍 Debugging

- Check browser console for detailed error messages
- API errors are logged with full details
- Content-type validation improved for better debugging

### 🌐 Supported Platforms

- ✅ **YouTube** - Fully functional with `ytdl-core`
- 🚧 **Twitter** - Planned (API stub ready)
- 🚧 **Instagram** - Planned (API stub ready)  
- 🚧 **Facebook** - Planned (API stub ready)

### 📝 Notes

- The frontend automatically detects production vs development
- Error messages are user-friendly and informative
- CORS is properly configured for cross-origin requests
- Rate limiting and security measures are in place