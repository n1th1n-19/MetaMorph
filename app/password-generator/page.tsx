'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Checkbox,
  Slider,
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
  LinearProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

export default function PasswordGenerator() {
  const router = useRouter();
  
  const [password, setPassword] = useState('GeneratedPassword123!');
  const [showPassword, setShowPassword] = useState(true);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as any });

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setSnackbar({
        open: true,
        message: 'Please select at least one character type',
        severity: 'warning'
      });
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    setPassword(newPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({
        open: true,
        message: 'Password copied to clipboard!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to copy password',
        severity: 'error'
      });
    }
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
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
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
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                Password Generator
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Generate secure, random passwords with customizable options
              </Typography>
            </Box>

            {/* Password Display */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6">Generated Password</Typography>
                </Box>

                <TextField
                  fullWidth
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={showPassword ? 'Hide Password' : 'Show Password'}>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Password">
                          <IconButton
                            onClick={() => copyToClipboard(password)}
                            edge="end"
                            sx={{ color: '#4caf50' }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ),
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: '#4caf50' },
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                    }
                  }}
                  sx={{ mb: 3 }}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={generatePassword}
                    startIcon={<RefreshIcon />}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                      }
                    }}
                  >
                    Generate New Password
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => copyToClipboard(password)}
                    startIcon={<ContentCopyIcon />}
                    sx={{
                      borderColor: 'rgba(76, 175, 80, 0.5)',
                      color: '#4caf50',
                      '&:hover': {
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)'
                      }
                    }}
                  >
                    Copy
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Password Options
                </Typography>

                <Stack spacing={3}>
                  {/* Length Slider */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                      Password Length: {length} characters
                    </Typography>
                    <Slider
                      value={length}
                      onChange={(e, newValue) => setLength(newValue as number)}
                      min={4}
                      max={128}
                      step={1}
                      marks={[
                        { value: 8, label: '8' },
                        { value: 16, label: '16' },
                        { value: 32, label: '32' },
                        { value: 64, label: '64' }
                      ]}
                      sx={{
                        color: '#4caf50',
                        '& .MuiSlider-thumb': { backgroundColor: '#4caf50' },
                        '& .MuiSlider-track': { backgroundColor: '#4caf50' },
                        '& .MuiSlider-mark': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                        '& .MuiSlider-markLabel': { color: 'rgba(255, 255, 255, 0.6)' }
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Character Type Options */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                      Include Characters
                    </Typography>
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }}
                          />
                        }
                        label="Uppercase (A-Z)"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }}
                          />
                        }
                        label="Lowercase (a-z)"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }}
                          />
                        }
                        label="Numbers (0-9)"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }}
                          />
                        }
                        label="Symbols (!@#$%^&*)"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
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