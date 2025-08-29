'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography, 
  Slider, 
  IconButton, 
  Alert, 
  Snackbar, 
  Tooltip, 
  FormHelperText,
  Paper,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Fade,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  Fab
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import HomeIcon from '@mui/icons-material/Home';
import DownloadIcon from '@mui/icons-material/Download';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

export default function TextToSpeech() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [text, setText] = useState("Hello, this is built-in TTS!");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as any });
  const [showSettings, setShowSettings] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const saved = localStorage.getItem("tts-favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, []);
  
  useEffect(() => {
    if (!synthRef.current) return;
    
    const synth = synthRef.current;
    
    const fetchVoices = () => {
      try {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        if (availableVoices.length > 0) {
          const matchingVoice = availableVoices.find(v => v.lang.startsWith(selectedLanguage));
          setSelectedVoice(matchingVoice ? matchingVoice.name : availableVoices[0].name);
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
        setSnackbar({
          open: true,
          message: "Could not load voices. TTS may not be supported in this browser.",
          severity: "error"
        });
      }
    };

    fetchVoices(); 
    
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = fetchVoices;
    }
    
    return () => {
      if (synth.speaking || synth.pending) {
        synth.cancel();
      }
    };
  }, [selectedLanguage]);
  
  useEffect(() => {
    const matchingVoices = voices.filter(voice => voice.lang.startsWith(selectedLanguage));
    setFilteredVoices(matchingVoices.length > 0 ? matchingVoices : voices);
    
    if (matchingVoices.length > 0) {
      setSelectedVoice(matchingVoices[0].name);
    }
  }, [selectedLanguage, voices]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("tts-favorites", JSON.stringify(favorites));
    }
  }, [favorites]);
  
  const createUtterance = () => {
    if (!text.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter some text to speak",
        severity: "warning"
      });
      return null;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setSnackbar({
          open: true,
          message: `Speech error: ${event.error}`,
          severity: "error"
        });
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      return utterance;
    } catch (error) {
      console.error("Error creating utterance:", error);
      setSnackbar({
        open: true,
        message: "Failed to create speech. Please try again.",
        severity: "error"
      });
      return null;
    }
  };

  const handlePlayAudio = () => {
    if (!synthRef.current) return;
    const synth = synthRef.current;
    
    if (isPaused) {
      try {
        synth.resume();
        setIsPaused(false);
        return;
      } catch (error) {
        console.error("Error resuming speech:", error);
      }
    }
    
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = createUtterance();
    if (utterance) {
      utteranceRef.current = utterance;
      try {
        synth.speak(utterance);
      } catch (error) {
        console.error("Error starting speech:", error);
        setSnackbar({
          open: true,
          message: "Failed to start speech. TTS may not be supported in this browser.",
          severity: "error"
        });
      }
    }
  };
  
  const handleRecordAndDownload = async () => {
    if (!synthRef.current) return;
    
    try {
      setIsRecording(true);
      setSnackbar({
        open: true,
        message: "Starting audio recording...",
        severity: "info"
      });

      // Request microphone access to capture system audio
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      // Create media recorder with better audio format options
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/wav';
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsRecording(false);
        setSnackbar({
          open: true,
          message: "Audio recorded successfully! You can now download it.",
          severity: "success"
        });
      };
      
      // Start recording
      mediaRecorder.start(100); // Record in 100ms chunks for better quality
      
      // Create and configure utterance
      const utterance = createUtterance();
      if (utterance) {        
        utterance.onend = () => {
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 500); // Small delay to ensure all audio is captured
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          setIsRecording(false);
          setSnackbar({
            open: true,
            message: "Recording failed. Please try again.",
            severity: "error"
          });
        };
        
        // Start speech synthesis
        synthRef.current.speak(utterance);
      }
      
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setSnackbar({
          open: true,
          message: "Microphone permission denied. Please allow microphone access to record audio.",
          severity: "error"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to start recording. Your browser may not support this feature.",
          severity: "error"
        });
      }
    }
  };
  
  const downloadAudio = () => {
    if (downloadUrl && audioBlob) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Determine file extension based on MIME type
      let extension = 'webm';
      if (audioBlob.type.includes('mp4')) extension = 'mp4';
      else if (audioBlob.type.includes('wav')) extension = 'wav';
      else if (audioBlob.type.includes('webm')) extension = 'webm';
      
      link.download = `speech_${new Date().toISOString().split('T')[0]}.${extension}`;
      link.click();
      setSnackbar({
        open: true,
        message: "Audio file downloaded!",
        severity: "success"
      });
    }
  };
  
  const clearRecording = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl('');
    setAudioBlob(null);
    setSnackbar({
      open: true,
      message: "Recording cleared",
      severity: "info"
    });
  };
  
  const handlePauseAudio = () => {
    if (!synthRef.current) return;
    const synth = synthRef.current;
    try {
      if (synth.speaking && !isPaused) {
        synth.pause();
        setIsPaused(true);
      }
    } catch (error) {
      console.error("Error pausing speech:", error);
      setSnackbar({
        open: true,
        message: "Pause is not supported in this browser",
        severity: "error"
      });
    }
  };
  
  const handleStopAudio = () => {
    if (!synthRef.current) return;
    const synth = synthRef.current;
    try {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  };
  
  const handleToggleFavorite = () => {
    const currentSettings = {
      text,
      voice: selectedVoice,
      language: selectedLanguage,
      rate,
      pitch,
      volume
    };
    
    const existingIndex = favorites.findIndex(fav => 
      fav.text === text && fav.voice === selectedVoice
    );
    
    if (existingIndex >= 0) {
      const newFavorites = [...favorites];
      newFavorites.splice(existingIndex, 1);
      setFavorites(newFavorites);
      setSnackbar({
        open: true,
        message: "Removed from favorites",
        severity: "info"
      });
    } else {
      setFavorites([...favorites, currentSettings]);
      setSnackbar({
        open: true,
        message: "Added to favorites",
        severity: "success"
      });
    }
  };
  
  const loadFavorite = (favorite: any) => {
    setText(favorite.text);
    setSelectedVoice(favorite.voice);
    setSelectedLanguage(favorite.language);
    setRate(favorite.rate);
    setPitch(favorite.pitch);
    setVolume(favorite.volume);
    
    setSnackbar({
      open: true,
      message: "Favorite loaded",
      severity: "info"
    });
  };
  
  const isFavorite = () => {
    return favorites.some(fav => 
      fav.text === text && fav.voice === selectedVoice
    );
  };
  
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ja-JP", name: "Japanese" },
    { code: "zh-CN", name: "Chinese (Mandarin)" },
    { code: "ar-SA", name: "Arabic" },
    { code: "ru-RU", name: "Russian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "it-IT", name: "Italian" },
    { code: "ko-KR", name: "Korean" }
  ];

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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1
                }}
              >
                Text to Speech
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Convert written text into natural-sounding speech
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
                      <CampaignIcon sx={{ color: '#667eea', mr: 1 }} />
                      <Typography variant="h6">Enter Your Text</Typography>
                    </Box>
      
                    <TextField
                      label="Enter text"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      fullWidth
                      placeholder="Type or paste the text you want to hear..."
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: '#667eea' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />

                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={selectedLanguage}
                              onChange={(e) => setSelectedLanguage(e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' }
                              }}
                            >
                              {languages.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                  {lang.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              Select language for speech
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Voice</InputLabel>
                            <Select
                              value={selectedVoice}
                              onChange={(e) => setSelectedVoice(e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' }
                              }}
                            >
                              {filteredVoices.length > 0 ? (
                                filteredVoices.map((voice) => (
                                  <MenuItem key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>No voices available</MenuItem>
                              )}
                            </Select>
                            <FormHelperText>
                              {filteredVoices.length} voice{filteredVoices.length !== 1 ? 's' : ''} available
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
      
                      {/* Controls */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 2,
                        p: 3,
                        borderRadius: 2,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        mb: 2
                      }}>
                        <Tooltip title={isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Play"}>
                          <IconButton
                            onClick={isPaused ? handlePlayAudio : isSpeaking ? handlePauseAudio : handlePlayAudio}
                            size="large"
                            disabled={isRecording}
                            sx={{
                              color: '#fff',
                              backgroundColor: '#667eea',
                              '&:hover': { backgroundColor: '#5a6fd8' },
                              '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
                              width: 64,
                              height: 64
                            }}
                          >
                            {isPaused ? <PlayArrowIcon fontSize="large" /> : isSpeaking ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Stop">
                          <span>
                            <IconButton
                              onClick={handleStopAudio}
                              disabled={!isSpeaking || isRecording}
                              size="large"
                              sx={{
                                color: isSpeaking && !isRecording ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                backgroundColor: isSpeaking && !isRecording ? 'rgba(244, 67, 54, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                                '&:hover': { backgroundColor: isSpeaking && !isRecording ? 'rgba(244, 67, 54, 0.9)' : 'rgba(255, 255, 255, 0.1)' },
                                width: 56,
                                height: 56
                              }}
                            >
                              <StopIcon fontSize="large" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        
                        <Tooltip title={isFavorite() ? "Remove from favorites" : "Add to favorites"}>
                          <IconButton
                            onClick={handleToggleFavorite}
                            size="large"
                            sx={
                              {
                                color: isFavorite() ? '#f44336' : 'rgba(255, 255, 255, 0.7)',
                                '&:hover': { color: isFavorite() ? '#d32f2f' : '#f44336' },
                                width: 56,
                                height: 56
                              }
                            }
                          >
                            {isFavorite() ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      {/* Record and Download Section */}
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                      }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                          {isRecording ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <GraphicEqIcon sx={{ color: '#f44336', animation: 'pulse 1s infinite' }} />
                              Recording Audio...
                            </Box>
                          ) : downloadUrl ? (
                            'Audio Ready for Download'
                          ) : (
                            'Record & Download Audio'
                          )}
                        </Typography>
                        
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ justifyContent: 'center' }}>
                          {!downloadUrl ? (
                            <Button
                              variant="outlined"
                              onClick={handleRecordAndDownload}
                              disabled={!text.trim() || isRecording || isSpeaking}
                              startIcon={isRecording ? <GraphicEqIcon /> : <MicIcon />}
                              sx={{
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                  borderColor: '#5a6fd8',
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                },
                                '&.Mui-disabled': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'rgba(255, 255, 255, 0.3)'
                                }
                              }}
                            >
                              {isRecording ? 'Recording...' : 'Record Speech'}
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                onClick={downloadAudio}
                                startIcon={<DownloadIcon />}
                                sx={{
                                  backgroundColor: '#4caf50',
                                  color: '#fff',
                                  '&:hover': { backgroundColor: '#45a049' }
                                }}
                              >
                                Download Audio
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={clearRecording}
                                size="small"
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
                            </>
                          )}
                        </Stack>
                        
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 1, 
                          color: 'rgba(255, 255, 255, 0.6)' 
                        }}>
                          {isRecording ? (
                            '🎙️ Recording speech audio for download...'
                          ) : downloadUrl ? (
                            `✅ Audio file ready (${audioBlob?.type.includes('webm') ? 'WebM' : audioBlob?.type.includes('mp4') ? 'MP4' : audioBlob?.type.includes('wav') ? 'WAV' : 'Audio'} format)`
                          ) : (
                            '💡 Allow microphone access, then click "Record Speech" to capture and download the audio'
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Settings Section */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  {/* Settings Card */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SettingsIcon sx={{ color: '#667eea', mr: 1 }} />
                          <Typography variant="h6">Voice Settings</Typography>
                        </Box>
                        
                        <IconButton
                          onClick={() => setShowSettings(!showSettings)}
                          size="small"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      <Collapse in={showSettings}>
                        <Stack spacing={3}>
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: '1.2rem' }} />
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Volume: {Math.round(volume * 100)}%</Typography>
                            </Box>
                            <Slider
                              value={volume}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(e, newValue) => setVolume(newValue as number)}
                              sx={{
                                color: '#667eea',
                                '& .MuiSlider-thumb': { backgroundColor: '#667eea' },
                                '& .MuiSlider-track': { backgroundColor: '#667eea' }
                              }}
                            />
                          </Box>
                          
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              <SpeedIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: '1.2rem' }} />
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Speed: {rate}x</Typography>
                            </Box>
                            <Slider
                              value={rate}
                              min={0.1}
                              max={2}
                              step={0.1}
                              onChange={(e, newValue) => setRate(newValue as number)}
                              sx={{
                                color: '#667eea',
                                '& .MuiSlider-thumb': { backgroundColor: '#667eea' },
                                '& .MuiSlider-track': { backgroundColor: '#667eea' }
                              }}
                            />
                          </Box>
                          
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              <RecordVoiceOverIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1, fontSize: '1.2rem' }} />
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Pitch: {pitch}</Typography>
                            </Box>
                            <Slider
                              value={pitch}
                              min={0.1}
                              max={2}
                              step={0.1}
                              onChange={(e, newValue) => setPitch(newValue as number)}
                              sx={{
                                color: '#667eea',
                                '& .MuiSlider-thumb': { backgroundColor: '#667eea' },
                                '& .MuiSlider-track': { backgroundColor: '#667eea' }
                              }}
                            />
                          </Box>
                        </Stack>
                      </Collapse>
                    </CardContent>
                  </Card>
      
                  {/* Favorites Card */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HistoryIcon sx={{ color: '#667eea', mr: 1 }} />
                          <Typography variant="h6">Favorites</Typography>
                          {favorites.length > 0 && (
                            <Chip 
                              label={favorites.length} 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                color: '#667eea',
                                fontSize: '0.7rem'
                              }} 
                            />
                          )}
                        </Box>
                        
                        <IconButton
                          onClick={() => setShowFavorites(!showFavorites)}
                          size="small"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showFavorites ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      <Collapse in={showFavorites}>
                        {favorites.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 3, opacity: 0.7 }}>
                            <FavoriteIcon sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.3)', mb: 1 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              No favorites saved yet
                            </Typography>
                          </Box>
                        ) : (
                          <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
                            {favorites.map((favorite, index) => (
                              <React.Fragment key={index}>
                                <ListItem 
                                  sx={{ 
                                    px: 0,
                                    py: 1,
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                                  }}
                                  onClick={() => loadFavorite(favorite)}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Avatar sx={{ 
                                      width: 24, 
                                      height: 24, 
                                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                      fontSize: '0.7rem',
                                      color: '#667eea'
                                    }}>
                                      {favorite.language.split('-')[0].toUpperCase()}
                                    </Avatar>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        sx={
                                          {
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }
                                        }
                                      >
                                        {favorite.text.substring(0, 35)}{favorite.text.length > 35 ? '...' : ''}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography 
                                        variant="caption" 
                                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                      >
                                        {favorite.voice}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                                {index < favorites.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </Collapse>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        {voices.length === 0 && (
          <Fade in timeout={1000}>
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2,
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                color: '#ffab00'
              }}
            >
              No text-to-speech voices detected. TTS may not be supported in your browser.
            </Alert>
          </Fade>
        )}
      </Container>
    </Box>
  );
}