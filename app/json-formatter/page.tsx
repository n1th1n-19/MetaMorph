'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  Fade,
  Fab,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Grid,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import {
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
  Clear as ClearIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  FormatSize as FormatSizeIcon,
  Compress as CompressIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

export default function JSONFormatter() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputJson, setInputJson] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York",\n  "hobbies": ["reading", "swimming", "coding"]\n}');
  const [outputJson, setOutputJson] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as any });

  const validateAndFormat = useCallback((jsonString: string, format: 'prettify' | 'minify' = 'prettify') => {
    try {
      if (!jsonString.trim()) {
        setIsValid(false);
        setErrorMessage('JSON input is empty');
        setOutputJson('');
        return;
      }

      const parsed = JSON.parse(jsonString);
      setIsValid(true);
      setErrorMessage('');
      
      let formatted;
      if (format === 'minify') {
        formatted = JSON.stringify(parsed);
      } else {
        // Sort keys if option is enabled
        const sortedParsed = sortKeys ? sortObjectKeys(parsed) : parsed;
        formatted = JSON.stringify(sortedParsed, null, indentSize);
      }
      
      setOutputJson(formatted);
    } catch (error) {
      setIsValid(false);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Invalid JSON format');
      }
      setOutputJson('');
    }
  }, [indentSize, sortKeys]);

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  };

  const handlePrettify = () => {
    validateAndFormat(inputJson, 'prettify');
    setSnackbar({
      open: true,
      message: 'JSON formatted successfully!',
      severity: 'success'
    });
  };

  const handleMinify = () => {
    validateAndFormat(inputJson, 'minify');
    setSnackbar({
      open: true,
      message: 'JSON minified successfully!',
      severity: 'success'
    });
  };

  const handleValidate = () => {
    validateAndFormat(inputJson, 'prettify');
    if (isValid) {
      setSnackbar({
        open: true,
        message: 'JSON is valid!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'JSON is invalid!',
        severity: 'error'
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({
        open: true,
        message: 'JSON copied to clipboard!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to copy JSON',
        severity: 'error'
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputJson(content);
        validateAndFormat(content);
      };
      reader.readAsText(file);
    }
  };

  const downloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    setSnackbar({
      open: true,
      message: 'JSON file downloaded!',
      severity: 'success'
    });
  };

  const clearInput = () => {
    setInputJson('');
    setOutputJson('');
    setIsValid(true);
    setErrorMessage('');
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const sampleJson = {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        },
        "hobbies": ["reading", "swimming", "coding"],
        "isActive": true
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "address": {
          "street": "456 Oak Ave",
          "city": "San Francisco",
          "zipCode": "94102"
        },
        "hobbies": ["painting", "hiking"],
        "isActive": false
      }
    ],
    "total": 2,
    "timestamp": "2024-01-15T10:30:00Z"
  };

  const loadSampleJson = () => {
    const sample = JSON.stringify(sampleJson, null, 2);
    setInputJson(sample);
    validateAndFormat(sample);
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
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)'
          }}
        >
          <HomeIcon />
        </Fab>
      </Tooltip>

      <Container maxWidth="xl">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3"
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                JSON Formatter & Validator
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Format, validate, and beautify JSON data with syntax highlighting
              </Typography>
            </Box>

            {/* Options Panel */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Options
                </Typography>
                
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Indent Size: {indentSize}
                      </Typography>
                      <Slider
                        value={indentSize}
                        onChange={(e, newValue) => setIndentSize(newValue as number)}
                        min={1}
                        max={8}
                        step={1}
                        sx={{
                          color: '#2196f3',
                          '& .MuiSlider-thumb': { backgroundColor: '#2196f3' },
                          '& .MuiSlider-track': { backgroundColor: '#2196f3' }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sortKeys}
                          onChange={(e) => setSortKeys(e.target.checked)}
                          sx={{ 
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#2196f3' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2196f3' }
                          }}
                        />
                      }
                      label="Sort Keys"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => fileInputRef.current?.click()}
                        startIcon={<UploadIcon />}
                        sx={{
                          borderColor: 'rgba(33, 150, 243, 0.5)',
                          color: '#2196f3',
                          '&:hover': {
                            borderColor: '#2196f3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        Upload File
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={loadSampleJson}
                        sx={{
                          borderColor: 'rgba(33, 150, 243, 0.5)',
                          color: '#2196f3',
                          '&:hover': {
                            borderColor: '#2196f3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        Load Sample
                      </Button>
                    </Stack>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Grid container spacing={3}>
              {/* Input Section */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CodeIcon sx={{ color: '#2196f3', mr: 1 }} />
                        <Typography variant="h6">JSON Input</Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Clear Input">
                          <IconButton
                            onClick={clearInput}
                            size="small"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={inputJson}
                      onChange={(e) => setInputJson(e.target.value)}
                      placeholder="Paste your JSON here..."
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: '#2196f3' },
                          '&.Mui-focused fieldset': { borderColor: '#2196f3' }
                        }
                      }}
                    />

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button
                        variant="contained"
                        onClick={handlePrettify}
                        startIcon={<FormatSizeIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          }
                        }}
                      >
                        Prettify
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleMinify}
                        startIcon={<CompressIcon />}
                        sx={{
                          borderColor: 'rgba(33, 150, 243, 0.5)',
                          color: '#2196f3',
                          '&:hover': {
                            borderColor: '#2196f3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        Minify
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleValidate}
                        startIcon={isValid ? <CheckCircleIcon /> : <ErrorIcon />}
                        sx={{
                          borderColor: isValid ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)',
                          color: isValid ? '#4caf50' : '#f44336',
                          '&:hover': {
                            borderColor: isValid ? '#4caf50' : '#f44336',
                            backgroundColor: isValid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                          }
                        }}
                      >
                        Validate
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Output Section */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CodeIcon sx={{ color: '#2196f3', mr: 1 }} />
                        <Typography variant="h6">JSON Output</Typography>
                        {!isValid && (
                          <Chip 
                            label="Invalid" 
                            size="small" 
                            color="error"
                            sx={{ ml: 1 }}
                            icon={<ErrorIcon />}
                          />
                        )}
                        {isValid && outputJson && (
                          <Chip 
                            label="Valid" 
                            size="small" 
                            sx={{ 
                              ml: 1,
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              color: '#4caf50',
                              border: '1px solid rgba(76, 175, 80, 0.5)'
                            }}
                            icon={<CheckCircleIcon />}
                          />
                        )}
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        {outputJson && (
                          <>
                            <Tooltip title="Copy Output">
                              <IconButton
                                onClick={() => copyToClipboard(outputJson)}
                                size="small"
                                sx={{ color: '#2196f3' }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download JSON">
                              <IconButton
                                onClick={() => downloadJson(outputJson, 'formatted.json')}
                                size="small"
                                sx={{ color: '#4caf50' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </Box>

                    {/* Error Display */}
                    {!isValid && errorMessage && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          '& .MuiAlert-icon': { color: '#f44336' }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {errorMessage}
                        </Typography>
                      </Alert>
                    )}

                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={outputJson}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                        }
                      }}
                      placeholder="Formatted JSON will appear here..."
                    />

                    {outputJson && (
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Button
                            variant="contained"
                            onClick={() => copyToClipboard(outputJson)}
                            startIcon={<ContentCopyIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                              }
                            }}
                          >
                            Copy Output
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => downloadJson(outputJson, 'formatted.json')}
                            startIcon={<DownloadIcon />}
                            sx={{
                              borderColor: 'rgba(76, 175, 80, 0.5)',
                              color: '#4caf50',
                              '&:hover': {
                                borderColor: '#4caf50',
                                backgroundColor: 'rgba(76, 175, 80, 0.1)'
                              }
                            }}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}