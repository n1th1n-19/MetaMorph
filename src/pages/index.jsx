import * as React from 'react';
import Typography from '@mui/material/Typography';
import Aurora from '../Components/Aurora';
import SplashCursor from '../layouts/SplashCurser.jsx'
// import ASCIIText from '../Components/AsciiText';

export default function HomePage() {
  return (    
     <>
     {/* <ASCIIText
  text='hello_world'
  enableWaves={true}
  asciiFontSize={8}
/> */}
    <SplashCursor />
      <Aurora />
     </>
  );
}
