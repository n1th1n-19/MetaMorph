'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { nanoid } from "nanoid";
import { 
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import HomeIcon from "@mui/icons-material/Home";

interface UrlHistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export default function URLShortener() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  });

  const [urlHistory, setUrlHistory] = useState<UrlHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem("url-shortener-history");
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("url-shortener-history", JSON.stringify(urlHistory));
    }
  }, [urlHistory]);

  const validateUrl = (url: string) => {
    if (!url.trim()) return "URL cannot be empty";
    try {
      new URL(url);
      return "";
    } catch (error) {
      return "Please enter a valid URL (with http:// or https://)";
    }
  };

  const generateShortUrl = async () => {
    const error = validateUrl(originalUrl);
    if (error) {
      setUrlError(error);
      return;
    }

    setIsLoading(true);
    setUrlError("");

    try {
      // Generate a random short code
      const shortCode = nanoid(8);
      
      // Create short URL using current domain
      const currentDomain = window.location.origin;
      const shortLink = `${currentDomain}/r/${shortCode}`;
      
      // Store the URL mapping in localStorage
      const urlMappings = JSON.parse(localStorage.getItem('url-mappings') || '{}');
      urlMappings[shortCode] = {
        originalUrl,
        createdAt: new Date().toISOString(),
        clicks: 0
      };
      localStorage.setItem('url-mappings', JSON.stringify(urlMappings));
      
      setShortUrl(shortLink);
      
      const newEntry: UrlHistoryItem = {
        id: nanoid(),
        originalUrl,
        shortUrl: shortLink,
        createdAt: new Date().toISOString(),
        clicks: 0
      };
      
      setUrlHistory(prev => [newEntry, ...prev].slice(0, 10));
      showNotification("URL shortened successfully! The short URL will redirect to your original URL.", "success");
    } catch (error) {
      showNotification("Failed to generate short URL. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (textToCopy = shortUrl) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification("Short URL copied to clipboard! You can share this link and it will redirect to your original URL.", "success");
    } catch (error) {
      showNotification("Failed to copy URL", "error");
    }
  };
  
  const updateClickCount = (shortUrl: string) => {
    try {
      const code = shortUrl.split('/').pop();
      if (!code) return;
      
      const urlMappings = JSON.parse(localStorage.getItem('url-mappings') || '{}');
      if (urlMappings[code]) {
        const updatedHistory = urlHistory.map(item => {
          if (item.shortUrl === shortUrl) {
            return { ...item, clicks: urlMappings[code].clicks || 0 };
          }
          return item;
        });
        setUrlHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };
  
  // Update click counts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      urlHistory.forEach(item => {
        updateClickCount(item.shortUrl);
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [urlHistory]);

  const showNotification = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const deleteHistoryItem = (id: string) => {
    setUrlHistory(prev => prev.filter(item => item.id !== id));
    showNotification("URL removed from history", "info");
  };

  const clearHistory = () => {
    setUrlHistory([]);
    showNotification("History cleared", "info");
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
      py: 4,
      position: 'relative'
    }}>
      {/* Home Navigation Button */}
      <Tooltip title="Back to Home" placement="right">
        <Fab
          size="medium"
          onClick={() => router.push('/')}
          sx={{
            position: 'fixed',
            top: 24,
            left: 24,
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#000',
            '&:hover': {
              background: 'linear-gradient(135deg, #e85d89 0%, #f5d835 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(250, 112, 154, 0.3)'
          }}
        >
          <HomeIcon />
        </Fab>
      </Tooltip>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant={isMobile ? 'h4' : 'h3'}
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                URL Shortener
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Create short, shareable links from long URLs in seconds
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Input Section */}
              <Grid item xs={12} md={8}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)' 
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LinkIcon sx={{ color: '#fa709a', mr: 1 }} />
                      <Typography variant="h6">Shorten Your URL</Typography>
                    </Box>

                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        value={originalUrl}
                        onChange={(e) => {
                          setOriginalUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                        placeholder="https://example.com/your-very-long-url-here"
                        error={!!urlError}
                        helperText={urlError}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: '#fa709a' },
                            '&.Mui-focused fieldset': { borderColor: '#fa709a' }
                          }
                        }}
                      />

                      <Button
                        variant="contained"
                        size="large"
                        onClick={generateShortUrl}
                        disabled={!originalUrl.trim() || isLoading}
                        startIcon={<ShortcutIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          color: '#000',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #e85d89 0%, #f5d835 100%)',
                          },
                          '&.Mui-disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      >
                        {isLoading ? 'Shortening...' : 'Shorten URL'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Result Section */}
                {shortUrl && (
                  <Fade in timeout={600}>
                    <Card sx={{ 
                      mt: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)' 
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: '#fa709a' }}>
                          Your Shortened URL
                        </Typography>

                        <Box sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(250, 112, 154, 0.1)',
                          border: '1px solid rgba(250, 112, 154, 0.3)',
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Typography
                              component="a"
                              href={shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#fa709a',
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                '&:hover': { textDecoration: 'underline' },
                                wordBreak: 'break-all',
                                flex: 1
                              }}
                              title="Click to test the redirect (opens in new tab)"
                            >
                              {shortUrl}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                              <IconButton
                                onClick={() => copyToClipboard()}
                                size="small"
                                sx={{
                                  color: '#fa709a',
                                  backgroundColor: 'rgba(250, 112, 154, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(250, 112, 154, 0.2)' }
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                component="a"
                                href={shortUrl}
                                target="_blank"
                                size="small"
                                sx={{
                                  color: '#fa709a',
                                  backgroundColor: 'rgba(250, 112, 154, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(250, 112, 154, 0.2)' }
                                }}
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                            <strong>Original:</strong> {originalUrl.length > 80 ? `${originalUrl.substring(0, 80)}...` : originalUrl}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 0.5, display: 'block' }}>
                            💡 This short URL will redirect visitors to your original URL
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Grid>

              {/* History Section */}
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)' 
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HistoryIcon sx={{ color: '#fa709a', mr: 1 }} />
                        <Typography variant="h6">History</Typography>
                        {urlHistory.length > 0 && (
                          <Chip 
                            label={urlHistory.length} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: 'rgba(250, 112, 154, 0.2)',
                              color: '#fa709a',
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                      </Box>
                      
                      <IconButton
                        onClick={() => setShowHistory(!showHistory)}
                        size="small"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showHistory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    <Collapse in={showHistory}>
                      {urlHistory.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 3, opacity: 0.7 }}>
                          <LinkIcon sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.3)', mb: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Your shortened URLs will appear here
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Recent URLs
                            </Typography>
                            <Button
                              size="small"
                              onClick={clearHistory}
                              sx={{
                                color: '#f44336',
                                fontSize: '0.7rem',
                                minWidth: 'auto',
                                p: 0.5,
                                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                              }}
                            >
                              Clear
                            </Button>
                          </Box>
                          
                          <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                            {urlHistory.map((item, index) => (
                              <React.Fragment key={item.id}>
                                <ListItem 
                                  sx={{ 
                                    px: 0,
                                    py: 1,
                                    alignItems: 'flex-start'
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="a"
                                        href={item.shortUrl}
                                        target="_blank"
                                        sx={{
                                          color: '#fa709a',
                                          textDecoration: 'none',
                                          fontSize: '0.9rem',
                                          fontWeight: 500,
                                          '&:hover': { textDecoration: 'underline' },
                                          display: 'block',
                                          wordBreak: 'break-all'
                                        }}
                                      >
                                        {item.shortUrl.replace('https://', '')}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            display: 'block',
                                            mt: 0.5
                                          }}
                                        >
                                          {new Date(item.createdAt).toLocaleDateString()}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                  <Stack direction="row" spacing={0.5}>
                                    <IconButton
                                      size="small"
                                      onClick={() => copyToClipboard(item.shortUrl)}
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        '&:hover': { color: '#fa709a' }
                                      }}
                                    >
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => deleteHistoryItem(item.id)}
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        '&:hover': { color: '#f44336' }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                </ListItem>
                                {index < urlHistory.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                              </React.Fragment>
                            ))}
                          </List>
                        </>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}