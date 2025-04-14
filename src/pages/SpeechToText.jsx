import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  IconButton, 
  Paper, 
  TextField, 
  Typography, 
  Snackbar, 
  Alert, 
  Fade,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  Mic as MicIcon, 
  MicOff as MicOffIcon, 
  ContentCopy as CopyIcon, 
  Delete as DeleteIcon, 
  Warning as WarningIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2e7d32', 
    },
    error: {
      main: '#d32f2f', 
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupport(false);
    }
  }, []);
  
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  useEffect(() => {
    if (showTranslation && transcript) {
      setShowTranslation(false);
      setTranslatedText('');
    }
  }, [transcript]);
  
  const startListening = () => {
    setIsListening(true);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    
    recognition.start();
    
    window.recognitionInstance = recognition;
  };
  
  const stopListening = () => {
    setIsListening(false);
    if (window.recognitionInstance) {
      window.recognitionInstance.stop();
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
    setShowTranslation(false);
    setTranslatedText('');
  };
  
  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess(true);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  const translateText = async () => {
    if (!transcript.trim()) return;
    
    setIsTranslating(true);
    setTranslationError(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTranslatedText = `[Translated to ${languages.find(lang => lang.code === targetLanguage).name}]: ${transcript}`;
      setTranslatedText(mockTranslatedText);
      setShowTranslation(true);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError(true);
    } finally {
      setIsTranslating(false);
    }
  };
  
  if (!browserSupport) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert 
            severity="warning" 
            icon={<WarningIcon />} 
            variant="outlined"
          >
            Speech Recognition is not supported in this browser. Please use Chrome or Edge.
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <Box 
            sx={{ 
              background: 'linear-gradient(90deg, #1976d2 0%, #2e7d32 100%)',
              p: 2,
              color: 'white'
            }}
          >
            <Typography variant="h5" align="center" fontWeight="bold">
              Speech-to-Text Converter
            </Typography>
          </Box>
          
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                value={transcript}
                placeholder="Your speech will appear here..."
                InputProps={{
                  readOnly: true,
                }}
              />
              
              {transcript && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    display: 'flex',
                    gap: 0.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 1,
                    p: 0.5
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(transcript)}
                    color="primary"
                    aria-label="copy to clipboard"
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={resetTranscript}
                    color="error"
                    aria-label="clear text"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="contained"
                startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
                onClick={isListening ? stopListening : startListening}
                color={isListening ? "error" : "primary"}
                size="large"
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                  py: 1.5
                }}
              >
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>
            </Box>
            
            <Typography 
              variant="caption" 
              align="center" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Click the button above to start or stop voice recognition
            </Typography>

            {transcript && (
              <>
                <Divider sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Translation
                  </Typography>
                </Divider>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="language-select-label">Translate to</InputLabel>
                      <Select
                        labelId="language-select-label"
                        value={targetLanguage}
                        label="Translate to"
                        onChange={(e) => setTargetLanguage(e.target.value)}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={isTranslating ? <CircularProgress size={16} color="inherit" /> : <TranslateIcon />}
                      onClick={translateText}
                      disabled={isTranslating || !transcript}
                    >
                      Translate
                    </Button>
                  </Grid>
                </Grid>

                {showTranslation && (
                  <Box sx={{ position: 'relative', mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      value={translatedText}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                        p: 0.5
                      }}
                    >
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(translatedText)}
                        color="primary"
                        aria-label="copy translation"
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {translationError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Translation failed. Please try again later.
                  </Alert>
                )}
              </>
            )}
          </Box>
        </Paper>
        
        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">
            Copied to clipboard!
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}