import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import QrCodeGenerator from './pages/QRCode.jsx'
import TextoSpeech from './pages/TextoSpeech.jsx'

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
          // {
          //   path: 'splash',
          //   element: <SplashCursor />,
          // },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
