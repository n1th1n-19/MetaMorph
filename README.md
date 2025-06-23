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

MetaMorph is a lightweight, modular, multi-utility web application built with React and Node.js. It offers a suite of powerful tools ranging from file conversion and speech recognition to QR code generation and video downloading — all packed into a single seamless interface.

The application features a dedicated backend service for the video downloader component, allowing for efficient handling of video downloads from various sources.

Transform, convert, and enhance your digital content all in one place, without switching between different apps or services.

## <h2 id="features">Features</h2>

| Tool | Description |
|------|-------------|
| 📄 **File Converter** | Convert files between different formats |
| 👁️ **OCR Extractor** | Extract text from images using Optical Character Recognition |
| 📱 **QR Code Generator** | Generate QR codes from text or URLs |
| 🎙️ **Speech to Text** | Offline speech recognition using Vosk |
| 🔊 **Text to Speech** | Convert written text into speech |
| 🔗 **URL Shortener** | Shrink long links into short ones |
| 📹 **Video Downloader** | Download videos from various sources |

## <h2 id="demo">Demo</h2>

Check out the live demo: [MetaMorph Demo](https://metamorph02.vercel.app)

<!-- ![MetaMorph Screenshot](https://via.placeholder.com/800x400) -->

## <h2 id="installation">Installation</h2>

### Prerequisites
- Node.js (v14.0 or higher)
- npm (v6.0 or higher)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/n1th1n-19/cap.git
   cd cap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend (in a separate terminal)
   cd backend
   npm install
  
   node server.js
   ```

4. **Open the app:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)



## <h2 id="tech-stack">Tech Stack</h2>

- **Frontend:** React 18 with JSX, CSS
- **Backend:** Node.js for the video downloader service
- **Layout System:** Custom dashboard layout with modular components
- **Libraries:**
  - Browser-native APIs (File APIs, Canvas, Web Speech API)

## <h2 id="project-structure">Project Structure</h2>

```
MetaMorph/
├── public/
├── backend/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── src/
│   ├── assets/
│   ├── Components/
│   │   ├── AsciiText.jsx
│   │   ├── Aurora.jsx
│   │   └── Aurora.css
│   ├── CSS/
│   │   └── qrcode.css
│   ├── layouts/
│   │   ├── SplashCurser.jsx
│   │   └── dashboard.jsx
│   ├── pages/
│   │   ├── FileConverter.jsx
│   │   ├── OCRExtractor.jsx
│   │   ├── QRCode.jsx
│   │   ├── SpeechToText.jsx
│   │   ├── TextoSpeech.jsx
│   │   ├── URLShortener.jsx
│   │   ├── VideoDownloader.jsx
│   │   ├── index.jsx
│   ├── App.jsx
│   └── main.jsx
```

## <h2 id="roadmap">Roadmap</h2>

- [ ] Dark mode and theme toggler
- [ ] Drag-and-drop file support
- [ ] Offline mode/PWA support
- [ ] More export options (PDF, JSON, CSV)
- [ ] Multi-language support
- [ ] User accounts and saved transformations
- [ ] Batch processing capabilities

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
  <a href="https://twitter.com/your-twitter">Twitter</a> •
  <a href="https://your-website.com">Website</a>
</p>

<br><br>

## 🙏 Acknowledgements

- All open-source contributors who made this project possible

---

**Happy Morphing!**  

