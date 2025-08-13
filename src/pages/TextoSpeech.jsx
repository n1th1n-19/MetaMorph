import { useState, useEffect, useRef } from "react";
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
  Paper
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function TextToSpeech() {
  const [text, setText] = useState("Hello, this is built-in TTS!");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("tts-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  const utteranceRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  
  useEffect(() => {
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
    localStorage.setItem("tts-favorites", JSON.stringify(favorites));
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
  
  const handlePauseAudio = () => {
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
  
  const loadFavorite = (favorite) => {
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
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
        padding: "24px",
        backgroundColor: "#121212",
        borderRadius: "12px",
      }}
    >
      <Typography variant="h5" component="h1" sx={{ color: "#FFFFFF", mb: 2 }}>
        Text to Speech
      </Typography>
      
      <TextField
        label="Enter text"
        multiline
        rows={4}
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        placeholder="Type or paste the text you want to hear..."
        aria-label="Text to convert to speech"
        sx={{
          backgroundColor: "#1E1E1E",
          borderRadius: "5px",
          "& .MuiInputBase-input": { color: "#FFFFFF" },
          "& .MuiInputLabel-root": { color: "#B0BEC5" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#666" },
            "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: "48%", flexGrow: 1 }}>
          <InputLabel sx={{ color: "#B0BEC5" }}>Language</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            aria-label="Select language"
            sx={{
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              borderRadius: "5px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
            }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ color: "#B0BEC5" }}>
            Select language for speech
          </FormHelperText>
        </FormControl>

        <FormControl sx={{ minWidth: "48%", flexGrow: 1 }}>
          <InputLabel sx={{ color: "#B0BEC5" }}>Voice</InputLabel>
          <Select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            aria-label="Select voice"
            sx={{
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              borderRadius: "5px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
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
          <FormHelperText sx={{ color: "#B0BEC5" }}>
            {filteredVoices.length} voice{filteredVoices.length !== 1 ? 's' : ''} available
          </FormHelperText>
        </FormControl>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ color: "#FFFFFF", mb: 1 }}>
          Advanced Controls
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <VolumeUpIcon sx={{ color: "#B0BEC5", mr: 1 }} />
          <Typography sx={{ color: "#B0BEC5", width: "60px" }}>Volume:</Typography>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={(_e, newValue) => setVolume(newValue)}
            aria-label="Volume"
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${Math.round(value * 100)}%`}
            sx={{
              color: "#00A8E8",
              '& .MuiSlider-thumb': {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SpeedIcon sx={{ color: "#B0BEC5", mr: 1 }} />
          <Typography sx={{ color: "#B0BEC5", width: "60px" }}>Speed:</Typography>
          <Slider
            value={rate}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(_e, newValue) => setRate(newValue)}
            aria-label="Speech rate"
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${value}x`}
            sx={{
              color: "#00A8E8",
              '& .MuiSlider-thumb': {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ color: "#B0BEC5", width: "60px", ml: 4 }}>Pitch:</Typography>
          <Slider
            value={pitch}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(_e, newValue) => setPitch(newValue)}
            aria-label="Speech pitch"
            valueLabelDisplay="auto"
            sx={{
              color: "#00A8E8",
              '& .MuiSlider-thumb': {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Play"}>
            <IconButton
              onClick={isPaused ? handlePlayAudio : isSpeaking ? handlePauseAudio : handlePlayAudio}
              aria-label={isPaused ? "Resume speech" : isSpeaking ? "Pause speech" : "Play speech"}
              sx={{
                color: "#00A8E8",
                backgroundColor: "#1E1E1E",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              {isPaused ? <PlayArrowIcon /> : isSpeaking ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Stop">
            <span>
              <IconButton
                onClick={handleStopAudio}
                disabled={!isSpeaking}
                aria-label="Stop speech"
                sx={{
                  color: isSpeaking ? "#00A8E8" : "#555",
                  backgroundColor: "#1E1E1E",
                  "&:hover": { backgroundColor: isSpeaking ? "#333" : "#1E1E1E" },
                }}
              >
                <StopIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        
        <Tooltip title={isFavorite() ? "Remove from favorites" : "Add to favorites"}>
          <IconButton
            onClick={handleToggleFavorite}
            aria-label={isFavorite() ? "Remove from favorites" : "Add to favorites"}
            sx={{
              color: isFavorite() ? "#f44336" : "#B0BEC5",
              "&:hover": { color: isFavorite() ? "#d32f2f" : "#f44336" },
            }}
          >
            {isFavorite() ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {favorites.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "#FFFFFF", mb: 1 }}>
            Favorites ({favorites.length})
          </Typography>
          <Box sx={{ maxHeight: "150px", overflowY: "auto", pr: 1 }}>
            {favorites.map((favorite, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#1E1E1E",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#2A2A2A" },
                }}
                onClick={() => loadFavorite(favorite)}
              >
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "calc(100% - 40px)",
                  }}
                >
                  {favorite.text.substring(0, 40)}{favorite.text.length > 40 ? "..." : ""}
                </Typography>
                <Typography variant="caption" sx={{ color: "#B0BEC5", fontSize: "12px" }}>
                  {favorite.language.split("-")[0]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {voices.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No text-to-speech voices detected. TTS may not be supported in your browser.
        </Alert>
      )}
    </Paper>
  );
}