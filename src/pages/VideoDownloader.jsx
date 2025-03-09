import React, { useState } from "react";
import { Button, TextField, Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import axios from "axios";

export default function VideoDownloader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress Bar State

  const downloadVideo = async () => {
    if (!videoUrl) {
      alert("Enter a valid video URL.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.get(`http://localhost:5000/download?url=${encodeURIComponent(videoUrl)}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      const blob = new Blob([response.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downloaded-video.mp4";
      link.click();
    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to download video.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "20px",
        backgroundColor: "#121212",
        borderRadius: "8px",
        color: "#ffffff",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Typography variant="h5">Video Downloader</Typography>

      <TextField
        label="Enter Video URL"
        variant="outlined"
        fullWidth
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        sx={{
          backgroundColor: "#1E1E1E",
          borderRadius: "5px",
          input: { color: "#FFFFFF" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#444" },
            "&:hover fieldset": { borderColor: "#666" },
            "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={downloadVideo}
        disabled={loading}
        sx={{ backgroundColor: "#00A8E8", "&:hover": { backgroundColor: "#0086C2" } }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Download Video"}
      </Button>

      {loading && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="body2" color="white">
            Downloading... {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: "5px" }} />
        </Box>
      )}
    </Box>
  );
}
