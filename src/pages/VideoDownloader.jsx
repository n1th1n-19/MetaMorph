import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress, 
  LinearProgress,
  Snackbar,
  Alert,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  Divider,
  Tooltip,
  IconButton
} from "@mui/material";
import axios from "axios";
import { FileDownload, Info, History, Settings, Delete } from "@mui/icons-material";

// API URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function VideoDownloader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load recent downloads from localStorage on mount
  useEffect(() => {
    const savedDownloads = localStorage.getItem("recentDownloads");
    if (savedDownloads) {
      try {
        setRecentDownloads(JSON.parse(savedDownloads));
      } catch (e) {
        console.error("Failed to parse recent downloads", e);
      }
    }
  }, []);

  // Basic YouTube URL validation
  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  // Fetch video information
  const fetchVideoInfo = async () => {
    // Reset states
    setError("");
    setVideoInfo(null);
    
    // Validate URL client-side
    if (!videoUrl) {
      setError("Please enter a video URL.");
      return;
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setInfoLoading(true);

    try {
      const response = await axios.get(`${API_URL}/info?url=${encodeURIComponent(videoUrl)}`);
      setVideoInfo(response.data);
      
      // Auto-select the highest quality format
      if (response.data.formats.length > 0) {
        setSelectedFormat(response.data.formats[0].formatId);
      }
    } catch (error) {
      console.error("Info fetch error:", error);
      handleApiError(error, "Failed to fetch video information.");
    } finally {
      setInfoLoading(false);
    }
  };

  // Handle URL input change with debounce for auto-fetch
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setVideoUrl(newUrl);
    
    // Clear video info if URL field is cleared
    if (!newUrl) {
      setVideoInfo(null);
    }
  };

  // When URL field loses focus, try to fetch info if it's valid
  const handleUrlBlur = () => {
    if (videoUrl && isValidYouTubeUrl(videoUrl) && !videoInfo) {
      fetchVideoInfo();
    }
  };

  // Handle API errors with proper messages
  const handleApiError = (error, defaultMessage) => {
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 400) {
        setError(error.response.data.error || "Invalid video URL or format.");
      } else if (error.response.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(`Server error: ${error.response.data.error || error.response.status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      setError("No response from server. Please check your connection.");
    } else {
      // Error setting up the request
      setError(`Error: ${error.message || defaultMessage}`);
    }
  };

  // Download video function
  const downloadVideo = async () => {
    // Reset states
    setError("");
    setSuccess(false);
    
    // Validate URL client-side
    if (!videoUrl) {
      setError("Please enter a video URL.");
      return;
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Build the download URL with format if selected
      let downloadUrl = `${API_URL}/download?url=${encodeURIComponent(videoUrl)}`;
      if (selectedFormat) {
        downloadUrl += `&format=${selectedFormat}`;
      }

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      // Check if response is the expected video type
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("video")) {
        throw new Error("Invalid response format. Expected video file.");
      }

      // Create download link
      const blob = new Blob([response.data], { type: contentType });
      const link = document.createElement("a");
      
      // Get filename from Content-Disposition header if available
      let filename = "downloaded-video.mp4";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }
      
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      // Clean up the URL object after download
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      
      setSuccess(true);
      
      // Save to recent downloads
      if (videoInfo) {
        const newDownload = {
          id: videoInfo.id,
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          url: videoUrl,
          downloadedAt: new Date().toISOString(),
        };
        
        const updatedDownloads = [newDownload, ...recentDownloads.slice(0, 4)];
        setRecentDownloads(updatedDownloads);
        localStorage.setItem("recentDownloads", JSON.stringify(updatedDownloads));
      }
    } catch (error) {
      console.error("Download Error:", error);
      handleApiError(error, "Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const clearHistory = () => {
    setRecentDownloads([]);
    localStorage.removeItem("recentDownloads");
    setShowHistory(false);
  };

  const downloadFromHistory = (url) => {
    setVideoUrl(url);
    fetchVideoInfo();
    setShowHistory(false);
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: { xs: "1rem", sm: "2rem" },
        backgroundColor: "#121212",
        borderRadius: "12px",
        color: "#ffffff",
        maxWidth: "800px",
        margin: "2rem auto",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
      }}
    >
      <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="#00A8E8">
          YouTube Downloader
        </Typography>
        
        <Box>
          <Tooltip title="Download History">
            <IconButton 
              onClick={() => setShowHistory(!showHistory)} 
              sx={{ color: showHistory ? "#00A8E8" : "#888" }}
            >
              <History />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {showHistory && recentDownloads.length > 0 && (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" color="#aaa">Recent Downloads</Typography>
            <Button 
              startIcon={<Delete />} 
              onClick={clearHistory}
              size="small"
              sx={{ color: "#888" }}
            >
              Clear
            </Button>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {recentDownloads.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card 
                  sx={{ 
                    display: "flex", 
                    backgroundColor: "#1E1E1E",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { backgroundColor: "#2A2A2A" }
                  }}
                  onClick={() => downloadFromHistory(item.url)}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 56 }}
                    image={item.thumbnail || "/placeholder-thumbnail.jpg"}
                    alt={item.title}
                  />
                  <Box sx={{ p: 1, overflow: "hidden" }}>
                    <Typography noWrap variant="body2" color="#fff">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="#888">
                      {new Date(item.downloadedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ bgcolor: "#333", mb: 2 }} />
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
        <TextField
          label="YouTube URL"
          variant="outlined"
          fullWidth
          value={videoUrl}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          placeholder="https://www.youtube.com/watch?v=..."
          error={Boolean(error && !loading)}
          disabled={loading}
          InputProps={{
            endAdornment: videoUrl && (
              <IconButton
                onClick={fetchVideoInfo}
                disabled={infoLoading || !isValidYouTubeUrl(videoUrl)}
                size="small"
                sx={{ color: infoLoading ? "#888" : "#00A8E8" }}
              >
                {infoLoading ? <CircularProgress size={20} /> : <Info />}
              </IconButton>
            )
          }}
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: "5px",
            input: { color: "#FFFFFF" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#666" },
              "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
            },
            "& .MuiInputLabel-root": {
              color: "#888",
              "&.Mui-focused": {
                color: "#00A8E8"
              }
            }
          }}
        />
      </Box>

      {infoLoading && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress size={30} sx={{ color: "#00A8E8" }} />
        </Box>
      )}

      {videoInfo && (
        <Card sx={{ width: "100%", backgroundColor: "#1E1E1E", color: "#fff" }}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <CardMedia
                component="img"
                image={videoInfo.thumbnail}
                alt={videoInfo.title}
                sx={{ aspectRatio: "16/9", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {videoInfo.title}
                </Typography>
                
                <Typography variant="body2" color="#bbb" sx={{ mt: 1, mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {videoInfo.description || "No description available"}
                </Typography>
                
                <Typography variant="body2" color="#888" sx={{ mb: 2 }}>
                  Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
                </Typography>
                
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel id="format-select-label" sx={{ color: "#888" }}>Quality</InputLabel>
                  <Select
                    labelId="format-select-label"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    label="Quality"
                    sx={{
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
                      "& .MuiSvgIcon-root": { color: "#888" }
                    }}
                  >
                    {videoInfo.formats.map((format) => (
                      <MenuItem key={format.formatId} value={format.formatId}>
                        {format.qualityLabel || format.resolution} - {formatFileSize(format.filesize)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      <Button
        variant="contained"
        onClick={downloadVideo}
        disabled={loading || (!videoInfo && !infoLoading)}
        fullWidth
        size="large"
        startIcon={<FileDownload />}
        sx={{ 
          backgroundColor: "#00A8E8", 
          "&:hover": { backgroundColor: "#0086C2" },
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "bold"
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={24} sx={{ color: "white" }} />
            <Typography>Downloading...</Typography>
          </Box>
        ) : (
          "Download Video"
        )}
      </Button>

      {loading && (
        <Box sx={{ width: "100%", mt: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="white">
              Downloading video...
            </Typography>
            <Typography variant="body2" color="white">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: "5px",
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00A8E8"
              }
            }} 
          />
        </Box>
      )}
      
      <Typography variant="caption" color="#777" textAlign="center" mt={1}>
        Note: This tool is for personal use only. Please respect copyright laws and YouTube's Terms of Service.
      </Typography>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Video downloaded successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}