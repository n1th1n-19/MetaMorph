import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function TextToSpeech() {
  const [text, setText] = useState("Hello, this is built-in TTS!");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en-US");

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices.find((v) => v.lang === "en-US") || availableVoices[0]); // Default to English
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handlePlayAudio = () => {
    if (!text) {
      alert("Enter text first!");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = selectedLang;
    speech.voice = selectedVoice;

    window.speechSynthesis.speak(speech);
  };

  return (
    <Box className="speech-container">
      <TextField
        label="Enter text"
        multiline
        rows={4}
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
      />

      {/* Language Selection */}
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
          <MenuItem value="en-US">English (US)</MenuItem>
          <MenuItem value="hi-IN">Hindi</MenuItem>
          <MenuItem value="es-ES">Spanish</MenuItem>
          <MenuItem value="fr-FR">French</MenuItem>
          <MenuItem value="de-DE">German</MenuItem>
        </Select>
      </FormControl>

      {/* Voice Selection */}
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Voice</InputLabel>
        <Select value={selectedVoice?.name || ""} onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
          {voices
            .filter(voice => voice.lang === selectedLang) // Filter voices by selected language
            .map((voice, index) => (
              <MenuItem key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Box className="speech-buttons" sx={{ marginTop: 2 }}>
        <Button onClick={handlePlayAudio}>Play Audio</Button>
      </Box>
    </Box>
  );
}
