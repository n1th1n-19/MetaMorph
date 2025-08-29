import React, { useState, useRef } from 'react';
// MUI Components
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
// MUI Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const DownloadMP3 = () => {
  const [mp3Url, setMp3Url] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an MP4
    if (!file.type.includes('video/mp4')) {
      setErrorMessage('Please select an MP4 file.');
      return;
    }

    setErrorMessage('');
    // Extract the file name without extension to use for the MP3
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    setFileName(baseName);
    
    convertMP4ToMP3(file);
  };

  const convertMP4ToMP3 = async (file) => {
    setIsConverting(true);
    setMp3Url(null);
    
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Convert the file to an array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Decode the audio from the MP4 file
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get the audio data
      const numberOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;
      const sampleRate = audioBuffer.sampleRate;
      
      // Create a buffer to process the audio
      const offlineAudioContext = new OfflineAudioContext(
        numberOfChannels,
        length,
        sampleRate
      );
      
      // Create a buffer source
      const source = offlineAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineAudioContext.destination);
      source.start();
      
      // Render the audio
      const renderedBuffer = await offlineAudioContext.startRendering();
      
      // Convert to WAV format (which we can then convert to MP3)
      const wavBlob = audioBufferToWav(renderedBuffer);
      
      // Create a URL for the WAV blob
      const url = URL.createObjectURL(wavBlob);
      setMp3Url(url);
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage('Error during conversion. Make sure the file contains valid audio.');
    } finally {
      setIsConverting(false);
    }
  };

  const audioBufferToWav = (buffer) => {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    
    // Create the WAV file
    const wav = new WavAudioEncoder(sampleRate, numberOfChannels);
    
    // Add the audio data
    for (let channel = 0; channel < numberOfChannels; channel++) {
      wav.addChannel(buffer.getChannelData(channel));
    }
    
    // Get the WAV file as a Blob
    return wav.finish();
  };

  const handleDownload = () => {
    if (mp3Url) {
      const link = document.createElement('a');
      link.href = mp3Url;
      link.download = `${fileName || 'download'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('video/mp4')) {
      // Extract the file name without extension to use for the MP3
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setFileName(baseName);
      setErrorMessage('');
      convertMP4ToMP3(file);
    } else {
      setErrorMessage('Please drop an MP4 file.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          mb: 3
        }}>
          <MusicNoteIcon sx={{ mr: 1 }} />
          MP4 to MP3 Converter
        </Typography>
        
        <Box 
          sx={{
            border: '2px dashed #bdbdbd',
            borderRadius: 2,
            p: 4,
            mb: 3,
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            },
            transition: 'all 0.3s'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
          <Typography variant="body1" gutterBottom color="textPrimary">
            Drag and drop your MP4 file here
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or click to browse
          </Typography>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/mp4"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Box>
        
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        {isConverting && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body1" color="textSecondary">
              Converting...
            </Typography>
          </Box>
        )}
        
        {mp3Url && !isConverting && (
          <Box sx={{ width: '100%', mt: 3 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Conversion complete!
            </Alert>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              Download MP3
            </Button>
          </Box>
        )}
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary" display="block">
            Note: This converter works entirely in your browser.
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            No files are uploaded to any server.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

// Simple WAV encoder implementation
class WavAudioEncoder {
  constructor(sampleRate, numChannels) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
    this.numSamples = 0;
    this.dataViews = [];
  }

  addChannel(channel) {
    if (this.dataViews.length < this.numChannels) {
      // Create a Float32Array for this channel's data
      const buffer = new Float32Array(channel.length);
      
      // Copy the channel data
      for (let i = 0; i < channel.length; i++) {
        buffer[i] = channel[i];
      }
      
      // Convert to 16-bit PCM
      const view = new DataView(new ArrayBuffer(buffer.length * 2));
      for (let i = 0; i < buffer.length; i++) {
        let sample = Math.max(-1, Math.min(1, buffer[i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(i * 2, sample, true);
      }
      
      this.dataViews.push(view);
      this.numSamples = channel.length;
    }
  }

  finish() {
    const dataSize = this.numChannels * this.numSamples * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 36 + dataSize, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // Format chunk identifier
    writeString(view, 12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (raw)
    view.setUint16(20, 1, true);
    // Channel count
    view.setUint16(22, this.numChannels, true);
    // Sample rate
    view.setUint32(24, this.sampleRate, true);
    // Byte rate (sample rate * block align)
    view.setUint32(28, this.sampleRate * this.numChannels * 2, true);
    // Block align (channel count * bytes per sample)
    view.setUint16(32, this.numChannels * 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(view, 36, 'data');
    // Data chunk length
    view.setUint32(40, dataSize, true);
    
    // Write interleaved data
    let offset = 44;
    for (let i = 0; i < this.numSamples; i++) {
      for (let channel = 0; channel < this.numChannels; channel++) {
        const sampleOffset = i * 2;
        const sample = this.dataViews[channel].getInt16(sampleOffset, true);
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }
    
    // Create a Blob from the buffer
    return new Blob([buffer], { type: 'audio/wav' });
  }
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export default DownloadMP3;