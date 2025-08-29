'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent,
  Button,
  Alert,
  Fade
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ErrorIcon from '@mui/icons-material/Error';
import LaunchIcon from '@mui/icons-material/Launch';
import HomeIcon from '@mui/icons-material/Home';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const code = params.code as string;

  useEffect(() => {
    if (!code) {
      setError('Invalid redirect code');
      setRedirecting(false);
      return;
    }

    try {
      // Get URL mappings from localStorage
      const urlMappings = JSON.parse(localStorage.getItem('url-mappings') || '{}');
      const mapping = urlMappings[code];

      if (!mapping) {
        setError('Short URL not found or expired');
        setRedirecting(false);
        return;
      }

      // Update click count
      mapping.clicks = (mapping.clicks || 0) + 1;
      urlMappings[code] = mapping;
      localStorage.setItem('url-mappings', JSON.stringify(urlMappings));

      setOriginalUrl(mapping.originalUrl);

      // Redirect after a short delay to show the redirect page
      setTimeout(() => {
        window.location.href = mapping.originalUrl;
      }, 2000);

    } catch (err) {
      console.error('Error processing redirect:', err);
      setError('Failed to process redirect');
      setRedirecting(false);
    }
  }, [code]);

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="sm">
          <Fade in timeout={800}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              py: 4
            }}>
              <CardContent>
                <ErrorIcon sx={{ 
                  fontSize: 64, 
                  color: '#f44336', 
                  mb: 2 
                }} />
                
                <Typography variant="h4" sx={{ mb: 2, color: '#f44336' }}>
                  Link Not Found
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {error}
                </Typography>

                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    color: '#2196f3'
                  }}
                >
                  This short URL may have been created in a different browser session or may have expired.
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={() => router.push('/')}
                  sx={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: '#000',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e85d89 0%, #f5d835 100%)',
                    }
                  }}
                >
                  Go to Homepage
                </Button>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            py: 4
          }}>
            <CardContent>
              <LinkIcon sx={{ 
                fontSize: 64, 
                color: '#fa709a', 
                mb: 2,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                  '100%': { transform: 'scale(1)', opacity: 1 }
                }
              }} />
              
              <Typography variant="h4" sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Redirecting...
              </Typography>
              
              <CircularProgress 
                sx={{ 
                  color: '#fa709a',
                  mb: 3
                }} 
              />
              
              <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                You will be redirected to:
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3,
                  color: '#fa709a',
                  wordBreak: 'break-all',
                  backgroundColor: 'rgba(250, 112, 154, 0.1)',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid rgba(250, 112, 154, 0.3)'
                }}
              >
                {originalUrl}
              </Typography>

              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                If you are not redirected automatically, click below:
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  onClick={() => window.location.href = originalUrl}
                  sx={{
                    borderColor: '#fa709a',
                    color: '#fa709a',
                    '&:hover': {
                      borderColor: '#e85d89',
                      backgroundColor: 'rgba(250, 112, 154, 0.1)'
                    }
                  }}
                >
                  Go Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}