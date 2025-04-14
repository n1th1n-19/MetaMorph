import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Button,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import { 
  Mic, 
  Campaign as RecordVoiceOver, 
  FileDownload, 
  Link as LinkIcon, 
  QrCode, 
  TextFields as TextSnippet, 
  CompareArrows as TransformOutlined,
  KeyboardArrowRight
} from '@mui/icons-material';

export default function DashboardPage() {
  const theme = useTheme();
  
  // Feature cards data with updated paths matching your router configuration
  const features = [
    { 
      title: 'Text to Speech', 
      description: 'Convert any text into natural-sounding speech in multiple languages',
      icon: <RecordVoiceOver fontSize="large" />,
      color: '#FF5722',
      link: '/to-speech'
    },
    { 
      title: 'Speech to Text', 
      description: 'Accurately transcribe audio into text with our advanced recognition engine',
      icon: <Mic fontSize="large" />,
      color: '#2196F3',
      link: '/speech-to-text'
    },
    { 
      title: 'Video Downloader', 
      description: 'Download videos from YouTube, Twitter, Instagram, and Facebook',
      icon: <FileDownload fontSize="large" />,
      color: '#E91E63',
      link: '/video-downloader'
    },
    { 
      title: 'URL Shortener', 
      description: 'Create compact, shareable links for your long URLs',
      icon: <LinkIcon fontSize="large" />,
      color: '#4CAF50',
      link: '/url-shortener'
    },
    { 
      title: 'QR Code Generator', 
      description: 'Generate custom QR codes for websites, text, and contact information',
      icon: <QrCode fontSize="large" />,
      color: '#9C27B0',
      link: '/qr-code'
    },
    { 
      title: 'OCR Extractor', 
      description: 'Extract text from images and scanned documents with high accuracy',
      icon: <TextSnippet fontSize="large" />,
      color: '#FFC107',
      link: '/ocr-extractor'
    },
    { 
      title: 'File Converter', 
      description: 'Convert files between different formats easily and quickly',
      icon: <TransformOutlined fontSize="large" />,
      color: '#00BCD4',
      link: '/file-converter'
    }
  ];

  return (
    <Box sx={{ 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 6,
          pb: 8,
          background: 'linear-gradient(to bottom right, #1E1E1E, #121212)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Abstract background shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '40%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,168,232,0.1) 0%, rgba(0,168,232,0) 70%)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,77,255,0.1) 0%, rgba(124,77,255,0) 70%)',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(90deg, #00A8E8 0%, #7C4DFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                All the Tools You Need, In One Place
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Simplify your digital workflow with our comprehensive suite of free online tools. 
                Convert, create, extract, and more — all in one convenient platform.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                component={RouterLink}
                to="/qr-code"
                sx={{ 
                  background: 'linear-gradient(90deg, #00A8E8 0%, #7C4DFF 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #0086B8 0%, #6C3DDF 100%)',
                  }
                }}
              >
                Explore Tools
              </Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  height: 400,
                  width: '100%',
                  position: 'relative',
                  '& > *': {
                    position: 'absolute',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 2,
                    backgroundColor: alpha('#1E1E1E', 0.8),
                    border: '1px solid',
                    backdropFilter: 'blur(8px)'
                  }
                }}
              >
                {/* Animated tool cards */}
                <Box 
                  sx={{ 
                    top: '10%', 
                    left: '0%', 
                    width: '60%', 
                    borderColor: alpha('#00A8E8', 0.3),
                    animation: 'float 8s ease-in-out infinite'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: alpha('#00A8E8', 0.2) }}>
                      <FileDownload sx={{ color: '#00A8E8' }} />
                    </Avatar>
                    <Typography fontWeight="medium">Video Downloader</Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    top: '35%', 
                    right: '0%', 
                    width: '65%', 
                    borderColor: alpha('#7C4DFF', 0.3),
                    animation: 'float 7s 1s ease-in-out infinite'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: alpha('#7C4DFF', 0.2) }}>
                      <QrCode sx={{ color: '#7C4DFF' }} />
                    </Avatar>
                    <Typography fontWeight="medium">QR Code Generator</Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    bottom: '5%', 
                    left: '15%', 
                    width: '70%', 
                    borderColor: alpha('#FFC107', 0.3),
                    animation: 'float 9s 0.5s ease-in-out infinite'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: alpha('#FFC107', 0.2) }}>
                      <RecordVoiceOver sx={{ color: '#FFC107' }} />
                    </Avatar>
                    <Typography fontWeight="medium">Text to Speech Converter</Typography>
                  </Box>
                </Box>
                
                {/* Animation keyframes */}
                <style>
                  {`
                    @keyframes float {
                      0% { transform: translateY(0px); }
                      50% { transform: translateY(-15px); }
                      100% { transform: translateY(0px); }
                    }
                  `}
                </style>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          fontWeight="bold" 
          textAlign="center" 
          sx={{ mb: 1 }}
        >
          Our Tools
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          Discover our collection of powerful web tools designed to simplify your digital life
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid',
                  borderColor: alpha(feature.color, 0.3),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 20px -10px ${alpha(feature.color, 0.3)}`
                  }
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  component={RouterLink}
                  to={feature.link}
                >
                  <CardContent sx={{ p: 3, width: '100%' }}>
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: '12px',
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: feature.color, mt: 'auto' }}>
                      <Typography variant="button" sx={{ mr: 0.5 }}>Try now</Typography>
                      <KeyboardArrowRight fontSize="small" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer"
        sx={{ 
          backgroundColor: '#1A1A1A', 
          py: 3,
          borderTop: '1px solid',
          borderColor: 'rgba(255,255,255,0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} MetaMorph. All tools are free for personal use.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}