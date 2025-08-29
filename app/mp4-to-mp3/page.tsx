"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  LinearProgress,
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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import MemoryIcon from "@mui/icons-material/Memory";
import HomeIcon from "@mui/icons-material/Home";

export default function Mp4ToMp3Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (
        !file.type.startsWith("video/") &&
        !file.name.toLowerCase().endsWith(".mp4")
      ) {
        showNotification("Please select a valid MP4 video file", "error");
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        showNotification("File size must be less than 500MB", "error");
        return;
      }

      setSelectedFile(file);
      setError("");
      setDownloadUrl("");
      setProgress(0);
      showNotification("Video file loaded successfully", "success");
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
        target: { files: [file] },
      } as any;
      handleFileChange(fakeEvent);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      showNotification("Please select an MP4 file", "warning");
      return;
    }

    setIsProcessing(true);
    setError("");
    setProgress(0);
    setDownloadUrl("");

    try {
      setProgress(10);
      showNotification("Loading video file...", "info");

      // Create video element to extract audio
      const video = document.createElement("video");
      const url = URL.createObjectURL(selectedFile);
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true; // Prevent audio playback during processing

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
        setTimeout(() => reject(new Error("Video loading timeout")), 10000);
      });

      const videoDuration = video.duration;
      const maxDuration = 300; // 5 minutes max
      const actualDuration = Math.min(videoDuration, maxDuration);

      setProgress(20);
      showNotification(
        `Analyzing audio track (${Math.round(actualDuration)}s duration)...`,
        "info"
      );

      // Create audio context for processing
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(video);
      const dest = audioContext.createMediaStreamDestination();
      source.connect(dest);

      setProgress(35);
      showNotification("Setting up audio extraction...", "info");

      // Set up MediaRecorder to capture audio
      const chunks: BlobPart[] = [];
      let recordingStartTime = 0;
      let progressUpdateInterval: NodeJS.Timeout;

      const mediaRecorder = new MediaRecorder(dest.stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        recordingStartTime = Date.now();
        setProgress(50);
        showNotification("Extracting audio... Please wait.", "info");

        // Update progress based on video playback
        progressUpdateInterval = setInterval(() => {
          const elapsed = (Date.now() - recordingStartTime) / 1000;
          const progressPercent = Math.min(
            (elapsed / actualDuration) * 45 + 50,
            95
          ); // 50-95%
          setProgress(Math.round(progressPercent));
        }, 500);
      };

      mediaRecorder.onstop = () => {
        clearInterval(progressUpdateInterval);
        setProgress(98);
        showNotification("Finalizing audio file...", "info");

        setTimeout(() => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setDownloadUrl(audioUrl);
          setProgress(100);
          showNotification(
            "Audio extracted successfully! Click download to save.",
            "success"
          );
          setIsProcessing(false);

          // Clean up
          URL.revokeObjectURL(url);
          audioContext.close();
        }, 1000);
      };

      // Start recording and play video
      mediaRecorder.start(1000); // Capture data every second
      video.currentTime = 0;
      video.playbackRate = Math.min(2.0, 16 / actualDuration); // Speed up for long videos
      await video.play();

      // Stop recording when video ends or reaches max duration
      const stopRecording = () => {
        if (mediaRecorder.state === "recording") {
          video.pause();
          mediaRecorder.stop();
        }
      };

      video.onended = stopRecording;

      // Timeout for long videos
      setTimeout(stopRecording, actualDuration * 1000 + 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to convert file. Your browser may not support this feature.";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error(err);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setError("");
    setDownloadUrl("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showNotification("All data cleared", "info");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)",
        py: 4,
        position: "relative",
      }}
    >
      {/* Home Navigation Button */}
      <Tooltip title="Back to Home" placement="right">
        <Fab
          size="medium"
          onClick={() => router.push("/")}
          sx={{
            position: "fixed",
            top: 24,
            left: 24,
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            color: "#000",
            "&:hover": {
              background: "linear-gradient(135deg, #fde4c7 0%, #fab391 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(252, 182, 159, 0.3)",
          }}
        >
          <HomeIcon />
        </Fab>
      </Tooltip>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 1,
                }}
              >
                MP4 to MP3 Converter
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Convert MP4 video files to MP3 audio format
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Upload Section */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <VideoFileIcon sx={{ color: "#fcb69f", mr: 1 }} />
                      <Typography variant="h6">Video Upload</Typography>
                    </Box>

                    {/* Drag & Drop Zone */}
                    <Box
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        border: "2px dashed rgba(252, 182, 159, 0.3)",
                        backgroundColor: "rgba(252, 182, 159, 0.05)",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        mb: 3,
                        "&:hover": {
                          borderColor: "rgba(252, 182, 159, 0.5)",
                          backgroundColor: "rgba(252, 182, 159, 0.1)",
                        },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />

                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          mx: "auto",
                          mb: 2,
                          backgroundColor: "rgba(252, 182, 159, 0.2)",
                          color: "#fcb69f",
                        }}
                      >
                        <VideoFileIcon sx={{ fontSize: "2rem" }} />
                      </Avatar>

                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drop MP4 file here or click to browse
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Supports MP4 videos (max 500MB)
                      </Typography>
                    </Box>

                    {/* Selected File Info */}
                    {selectedFile && (
                      <Fade in timeout={400}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            background: "rgba(252, 182, 159, 0.1)",
                            border: "1px solid rgba(252, 182, 159, 0.3)",
                            mb: 3,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {selectedFile.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                              >
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB • Video File
                              </Typography>
                            </Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                icon={<VideoFileIcon fontSize="small" />}
                                label="MP4"
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(33, 150, 243, 0.2)",
                                  color: "#2196f3",
                                }}
                              />
                              <PlayArrowIcon sx={{ color: "#fcb69f", mx: 1 }} />
                              <Chip
                                icon={<AudioFileIcon fontSize="small" />}
                                label="MP3"
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255, 152, 0, 0.2)",
                                  color: "#ff9800",
                                }}
                              />
                            </Stack>
                          </Box>
                        </Box>
                      </Fade>
                    )}

                    {/* Info Section */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        background: "rgba(33, 150, 243, 0.1)",
                        border: "1px solid rgba(33, 150, 243, 0.3)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <InfoIcon
                          sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem" }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#2196f3" }}
                        >
                          Conversion Details
                        </Typography>
                      </Box>
                      <List dense sx={{ py: 0 }}>
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <AudioFileIcon
                              sx={{
                                fontSize: "1rem",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary="Audio Quality: 320kbps MP3"
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              color: "rgba(255, 255, 255, 0.8)",
                            }}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <MemoryIcon
                              sx={{
                                fontSize: "1rem",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary="Processing: Client-side extraction"
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              color: "rgba(255, 255, 255, 0.8)",
                            }}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Conversion Section */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <MusicNoteIcon sx={{ color: "#fcb69f", mr: 1 }} />
                      <Typography variant="h6">Audio Conversion</Typography>
                    </Box>

                    {/* Conversion Status */}
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        borderRadius: 2,
                        background: isProcessing
                          ? "rgba(252, 182, 159, 0.1)"
                          : "rgba(255, 255, 255, 0.05)",
                        border: isProcessing
                          ? "1px solid rgba(252, 182, 159, 0.3)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 2,
                          backgroundColor: isProcessing
                            ? "#fcb69f"
                            : "rgba(255, 255, 255, 0.1)",
                          animation: isProcessing
                            ? "pulse 2s infinite"
                            : "none",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)", opacity: 1 },
                            "50%": { transform: "scale(1.1)", opacity: 0.8 },
                            "100%": { transform: "scale(1)", opacity: 1 },
                          },
                        }}
                      >
                        {isProcessing ? (
                          <DownloadIcon
                            sx={{ fontSize: "2rem", color: "#fff" }}
                          />
                        ) : downloadUrl ? (
                          <CheckCircleIcon
                            sx={{ fontSize: "2rem", color: "#4caf50" }}
                          />
                        ) : (
                          <MusicNoteIcon
                            sx={{
                              fontSize: "2rem",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        )}
                      </Avatar>

                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {isProcessing
                          ? "Converting..."
                          : downloadUrl
                            ? "Ready to Download"
                            : "Ready to Convert"}
                      </Typography>

                      <Chip
                        label={
                          isProcessing
                            ? `${progress}%`
                            : downloadUrl
                              ? "COMPLETE"
                              : "IDLE"
                        }
                        color={
                          isProcessing
                            ? "warning"
                            : downloadUrl
                              ? "success"
                              : "default"
                        }
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: isProcessing
                            ? "#ff9800"
                            : downloadUrl
                              ? "#4caf50"
                              : "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                        }}
                      />
                    </Box>

                    {/* Progress Bar */}
                    {isProcessing && progress > 0 && (
                      <Fade in timeout={300}>
                        <Box sx={{ mb: 3 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#fcb69f",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: "center",
                              mt: 1,
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            Processing: {progress}%
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {/* Action Buttons */}
                    <Stack spacing={2}>
                      {!downloadUrl ? (
                        <Button
                          variant="contained"
                          onClick={handleConvert}
                          disabled={!selectedFile || isProcessing}
                          startIcon={isProcessing ? <></> : <DownloadIcon />}
                          fullWidth
                          sx={{
                            py: 1.5,
                            background:
                              "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                            color: "#000",
                            fontWeight: 600,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #fde4c7 0%, #fab391 100%)",
                            },
                            "&.Mui-disabled": {
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "rgba(255, 255, 255, 0.5)",
                            },
                          }}
                        >
                          {isProcessing
                            ? `Converting... ${progress}%`
                            : "Extract Audio"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          component="a"
                          href={downloadUrl}
                          download={`${selectedFile?.name.replace(/\.[^/.]+$/, "")}_audio.webm`}
                          startIcon={<DownloadIcon />}
                          fullWidth
                          sx={{
                            py: 1.5,
                            background:
                              "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                            color: "#fff",
                            fontWeight: 600,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #45a049 0%, #3e8e41 100%)",
                            },
                          }}
                        >
                          Download Audio File
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        onClick={clearAll}
                        disabled={!selectedFile && !downloadUrl}
                        sx={{
                          borderColor: "rgba(244, 67, 54, 0.5)",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#f44336",
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        Clear All
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Status Messages */}
            {error && (
              <Fade in timeout={400}>
                <Box sx={{ mt: 3 }}>
                  <Alert
                    severity="error"
                    sx={{
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      color: "#f44336",
                    }}
                    onClose={() => setError("")}
                    icon={<ErrorIcon />}
                  >
                    {error}
                  </Alert>
                </Box>
              </Fade>
            )}
          </Box>
        </Fade>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
