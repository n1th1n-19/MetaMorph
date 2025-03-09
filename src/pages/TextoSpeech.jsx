import React, { useState, useEffect } from "react";
import { useSpeech } from "react-text-to-speech";
import { TextField, Button, Box } from "@mui/material";

export default function TextoSpeech() {
  const [userText, setUserText] = useState("Enter your text");
  const {
    Text,
    speechStatus,
    start,
    pause,
    stop,
  } = useSpeech({ text: userText });

  const handleDownload = async () => {
    const utterance = new SpeechSynthesisUtterance(userText);
    const synth = window.speechSynthesis;

    // Create audio context and destination
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks = [];

    // Create an audio element to capture the speech output
    const audio = new Audio();
    audio.srcObject = destination.stream;
    audio.play();

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "speech.wav";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    mediaRecorder.start();
    synth.speak(utterance);

    // Stop recording when speech ends
    utterance.onend = () => {
      mediaRecorder.stop();
    };
  };

  return (
    <Box className="speech-container">
      <TextField
        label="Enter text"
        multiline
        rows={4}
        variant="outlined"
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        fullWidth
        className="speech-input"
        sx={{
          color: "white",
          input: { color: "white" },
        }}
      />
      <Text className="speech-text" />
      <Box className="speech-buttons">
        {speechStatus !== "started" ? (
          <Button className="speech-button start" onClick={start}>
            Start
          </Button>
        ) : (
          <Button className="speech-button pause" onClick={pause}>
            Pause
          </Button>
        )}
        <Button className="speech-button stop" onClick={stop}>
          Stop
        </Button>
        <Button className="speech-button download" onClick={handleDownload}>
          Download Audio
        </Button>
      </Box>
    </Box>
  );
}
