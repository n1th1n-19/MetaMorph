import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router-dom';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import SplashCursor from './layouts/SplashCurser.jsx'

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
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'splash',
    title: 'qrcode',
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  title: "MetaMorph",
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
      <SplashCursor />
    </ReactRouterAppProvider>
  );
}
