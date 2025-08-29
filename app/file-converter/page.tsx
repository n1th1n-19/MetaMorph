'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Alert, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

export default function FileConverterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const supportedFormats = [
    { value: 'xlsx', label: 'Excel (.xlsx)', icon: TableChartIcon, color: '#4caf50' },
    { value: 'csv', label: 'CSV (.csv)', icon: TableChartIcon, color: '#2196f3' },
    { value: 'json', label: 'JSON (.json)', icon: DataObjectIcon, color: '#ff9800' },
    { value: 'txt', label: 'Text (.txt)', icon: DescriptionIcon, color: '#9c27b0' },
    { value: 'pdf', label: 'PDF (.pdf)', icon: PictureAsPdfIcon, color: '#f44336' }
  ];
  
  // Get available formats based on input file type
  const getAvailableFormats = () => {
    if (!selectedFile) return [];
    
    const fileName = selectedFile.name.toLowerCase();
    
    if (fileName.endsWith('.docx')) {
      // Word files can only be converted to text
      return supportedFormats.filter(format => format.value === 'txt');
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      // Excel and CSV files can be converted to various formats
      return supportedFormats.filter(format => ['csv', 'json', 'txt', 'xlsx'].includes(format.value));
    }
    
    return supportedFormats;
  };
  
  const inputFormats = [
    { ext: '.xlsx', label: 'Excel Spreadsheet', icon: TableChartIcon },
    { ext: '.xls', label: 'Excel Legacy', icon: TableChartIcon },
    { ext: '.docx', label: 'Word Document', icon: DescriptionIcon },
    { ext: '.csv', label: 'CSV File', icon: TableChartIcon }
  ];
  
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
      const validExtensions = ['.xlsx', '.xls', '.docx', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        showNotification('Unsupported file format. Please select Excel, Word, or CSV files.', 'error');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        showNotification('File size must be less than 50MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setSuccess('');
      setOutputFormat(''); // Reset output format when new file is selected
      
      // Show file type specific notification
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.docx')) {
        showNotification('Word document loaded. Can be converted to text format.', 'info');
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        showNotification('Excel file loaded. Multiple output formats available.', 'success');
      } else if (fileName.endsWith('.csv')) {
        showNotification('CSV file loaded. Multiple output formats available.', 'success');
      } else {
        showNotification('File loaded successfully', 'success');
      }
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
      const fakeEvent = {
        target: { files: [file] }
      } as any;
      handleFileChange(fakeEvent);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) {
      showNotification('Please select a file and output format', 'warning');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      setProgress(25);
      
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        await convertFromExcel();
      } else if (selectedFile.name.endsWith('.docx')) {
        await convertFromWord();
      } else {
        throw new Error('Unsupported input file format');
      }
      
      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert file';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      console.error(err);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };
  
  const clearAll = () => {
    setSelectedFile(null);
    setOutputFormat('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('All data cleared', 'info');
  };

  const convertFromExcel = async () => {
    const data = await selectedFile!.arrayBuffer();
    setProgress(50);
    
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    setProgress(75);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const baseFileName = selectedFile!.name.split('.')[0];

    switch (outputFormat) {
      case 'csv':
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        saveAs(csvBlob, `${baseFileName}_${timestamp}.csv`);
        break;
      case 'json':
        const json = XLSX.utils.sheet_to_json(worksheet);
        const jsonBlob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        saveAs(jsonBlob, `${baseFileName}_${timestamp}.json`);
        break;
      case 'txt':
        const txt = XLSX.utils.sheet_to_txt(worksheet);
        const txtBlob = new Blob([txt], { type: 'text/plain' });
        saveAs(txtBlob, `${baseFileName}_${timestamp}.txt`);
        break;
      case 'xlsx':
        // Re-save as xlsx (useful for cleaning up files)
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
        XLSX.writeFile(newWorkbook, `${baseFileName}_converted_${timestamp}.xlsx`);
        break;
    }
    
    setSuccess('File converted successfully!');
    showNotification('File converted and downloaded!', 'success');
  };

  const convertFromWord = async () => {
    const arrayBuffer = await selectedFile!.arrayBuffer();
    setProgress(50);
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    setProgress(75);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const baseFileName = selectedFile!.name.split('.')[0];
    
    // Word files can only be converted to text format
    if (outputFormat === 'txt') {
      const txtBlob = new Blob([result.value], { type: 'text/plain' });
      saveAs(txtBlob, `${baseFileName}_${timestamp}.txt`);
      setSuccess('File converted successfully!');
      showNotification('Word document converted to text!', 'success');
    } else {
      // This should not happen now since UI only shows txt option for Word files
      throw new Error('Word documents can only be converted to text format. Please select TXT as output format.');
    }
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
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#000',
            '&:hover': {
              background: 'linear-gradient(135deg, #3ed46d 0%, #32e6cd 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)'
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
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                File Converter
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Convert files between different formats
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
                      <AttachFileIcon sx={{ color: '#43e97b', mr: 1 }} />
                      <Typography variant="h6">File Upload</Typography>
                    </Box>
                    
                    {/* Drag & Drop Zone */}
                    <Box
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        border: '2px dashed rgba(67, 233, 123, 0.3)',
                        backgroundColor: 'rgba(67, 233, 123, 0.05)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        mb: 3,
                        '&:hover': {
                          borderColor: 'rgba(67, 233, 123, 0.5)',
                          backgroundColor: 'rgba(67, 233, 123, 0.1)'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.docx,.csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      
                      <Avatar sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: 'rgba(67, 233, 123, 0.2)',
                        color: '#43e97b'
                      }}>
                        <CloudUploadIcon sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drop file here or click to browse
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Supports Excel, Word, CSV (max 50MB)
                      </Typography>
                    </Box>
                    
                    {/* Supported Formats */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Supported Input Formats:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {inputFormats.map((format) => {
                          const IconComponent = format.icon;
                          return (
                            <Chip
                              key={format.ext}
                              icon={<IconComponent fontSize="small" />}
                              label={format.ext}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(67, 233, 123, 0.1)',
                                color: '#43e97b',
                                border: '1px solid rgba(67, 233, 123, 0.3)'
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                    
                    {/* Selected File Info */}
                    {selectedFile && (
                      <Fade in timeout={400}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 1,
                          background: 'rgba(67, 233, 123, 0.1)',
                          border: '1px solid rgba(67, 233, 123, 0.3)',
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
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Conversion Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CompareArrowsIcon sx={{ color: '#43e97b', mr: 1 }} />
                      <Typography variant="h6">Convert Settings</Typography>
                    </Box>
                    
                    {/* Output Format Selection */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Output Format</InputLabel>
                      <Select
                        value={outputFormat}
                        label="Output Format"
                        onChange={(e) => setOutputFormat(e.target.value)}
                        disabled={!selectedFile}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#43e97b' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43e97b' }
                        }}
                      >
                        {getAvailableFormats().map((format) => {
                          const IconComponent = format.icon;
                          return (
                            <MenuItem key={format.value} value={format.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconComponent 
                                  sx={{ 
                                    mr: 1, 
                                    fontSize: '1.2rem',
                                    color: format.color
                                  }} 
                                />
                                {format.label}
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {selectedFile && (
                        <Typography variant="caption" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.6)' }}>
                          {getAvailableFormats().length} format{getAvailableFormats().length !== 1 ? 's' : ''} available for this file type
                        </Typography>
                      )}
                    </FormControl>
                    
                    {/* Format Preview */}
                    {outputFormat && (
                      <Fade in timeout={300}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 1,
                          background: 'rgba(67, 233, 123, 0.05)',
                          border: '1px solid rgba(67, 233, 123, 0.2)',
                          mb: 3
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {(() => {
                                const selectedFormat = supportedFormats.find(f => f.value === outputFormat);
                                if (!selectedFormat) return null;
                                const IconComponent = selectedFormat.icon;
                                return (
                                  <>
                                    <IconComponent 
                                      sx={{ 
                                        mr: 1, 
                                        color: selectedFormat.color
                                      }} 
                                    />
                                    <Typography variant="body2">
                                      Converting to: <strong>{selectedFormat.label}</strong>
                                    </Typography>
                                  </>
                                );
                              })()}
                            </Box>
                            
                            {/* Show input file type indicator */}
                            {selectedFile && (
                              <Chip 
                                label={selectedFile.name.split('.').pop()?.toUpperCase()}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(67, 233, 123, 0.2)',
                                  color: '#43e97b',
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Fade>
                    )}
                    
                    {/* Action Buttons */}
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        onClick={handleConvert}
                        disabled={!selectedFile || !outputFormat || isProcessing}
                        startIcon={isProcessing ? <></> : <CompareArrowsIcon />}
                        fullWidth
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: '#000',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #3ed46d 0%, #32e6cd 100%)',
                          },
                          '&.Mui-disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      >
                        {isProcessing ? `Converting... ${progress}%` : 'Convert & Download'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={clearAll}
                        disabled={!selectedFile && !outputFormat}
                        sx={{
                          borderColor: 'rgba(244, 67, 54, 0.5)',
                          color: '#f44336',
                          '&:hover': {
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)'
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    </Stack>
                    
                    {/* Progress Bar */}
                    {isProcessing && progress > 0 && (
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
                                backgroundColor: '#43e97b'
                              }
                            }}
                          />
                        </Box>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Status Messages */}
            {(error || success) && (
              <Fade in timeout={400}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {error && (
                    <Grid item xs={12}>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          color: '#f44336'
                        }}
                        onClose={() => setError('')}
                        icon={<ErrorIcon />}
                      >
                        {error}
                      </Alert>
                    </Grid>
                  )}
                  
                  {success && (
                    <Grid item xs={12}>
                      <Alert 
                        severity="success" 
                        sx={{ 
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          color: '#4caf50'
                        }}
                        onClose={() => setSuccess('')}
                        icon={<CheckCircleIcon />}
                      >
                        {success}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
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