'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Fade,
  Fab,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CompareArrows as CompareArrowsIcon,
  PhotoSizeSelectActual as PhotoSizeSelectActualIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
// import { useDropzone } from 'react-dropzone';

interface ConvertedImage {
  id: string;
  originalFile: File;
  originalFormat: string;
  targetFormat: string;
  convertedBlob: Blob;
  downloadUrl: string;
  originalSize: number;
  convertedSize: number;
  quality: number;
}

const formatOptions = [
  { value: 'png', label: 'PNG', description: 'Lossless compression, transparent backgrounds' },
  { value: 'jpeg', label: 'JPEG', description: 'High compression, smaller file sizes' },
  { value: 'webp', label: 'WebP', description: 'Modern format, excellent compression' },
  { value: 'bmp', label: 'BMP', description: 'Uncompressed bitmap format' },
];

export default function ImageConverter() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as any });

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      setSnackbar({
        open: true,
        message: 'Some files were ignored. Only image files are supported.',
        severity: 'warning'
      });
    }
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  }, []);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      setSnackbar({
        open: true,
        message: 'Some files were ignored. Only image files are supported.',
        severity: 'warning'
      });
    }
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const convertImage = async (file: File, format: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = canvasRef.current;
      
      if (!canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Clear canvas with white background for JPEG
        if (format === 'jpeg') {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
        const qualityValue = format === 'jpeg' || format === 'webp' ? quality / 100 : undefined;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          mimeType,
          qualityValue
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvertAll = async () => {
    if (selectedFiles.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one image to convert',
        severity: 'warning'
      });
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    const results: ConvertedImage[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const originalFormat = file.type.split('/')[1] || 'unknown';
        
        setConversionProgress((i / selectedFiles.length) * 100);
        
        if (originalFormat === targetFormat) {
          setSnackbar({
            open: true,
            message: `${file.name} is already in ${targetFormat.toUpperCase()} format`,
            severity: 'info'
          });
          continue;
        }

        try {
          const convertedBlob = await convertImage(file, targetFormat, quality);
          const downloadUrl = URL.createObjectURL(convertedBlob);
          
          results.push({
            id: `${Date.now()}-${i}`,
            originalFile: file,
            originalFormat,
            targetFormat,
            convertedBlob,
            downloadUrl,
            originalSize: file.size,
            convertedSize: convertedBlob.size,
            quality
          });
        } catch (error) {
          console.error(`Error converting ${file.name}:`, error);
          setSnackbar({
            open: true,
            message: `Failed to convert ${file.name}`,
            severity: 'error'
          });
        }
      }

      setConvertedImages(prev => [...prev, ...results]);
      setConversionProgress(100);
      
      if (results.length > 0) {
        setSnackbar({
          open: true,
          message: `Successfully converted ${results.length} image${results.length > 1 ? 's' : ''}`,
          severity: 'success'
        });
      }
    } finally {
      setIsConverting(false);
      setTimeout(() => setConversionProgress(0), 1000);
    }
  };

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.downloadUrl;
    const fileName = image.originalFile.name.replace(/\.[^/.]+$/, '') + '.' + image.targetFormat;
    link.download = fileName;
    link.click();
  };

  const downloadAllImages = () => {
    convertedImages.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeConvertedImage = (id: string) => {
    setConvertedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.downloadUrl);
      }
      return updated;
    });
  };

  const clearAll = () => {
    setSelectedFiles([]);
    convertedImages.forEach(img => URL.revokeObjectURL(img.downloadUrl));
    setConvertedImages([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #ee5a52 0%, #d63447 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
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
                variant="h3"
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                Image Format Converter
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Convert images between different formats with high-quality output
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Upload Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <ImageIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                      <Typography variant="h6">Upload Images</Typography>
                    </Box>

                    {/* Drag & Drop Zone */}
                    <Paper
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-input')?.click()}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: `2px dashed rgba(255, 255, 255, 0.3)`,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        mb: 3,
                        '&:hover': {
                          borderColor: '#ff6b6b',
                          backgroundColor: 'rgba(255, 107, 107, 0.1)'
                        }
                      }}
                    >
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#ff6b6b', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drag & drop images or click to browse
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        Select multiple files to convert
                      </Typography>
                      <Chip 
                        label="Supports: JPG, PNG, WebP, BMP, GIF" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 107, 107, 0.2)',
                          color: '#ff6b6b'
                        }} 
                      />
                    </Paper>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                          Selected Files ({selectedFiles.length})
                        </Typography>
                        <Stack spacing={1} sx={{ maxHeight: 200, overflow: 'auto' }}>
                          {selectedFiles.map((file, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 1
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                <PhotoSizeSelectActualIcon sx={{ color: '#ff6b6b', mr: 1, fontSize: 20 }} />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}
                                >
                                  {file.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 1 }}>
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => removeFile(index)}
                                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Settings Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SettingsIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                      <Typography variant="h6">Conversion Settings</Typography>
                    </Box>

                    <Stack spacing={3}>
                      {/* Target Format */}
                      <FormControl fullWidth>
                        <InputLabel>Target Format</InputLabel>
                        <Select
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b6b' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b6b' }
                          }}
                        >
                          {formatOptions.map((format) => (
                            <MenuItem key={format.value} value={format.value}>
                              <Box>
                                <Typography variant="body1">{format.label}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                  {format.description}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Quality Slider */}
                      {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                            Quality: {quality}%
                          </Typography>
                          <Slider
                            value={quality}
                            onChange={(e, value) => setQuality(value as number)}
                            min={10}
                            max={100}
                            step={5}
                            sx={{
                              color: '#ff6b6b',
                              '& .MuiSlider-thumb': { backgroundColor: '#ff6b6b' },
                              '& .MuiSlider-track': { backgroundColor: '#ff6b6b' }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Higher quality = larger file size
                          </Typography>
                        </Box>
                      )}

                      {/* Action Buttons */}
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          onClick={handleConvertAll}
                          disabled={selectedFiles.length === 0 || isConverting}
                          startIcon={isConverting ? <CircularProgress size={20} /> : <CompareArrowsIcon />}
                          sx={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ee5a52 0%, #d63447 100%)',
                            },
                            '&.Mui-disabled': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        >
                          {isConverting ? 'Converting...' : 'Convert All'}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={clearAll}
                          disabled={selectedFiles.length === 0 && convertedImages.length === 0}
                          startIcon={<RefreshIcon />}
                          sx={{
                            borderColor: 'rgba(255, 107, 107, 0.5)',
                            color: '#ff6b6b',
                            '&:hover': {
                              borderColor: '#ff6b6b',
                              backgroundColor: 'rgba(255, 107, 107, 0.1)'
                            }
                          }}
                        >
                          Clear All
                        </Button>
                      </Stack>

                      {/* Progress Bar */}
                      {isConverting && (
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={conversionProgress}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                            Progress: {Math.round(conversionProgress)}%
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Results Section */}
              {convertedImages.length > 0 && (
                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DownloadIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                          <Typography variant="h6">Converted Images ({convertedImages.length})</Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          onClick={downloadAllImages}
                          startIcon={<DownloadIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                            }
                          }}
                        >
                          Download All
                        </Button>
                      </Box>

                      <Grid container spacing={2}>
                        {convertedImages.map((image) => (
                          <Grid item xs={12} sm={6} md={4} key={image.id}>
                            <Card sx={{ 
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <CardContent>
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ 
                                    mb: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {image.originalFile.name}
                                </Typography>
                                
                                <Stack spacing={1} sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      Format:
                                    </Typography>
                                    <Typography variant="caption">
                                      {image.originalFormat.toUpperCase()} → {image.targetFormat.toUpperCase()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      Size:
                                    </Typography>
                                    <Typography variant="caption">
                                      {formatFileSize(image.originalSize)} → {formatFileSize(image.convertedSize)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      Compression:
                                    </Typography>
                                    <Typography variant="caption" sx={{ 
                                      color: image.convertedSize < image.originalSize ? '#4caf50' : '#ff9800'
                                    }}>
                                      {image.convertedSize < image.originalSize ? '-' : '+'}
                                      {Math.abs(Math.round(((image.convertedSize - image.originalSize) / image.originalSize) * 100))}%
                                    </Typography>
                                  </Box>
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => downloadImage(image)}
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                      flex: 1,
                                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                                      }
                                    }}
                                  >
                                    Download
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={() => removeConvertedImage(image.id)}
                                    sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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