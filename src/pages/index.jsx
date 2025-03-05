import * as React from 'react';
import Typography from '@mui/material/Typography';
import ASCIIText from '../Components/AsciiText';

export default function HomePage() {
  return (    
     <>
     <ASCIIText
  text='hello_world'
  enableWaves={true}
  asciiFontSize={8}
/>
     </>
  );
}
