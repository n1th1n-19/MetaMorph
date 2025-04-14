# MetaMorph

![MetaMorph Logo](https://via.placeholder.com/150?text=MetaMorph)

## All-in-One Digital Toolbox

MetaMorph is a comprehensive web application that offers multiple utility tools to simplify your digital workflow. Convert, create, extract, and more — all in one convenient platform.

## Features

MetaMorph provides the following tools:

- **Text to Speech:** Convert any text into natural-sounding speech in multiple languages.
- **Speech to Text:** Accurately transcribe audio into text with our advanced recognition engine.
- **QR Code Generator:** Generate custom QR codes for websites, text, and contact information.
- **File Converter:** Convert files between different formats easily and quickly.
- **URL Shortener:** Create compact, shareable links for your long URLs.
- **OCR Extractor:** Extract text from images and scanned documents with high accuracy.
- **Video Downloader:** Download videos from YouTube, Twitter, Instagram, and Facebook.

## Technology Stack

- React
- Material UI
- React Router
- @toolpad/core (for layout and navigation)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/metamorph.git
cd metamorph
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```
metamorph/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Entry point
│   ├── theme.js                 # Theme configuration
│   ├── layouts/
│   │   └── dashboard.jsx        # Dashboard layout with navigation
│   └── pages/
│       ├── index.jsx            # Homepage
│       ├── QRCode.jsx           # QR code generator
│       ├── TextoSpeech.jsx      # Text to speech converter
│       ├── SpeechToText.jsx     # Speech to text converter
│       ├── FileConverter.jsx    # File format converter
│       ├── URLShortener.jsx     # URL shortener
│       ├── OCRExtractor.jsx     # OCR text extractor
│       └── VideoDownloader.jsx  # Video downloader
└── package.json
```

## Router Configuration

The application uses React Router for navigation with the following routes:

- `/` - Dashboard/Home page
- `/qr-code` - QR Code Generator
- `/to-speech` - Text to Speech Converter
- `/speech-to-text` - Speech to Text Converter
- `/file-converter` - File Format Converter
- `/url-shortener` - URL Shortener
- `/ocr-extractor` - OCR Text Extractor
- `/video-downloader` - Video Downloader

## Development

### Adding a New Tool

To add a new tool to MetaMorph:

1. Create a new component in the `pages` directory.
2. Add the route to the router configuration in `main.jsx`.
3. Add the tool to the navigation items in `layouts/dashboard.jsx`.
4. Add the tool card to the homepage in `pages/index.jsx`.

### Customizing the Theme

The application uses a custom theme defined in `theme.js`. You can modify this file to change colors, typography, and other design elements across the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by Material UI
- UI components built with Material UI

---

© 2025 MetaMorph. All tools are free for personal use.
