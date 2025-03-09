import React, { useState, useEffect } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from "@mui/material";

export default function TextToSpeech() {
  const [text, setText] = useState("Hello, this is built-in TTS!");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const fetchVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = fetchVoices;
    } else {
      fetchVoices();
    }
  }, []);

  const handlePlayAudio = () => {
    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#121212",
        borderRadius: "8px",
      }}
    >
      <TextField
        label="Enter text"
        multiline
        rows={4}
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        sx={{
          backgroundColor: "#1E1E1E",
          borderRadius: "5px",
          input: { color: "#FFFFFF" },
          "& .MuiInputLabel-root": { color: "#B0BEC5" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#666" },
            "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
          },
        }}
      />

      <FormControl fullWidth>
        <InputLabel sx={{ color: "#B0BEC5" }}>Language</InputLabel>
        <Select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          sx={{
            backgroundColor: "#1E1E1E",
            color: "#FFFFFF",
            borderRadius: "5px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
          }}
        >
          <MenuItem value="en-US">English (US)</MenuItem>
          <MenuItem value="en-GB">English (UK)</MenuItem>
          <MenuItem value="es-ES">Spanish</MenuItem>
          <MenuItem value="fr-FR">French</MenuItem>
          <MenuItem value="de-DE">German</MenuItem>
          <MenuItem value="hi-IN">Hindi</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel sx={{ color: "#B0BEC5" }}>Voice</InputLabel>
        <Select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          sx={{
            backgroundColor: "#1E1E1E",
            color: "#FFFFFF",
            borderRadius: "5px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
          }}
        >
          {voices.length > 0 ? (
            voices.map((voice) => (
              <MenuItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No voices available</MenuItem>
          )}
        </Select>
      </FormControl>

      <Button
        onClick={handlePlayAudio}
        sx={{
          textTransform: "none",
          color: "#00A8E8",
          fontSize: "16px",
          "&:hover": { color: "#0086C2" },
        }}
      >
        PLAY AUDIO
      </Button>
    </Box>
  );
}
