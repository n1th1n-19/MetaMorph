# MetaMorph

<p align="center">
  <img src="src/assets/logooo.gif" alt="MetaMorph Logo" width="150" height="150">
</p>

<p align="center">
  <strong>One app, endless transformations</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a> •
</p>

## 📋 Overview

MetaMorph is a powerful, modern multi-utility web application built with Next.js 14 and React 18. It offers a suite of essential tools including file conversion, speech recognition, QR code generation, OCR text extraction, and media conversion — all packed into a single seamless interface with optimized performance and SEO.

Transform, convert, and enhance your digital content all in one place, without switching between different apps or services.

## <h2 id="features">Features</h2>

| Tool | Description |
|------|-------------|
| 🔊 **Text to Speech** | Convert written text into natural-sounding speech |
| 🎙️ **Speech to Text** | Convert audio recordings into text |
| 🎵 **Mp4 to Mp3 Converter** | Convert MP4 video files to MP3 audio format |
| 🔗 **URL Shortener** | Create short, shareable links from long URLs |
| 📱 **QR Code Generator** | Generate QR codes from text or URLs |
| 👁️ **OCR Extractor** | Extract text from images using Optical Character Recognition |
| 📄 **File Converter** | Convert files between different formats |

## <h2 id="demo">Demo</h2>

🚀 **Live Demo:** [MetaMorph App](https://metamorph01.vercel.app)


## <h2 id="installation">Installation</h2>

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v8.0 or higher)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/n1th1n-19/MetaMorph.git
   cd cap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your configuration:
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project
3. **Set Environment Variables:**
   - Add `NEXT_PUBLIC_BASE_URL` with your domain (e.g., `https://your-app.vercel.app`)
4. **Deploy:**
   - Vercel will automatically build and deploy your app
   - Your app will be live at `https://your-project-name.vercel.app`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```



## <h2 id="tech-stack">Tech Stack</h2>

- **Framework:** Next.js 14 with App Router
- **Frontend:** React 18 with TypeScript
- **UI Framework:** Material-UI (MUI) v6
- **Typography:** Inter + Poppins (Google Fonts)
- **Styling:** Emotion CSS-in-JS
- **Build Tool:** Next.js built-in (Turbopack)
- **Deployment:** Vercel (optimized)
- **SEO:** Next.js Metadata API + Structured Data
- **Key Libraries:**
  - Tesseract.js for OCR functionality
  - QRCode.react for QR code generation  
  - File-saver for file downloads
  - PDF-lib for PDF processing
  - XLSX for spreadsheet handling
  - Mammoth for Word document processing
  - Web Audio API for media processing

## <h2 id="project-structure">Project Structure</h2>

```
MetaMorph/
├── app/                          # Next.js App Router
│   ├── components/
│   │   └── ClientThemeProvider.tsx
│   ├── file-converter/
│   │   ├── layout.tsx           # SEO metadata
│   │   └── page.tsx
│   ├── mp4-to-mp3/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── ocr-extractor/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── qr-code/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── r/
│   │   └── [code]/
│   │       └── page.tsx         # Dynamic redirect routes
│   ├── speech-to-text/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── to-speech/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── url-shortener/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout with SEO
│   ├── page.tsx                 # Homepage
│   ├── robots.ts                # SEO robots.txt
│   └── sitemap.ts               # SEO sitemap
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── favicon.ico
│   └── ...
├── .env.example                 # Environment variables template
├── next.config.mjs              # Next.js configuration
├── package.json
├── tsconfig.json
└── vercel.json                  # Vercel deployment config
```

## <h2 id="roadmap">Roadmap</h2>

- [ ] Dark mode and theme customization
- [ ] Drag-and-drop file support for all converters
- [ ] Offline mode/PWA support
- [ ] Batch file processing
- [ ] Additional audio/video format support
- [ ] Multi-language text-to-speech voices
- [ ] Advanced OCR with multiple language support
- [ ] File compression and optimization tools

## <h2 id="contributing">Contribution</h2>

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style guidelines.

<br><br>


<p align="center">
  Made with ❤️ by <a href="https://github.com/n1th1n-19">nthnpy3</a>
</p>
<br><br>
<p align="center">
  <a href="https://github.com/n1th1n-19">GitHub</a> •
  <a href="https://x.com/n1th1n_log">Twitter</a> 
</p>

<br><br>


- Open to all

---

**Happy Morphing!**  

