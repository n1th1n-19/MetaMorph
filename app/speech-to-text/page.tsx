'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  TextField,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Fade,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
  Avatar,
  Fab
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HomeIcon from '@mui/icons-material/Home';

export default function SpeechToTextPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const recognitionRef = useRef<any>(null);
  
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        showNotification('Recording started', 'success');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        showNotification(`Recording error: ${event.error}`, 'error');
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      showNotification('Speech recognition is not supported in this browser', 'error');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      showNotification('Recording stopped', 'info');
    }
  };
  
  const copyToClipboard = async () => {
    if (!transcript.trim()) {
      showNotification('No text to copy', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(transcript);
      showNotification('Copied to clipboard!', 'success');
    } catch (error) {
      showNotification('Failed to copy text', 'error');
    }
  };
  
  const downloadTranscript = () => {
    if (!transcript.trim()) {
      showNotification('No text to download', 'warning');
      return;
    }
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Transcript downloaded!', 'success');
  };
  
  const clearTranscript = () => {
    setTranscript('');
    showNotification('Transcript cleared', 'info');
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #e91e63 0%, #f5576c 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)'
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
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                Speech to Text
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Convert audio recordings into text
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Recording Section */}
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <MicIcon sx={{ color: '#f093fb', mr: 1 }} />
                      <Typography variant="h6">Voice Recording</Typography>
                    </Box>
                    
                    {/* Recording Status */}
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      borderRadius: 2,
                      background: isRecording 
                        ? 'rgba(240, 147, 251, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: isRecording 
                        ? '1px solid rgba(240, 147, 251, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 3
                    }}>
                      <Avatar sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: isRecording ? '#f093fb' : 'rgba(255, 255, 255, 0.1)',
                        animation: isRecording ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }}>
                        {isRecording ? (
                          <VolumeUpIcon sx={{ fontSize: '2rem', color: '#fff' }} />
                        ) : (
                          <MicIcon sx={{ fontSize: '2rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                        )}
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {isRecording ? 'Recording...' : 'Ready to Record'}
                      </Typography>
                      
                      <Chip 
                        label={isRecording ? 'LIVE' : 'IDLE'}
                        color={isRecording ? 'error' : 'default'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: isRecording ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                          color: '#fff'
                        }}
                      />
                    </Box>
                    
                    {/* Recording Controls */}
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={isRecording ? stopRecording : startRecording}
                        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                        fullWidth
                        sx={{
                          py: 1.5,
                          background: isRecording 
                            ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' 
                            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          '&:hover': {
                            background: isRecording 
                              ? 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)' 
                              : 'linear-gradient(135deg, #e91e63 0%, #f5576c 100%)',
                          }
                        }}
                      >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Transcript Section */}
              <Grid item xs={12} md={8}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RecordVoiceOverIcon sx={{ color: '#f093fb', mr: 1 }} />
                        <Typography variant="h6">Transcript</Typography>
                        {transcript && (
                          <Chip 
                            label={`${transcript.split(' ').length} words`} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: 'rgba(240, 147, 251, 0.2)',
                              color: '#f093fb',
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                      </Box>
                      
                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Copy to clipboard">
                          <IconButton
                            onClick={copyToClipboard}
                            size="small"
                            disabled={!transcript.trim()}
                            sx={{
                              color: transcript.trim() ? '#f093fb' : 'rgba(255, 255, 255, 0.3)',
                              '&:hover': { backgroundColor: 'rgba(240, 147, 251, 0.1)' }
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Download transcript">
                          <IconButton
                            onClick={downloadTranscript}
                            size="small"
                            disabled={!transcript.trim()}
                            sx={{
                              color: transcript.trim() ? '#f093fb' : 'rgba(255, 255, 255, 0.3)',
                              '&:hover': { backgroundColor: 'rgba(240, 147, 251, 0.1)' }
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Clear transcript">
                          <IconButton
                            onClick={clearTranscript}
                            size="small"
                            disabled={!transcript.trim()}
                            sx={{
                              color: transcript.trim() ? '#f44336' : 'rgba(255, 255, 255, 0.3)',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={isMobile ? 12 : 16}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Your speech will be converted to text here..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: '#f093fb' },
                          '&.Mui-focused fieldset': { borderColor: '#f093fb' }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '1rem',
                          lineHeight: 1.6
                        }
                      }}
                    />
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