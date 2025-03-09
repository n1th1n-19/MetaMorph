import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Outlet } from 'react-router-dom';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import CampaignIcon from '@mui/icons-material/Campaign';
import theme from '../theme';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
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
    segment: 'qr-code',
    title: 'QR Code',
    icon: <QrCodeIcon />,
  },
  {
    segment: 'file-converter',
    title: 'File Converter',
    icon: <QrCodeIcon />,
  }
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
