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

MetaMorph is a lightweight, modular, multi-utility web application built with React and Vite. It offers a suite of powerful tools including file conversion, speech recognition, QR code generation, OCR text extraction, and media conversion — all packed into a single seamless interface.

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

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)



## <h2 id="tech-stack">Tech Stack</h2>

- **Frontend:** React 19 with JSX
- **Build Tool:** Vite 5
- **UI Framework:** Material-UI (MUI) v6
- **Routing:** React Router v7
- **Layout System:** Toolpad Core dashboard layout
- **Key Libraries:**
  - Tesseract.js for OCR functionality
  - QRCode.react for QR code generation
  - File-saver for file downloads
  - PDF-lib for PDF processing
  - XLSX for spreadsheet handling
  - Mammoth for Word document processing

## <h2 id="project-structure">Project Structure</h2>

```
MetaMorph/
├── public/
├── src/
│   ├── assets/
│   │   ├── log.ico
│   │   ├── logooo.gif
│   │   ├── logooo.png
│   │   └── medium-m.icns
│   ├── CSS/
│   │   └── qrcode.css
│   ├── layouts/
│   │   ├── SplashCurser.jsx
│   │   └── dashboard.jsx
│   ├── pages/
│   │   ├── FileConverter.jsx
│   │   ├── Mp3.jsx
│   │   ├── OCRExtractor.jsx
│   │   ├── QRCode.jsx
│   │   ├── SpeechToText.jsx
│   │   ├── TextoSpeech.jsx
│   │   ├── URLShortener.jsx
│   │   └── index.jsx
│   ├── App.jsx
│   └── main.jsx
├── cn.ts
├── theme.js
├── vite.config.mts
└── package.json
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

