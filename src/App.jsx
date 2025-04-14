import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Outlet } from 'react-router-dom';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import CampaignIcon from '@mui/icons-material/Campaign';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LinkIcon from "@mui/icons-material/Link";
import TextFieldsIcon from "@mui/icons-material/TextFields";


import theme from '../theme';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main Tools',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'to-speech',
    title: 'Text to Speech',
    icon: <CampaignIcon />,
  },
  {
    segment: 'speech-to-text',
    title: 'Speech to Text',
    icon: <CampaignIcon />,
  },
  {
    segment: 'qr-code',
    title: 'QR Code',
    icon: <QrCodeIcon />,
  },
  {
    segment: 'file-converter',
    title: 'File Converter',
    icon: <CompareArrowsIcon />,
  },
  {
    segment: 'url-shortener',
    title: 'URL Shortener',
    icon: <LinkIcon />,
  },
  {
    segment: 'ocr-extractor',
    title: 'OCR Extractor',
    icon: <TextFieldsIcon />,
  },
  {
    segment: 'video-downloader',
    title: 'Video Downloader',
    icon: <TextFieldsIcon />,
  },
];

const BRANDING = {
  title: "MetaMorph",
  logo: '',
  homeUrl: '/',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={theme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
