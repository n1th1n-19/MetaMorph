'use client';

import { QRCodeSVG } from "qrcode.react";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  IconButton, 
  Grid, 
  Paper,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const downloadStringAsFile = (data: string, filename: string) => {
  try {
    const a = document.createElement("a");
    a.download = filename;
    a.href = data;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error("Download failed:", error);
    return false;
  }
};

const convertSvgToPng = (svgNode: SVGSVGElement, callback: (pngData: string | null, error: Error | null) => void) => {
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        callback(null, new Error("Failed to get canvas context"));
        return;
      }
      
      ctx.scale(scale, scale);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngData = canvas.toDataURL("image/png");
      callback(pngData, null);
    };
    
    img.onerror = () => callback(null, new Error("Image conversion failed"));
    img.src = svgData;
  } catch (error) {
    callback(null, error as Error);
  }
};

const serializeSvg = (svgNode: SVGSVGElement) => {
  if (!svgNode) return null;
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    return {
      string: svgString,
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
    };
  } catch (error) {
    console.error("SVG serialization failed:", error);
    return null;
  }
};

export default function QRCodePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [value, setValue] = useState("https://github.com/n1th1n-19");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState("H");
  const [foregroundColor, setForegroundColor] = useState("#4facfe");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as any });
  const [isLoading, setIsLoading] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  const showNotification = useCallback((message: string, severity: "success" | "error" | "warning" | "info" = "success") => {
    setNotification({ open: true, message, severity });
  }, []);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleDownloadSvg = useCallback(() => {
    setIsLoading(true);
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      setIsLoading(false);
      return;
    }
    
    const result = serializeSvg(svgNode);
    if (!result) {
      showNotification("Failed to generate SVG", "error");
      setIsLoading(false);
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const contentHint = value.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `qrcode_${contentHint}_${timestamp}.svg`;
    
    const success = downloadStringAsFile(result.dataUrl, filename);
    showNotification(success ? "SVG downloaded successfully" : "Failed to download SVG", success ? "success" : "error");
    setIsLoading(false);
  }, [value, showNotification]);

  const handleDownloadPng = useCallback(() => {
    setIsLoading(true);
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      setIsLoading(false);
      return;
    }
    
    convertSvgToPng(svgNode, (pngData, error) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const contentHint = value.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `qrcode_${contentHint}_${timestamp}.png`;
      
      if (error || !pngData) {
        showNotification("Failed to convert to PNG", "error");
      } else {
        const success = downloadStringAsFile(pngData, filename);
        showNotification(success ? "PNG downloaded successfully" : "Failed to download PNG", success ? "success" : "error");
      }
      setIsLoading(false);
    });
  }, [value, showNotification]);

  const handleCopySvg = useCallback(() => {
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      return;
    }
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    
    navigator.clipboard.writeText(svgString)
      .then(() => showNotification("SVG copied to clipboard"))
      .catch(() => showNotification("Failed to copy SVG", "error"));
  }, [showNotification]);

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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #3d8bfe 0%, #00d9fe 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
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
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                QR Code Generator
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Generate beautiful QR codes from text or URLs with customization options
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Input & Controls */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  {/* Input Card */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <QrCodeIcon sx={{ color: '#4facfe', mr: 1 }} />
                        <Typography variant="h6">Content</Typography>
                      </Box>
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter text, URL, or any content to generate QR code"
                        variant="outlined"
                        InputProps={{
                          endAdornment: value && (
                            <IconButton onClick={() => setValue('')} size="small">
                              <ClearIcon />
                            </IconButton>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: '#4facfe' },
                            '&.Mui-focused fieldset': { borderColor: '#4facfe' }
                          }
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Customization Card */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <TuneIcon sx={{ color: '#4facfe', mr: 1 }} />
                        <Typography variant="h6">Customization</Typography>
                      </Box>

                      <Stack spacing={3}>
                        {/* Size */}
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Size: {size}px
                          </Typography>
                          <Slider
                            value={size}
                            onChange={(_, value) => setSize(value as number)}
                            min={100}
                            max={400}
                            step={10}
                            sx={{ color: '#4facfe' }}
                          />
                        </Box>

                        {/* Error Correction */}
                        <FormControl fullWidth>
                          <InputLabel>Error Correction</InputLabel>
                          <Select
                            value={errorCorrection}
                            onChange={(e) => setErrorCorrection(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': { 
                                borderColor: 'rgba(255, 255, 255, 0.2)' 
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': { 
                                borderColor: '#4facfe' 
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                                borderColor: '#4facfe' 
                              }
                            }}
                          >
                            <MenuItem value="L">Low (7%)</MenuItem>
                            <MenuItem value="M">Medium (15%)</MenuItem>
                            <MenuItem value="Q">Quartile (25%)</MenuItem>
                            <MenuItem value="H">High (30%)</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Colors */}
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ColorLensIcon sx={{ color: '#4facfe', mr: 1 }} />
                            <Typography variant="body2">Colors</Typography>
                          </Box>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box>
                                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                  Foreground
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <input
                                    type="color"
                                    value={foregroundColor}
                                    onChange={(e) => setForegroundColor(e.target.value)}
                                    style={{ 
                                      width: 40, 
                                      height: 40, 
                                      border: 'none', 
                                      borderRadius: 8,
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {foregroundColor}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>
                                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                                  Background
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    style={{ 
                                      width: 40, 
                                      height: 40, 
                                      border: 'none', 
                                      borderRadius: 8,
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {backgroundColor}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              {/* QR Code Preview & Actions */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  {/* Preview Card */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                        Preview
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        minHeight: 300,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 3
                      }}>
                        {value ? (
                          <Paper 
                            elevation={4}
                            sx={{ 
                              p: 2, 
                              backgroundColor: backgroundColor,
                              borderRadius: 2
                            }}
                          >
                            <QRCodeSVG
                              value={value}
                              size={size}
                              bgColor={backgroundColor}
                              fgColor={foregroundColor}
                              level={errorCorrection as any}
                              marginSize={2}
                              ref={svgRef}
                            />
                          </Paper>
                        ) : (
                          <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                            <QrCodeIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                            <Typography variant="body2">
                              Enter content to generate QR code
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Download & Share
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadSvg}
                            disabled={!value || isLoading}
                            sx={{ 
                              backgroundColor: '#4facfe',
                              '&:hover': { backgroundColor: '#3a8fe8' }
                            }}
                          >
                            SVG
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadPng}
                            disabled={!value || isLoading}
                            sx={{ 
                              backgroundColor: '#00f2fe',
                              '&:hover': { backgroundColor: '#00d9e8' }
                            }}
                          >
                            PNG
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopySvg}
                            disabled={!value}
                            sx={{ 
                              borderColor: '#4facfe',
                              color: '#4facfe',
                              '&:hover': { borderColor: '#3a8fe8', backgroundColor: 'rgba(79, 172, 254, 0.1)' }
                            }}
                          >
                            Copy
                          </Button>
                        </Grid>
                      </Grid>

                      {value && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Content: {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Stack>
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