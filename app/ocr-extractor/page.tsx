'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  TextField, 
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Fade,
  IconButton,
  Snackbar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  Fab
} from '@mui/material';
import { createWorker } from 'tesseract.js';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HomeIcon from '@mui/icons-material/Home';

export default function OCRExtractorPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setExtractedText('');
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      showNotification('Image loaded successfully', 'success');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const fakeEvent = {
          target: { files: [file] }
        } as any;
        handleFileChange(fakeEvent);
      } else {
        showNotification('Please drop a valid image file', 'error');
      }
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      showNotification('Please select an image file', 'warning');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress(0);

    try {
      const worker = await createWorker('eng');
      setProgress(25);
      
      // Set OCR parameters for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?@#$%^&*()_+-=[]{}|;:,.<>? '
      });
      setProgress(50);
      
      // Recognize text without logger to avoid DataCloneError
      const { data: { text } } = await worker.recognize(selectedFile);
      setProgress(90);
      
      setExtractedText(text.trim());
      await worker.terminate();
      setProgress(100);
      
      if (text.trim()) {
        showNotification('Text extracted successfully!', 'success');
      } else {
        showNotification('No text found in the image', 'warning');
      }
    } catch (err) {
      setError('Failed to extract text from image');
      showNotification('Failed to extract text from image', 'error');
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  const copyToClipboard = async () => {
    if (!extractedText.trim()) {
      showNotification('No text to copy', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(extractedText);
      showNotification('Copied to clipboard!', 'success');
    } catch (error) {
      showNotification('Failed to copy text', 'error');
    }
  };
  
  const downloadText = () => {
    if (!extractedText.trim()) {
      showNotification('No text to download', 'warning');
      return;
    }
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_text_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Text downloaded!', 'success');
  };
  
  const clearAll = () => {
    setSelectedFile(null);
    setExtractedText('');
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('All data cleared', 'info');
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
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#000',
            '&:hover': {
              background: 'linear-gradient(135deg, #96e6df 0%, #fdc5d1 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(168, 237, 234, 0.3)'
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
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                OCR Text Extractor
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Extract text from images using OCR technology
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Upload Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <ImageIcon sx={{ color: '#a8edea', mr: 1 }} />
                      <Typography variant="h6">Image Upload</Typography>
                    </Box>
                    
                    {/* Drag & Drop Zone */}
                    <Box
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        border: '2px dashed rgba(168, 237, 234, 0.3)',
                        backgroundColor: 'rgba(168, 237, 234, 0.05)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        mb: 3,
                        '&:hover': {
                          borderColor: 'rgba(168, 237, 234, 0.5)',
                          backgroundColor: 'rgba(168, 237, 234, 0.1)'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      
                      <Avatar sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: 'rgba(168, 237, 234, 0.2)',
                        color: '#a8edea'
                      }}>
                        <PhotoCameraIcon sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drop image here or click to browse
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Supports JPG, PNG, GIF, BMP (max 10MB)
                      </Typography>
                    </Box>
                    
                    {/* Selected File Info */}
                    {selectedFile && (
                      <Fade in timeout={400}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 1,
                          background: 'rgba(168, 237, 234, 0.1)',
                          border: '1px solid rgba(168, 237, 234, 0.3)',
                          mb: 3
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {selectedFile.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                            <Chip 
                              label="Ready" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                color: '#4caf50'
                              }} 
                            />
                          </Box>
                        </Box>
                      </Fade>
                    )}
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <Fade in timeout={600}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                            Preview:
                          </Typography>
                          <Box sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                display: 'block'
                              }}
                            />
                          </Box>
                        </Box>
                      </Fade>
                    )}
                    
                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={handleExtractText}
                        disabled={!selectedFile || isProcessing}
                        startIcon={isProcessing ? <></> : <TextFieldsIcon />}
                        fullWidth
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                          color: '#000',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #96e6df 0%, #fdc5d1 100%)',
                          },
                          '&.Mui-disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      >
                        {isProcessing ? `Extracting... ${progress}%` : 'Extract Text'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={clearAll}
                        disabled={!selectedFile && !extractedText}
                        sx={{
                          borderColor: 'rgba(244, 67, 54, 0.5)',
                          color: '#f44336',
                          '&:hover': {
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)'
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </Stack>
                    
                    {/* Progress Bar */}
                    {isProcessing && (
                      <Fade in timeout={300}>
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#a8edea'
                              }
                            }}
                          />
                        </Box>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Results Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextFieldsIcon sx={{ color: '#a8edea', mr: 1 }} />
                        <Typography variant="h6">Extracted Text</Typography>
                        {extractedText && (
                          <Chip 
                            label={`${extractedText.split('\n').length} lines`} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: 'rgba(168, 237, 234, 0.2)',
                              color: '#a8edea',
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                      </Box>
                      
                      {/* Action Buttons */}
                      {extractedText && (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Copy to clipboard">
                            <IconButton
                              onClick={copyToClipboard}
                              size="small"
                              sx={{
                                color: '#a8edea',
                                '&:hover': { backgroundColor: 'rgba(168, 237, 234, 0.1)' }
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Download as text file">
                            <IconButton
                              onClick={downloadText}
                              size="small"
                              sx={{
                                color: '#a8edea',
                                '&:hover': { backgroundColor: 'rgba(168, 237, 234, 0.1)' }
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </Box>
                    
                    {extractedText ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={isMobile ? 12 : 16}
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        placeholder="Extracted text will appear here..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: '#a8edea' },
                            '&.Mui-focused fieldset': { borderColor: '#a8edea' }
                          },
                          '& .MuiInputBase-input': {
                            fontSize: '0.9rem',
                            lineHeight: 1.6
                          }
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        <VisibilityIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                          No text extracted yet
                        </Typography>
                        <Typography variant="body2">
                          Upload an image and extract text to see results here
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Error Alert */}
            {error && (
              <Fade in timeout={400}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#f44336'
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}
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