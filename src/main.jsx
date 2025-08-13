import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import QrCodeGenerator from './pages/QRCode.jsx'
import TextoSpeech from './pages/TextoSpeech.jsx'
import FileConverter from './pages/FileConverter.jsx'
import SpeechToText from './pages/SpeechToText.jsx'
import URLShortener from './pages/URLShortener.jsx'
import OCRExtractor from './pages/OCRExtractor.jsx'
import VideoDownloader from './pages/VideoDownloader.jsx'
import DownloadMP3 from './pages/Mp3.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: '',
            element: <DashboardPage />,
          },
          {
            path: 'qr-code',
            element: <QrCodeGenerator />,
          },
          {
            path: 'to-speech',
            element: <TextoSpeech />,
          },
          {
            path: 'speech-to-text',
            element: <SpeechToText />,
          },
          {
            path: 'file-converter',
            element: <FileConverter />,
          },
          {
            path: 'url-shortener',
            element: <URLShortener />,
          },
          {
            path: 'ocr-extractor',
            element: <OCRExtractor />,
          },
          {
            path: 'video-downloader', 
            element: <VideoDownloader />,
          },
          {
            path: 'mp4-to-mp3', 
            element: <DownloadMP3 />,
          },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  );
}
