import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  Snackbar, 
  Alert, 
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Collapse
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import QrCodeIcon from "@mui/icons-material/QrCode";

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [urlHistory, setUrlHistory] = useState(() => {
    const savedHistory = localStorage.getItem("url-shortener-history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  const urlInputRef = useRef(null);
  
  useEffect(() => {
    localStorage.setItem("url-shortener-history", JSON.stringify(urlHistory));
  }, [urlHistory]);
  
  const validateUrl = (url) => {
    if (!url.trim()) {
      return "URL cannot be empty";
    }
    
    try {
      new URL(url);
      return "";
    } catch (error) {
      return "Please enter a valid URL (with http:// or https://)";
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setOriginalUrl(url);
    
    if (!url || validateUrl(url) === "") {
      setUrlError("");
    }
  };

  const generateShortUrl = async () => {
    const error = validateUrl(originalUrl);
    if (error) {
      setUrlError(error);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const shortLink = await response.text();
      
      setShortUrl(shortLink);
      setUrlError("");
      
      const timestamp = new Date().toISOString();
      const newEntry = {
        id: nanoid(),
        originalUrl,
        shortUrl: shortLink,
        createdAt: timestamp,
        clicks: 0
      };
      
      setUrlHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 10)); // Keep last 10 entries
      
      showNotification("URL shortened successfully!", "success");
    } catch (error) {
      console.error("Error generating short URL:", error);
      showNotification("Failed to generate short URL. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (textToCopy = shortUrl) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification("Copied to clipboard!", "success");
    } catch (error) {
      console.error("Failed to copy:", error);
      showNotification("Failed to copy URL", "error");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    generateShortUrl();
  };
  
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  const deleteHistoryItem = (id) => {
    setUrlHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    showNotification("URL removed from history", "info");
  };
  
  const clearHistory = () => {
    setUrlHistory([]);
    showNotification("History cleared", "info");
  };
  
  const trackUrlClick = (id) => {
    setUrlHistory(prevHistory => 
      prevHistory.map(item => 
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
  };
  
  const QRCode = ({ url: _url }) => {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#1E1E1E',
        borderRadius: 1,
        mt: 2
      }}>
        <Typography variant="caption" sx={{ mb: 1, color: '#B0BEC5' }}>
          Scan this QR code
        </Typography>
        
        <svg width="150" height="150" viewBox="0 0 150 150">
          <rect width="150" height="150" fill="#1E1E1E"/>
          <rect x="20" y="20" width="110" height="110" fill="#FFFFFF"/>
          
          <g fill="#000000">
            <rect x="40" y="40" width="10" height="10"/>
            <rect x="50" y="40" width="10" height="10"/>
            <rect x="60" y="40" width="10" height="10"/>
            <rect x="40" y="50" width="10" height="10"/>
            <rect x="60" y="50" width="10" height="10"/>
            <rect x="40" y="60" width="10" height="10"/>
            <rect x="50" y="60" width="10" height="10"/>
            <rect x="60" y="60" width="10" height="10"/>
            
            <rect x="100" y="40" width="10" height="10"/>
            <rect x="90" y="40" width="10" height="10"/>
            <rect x="80" y="40" width="10" height="10"/>
            <rect x="100" y="50" width="10" height="10"/>
            <rect x="80" y="50" width="10" height="10"/>
            <rect x="100" y="60" width="10" height="10"/>
            <rect x="90" y="60" width="10" height="10"/>
            <rect x="80" y="60" width="10" height="10"/>
            
            <rect x="40" y="100" width="10" height="10"/>
            <rect x="50" y="100" width="10" height="10"/>
            <rect x="60" y="100" width="10" height="10"/>
            <rect x="40" y="90" width="10" height="10"/>
            <rect x="60" y="90" width="10" height="10"/>
            <rect x="40" y="80" width="10" height="10"/>
            <rect x="50" y="80" width="10" height="10"/>
            <rect x="60" y="80" width="10" height="10"/>
            
            <rect x="70" y="70" width="10" height="10"/>
            <rect x="80" y="70" width="10" height="10"/>
            <rect x="90" y="90" width="10" height="10"/>
            <rect x="70" y="90" width="10" height="10"/>
          </g>
        </svg>
        
        <Button 
          variant="text" 
          size="small" 
          onClick={() => setShowQRCode(false)}
          sx={{ mt: 1, color: '#00A8E8' }}
        >
          Close
        </Button>
      </Box>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "24px",
        backgroundColor: "#121212",
        borderRadius: "12px",
        color: "#fff",
        maxWidth: "500px",
        margin: "auto",
        position: "relative"
      }}
    >
      <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
        URL Shortener
      </Typography>
      
      <Typography variant="body2" color="#B0BEC5" sx={{ mt: -1 }}>
        Create concise, shareable links in seconds
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Enter URL"
          variant="outlined"
          fullWidth
          value={originalUrl}
          onChange={handleUrlChange}
          error={!!urlError}
          helperText={urlError}
          inputRef={urlInputRef}
          placeholder="https://example.com/very-long-url"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon sx={{ color: "#666" }} />
              </InputAdornment>
            ),
          }}
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
            "& .MuiFormHelperText-root": {
              color: "#f44336" 
            }
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{
              backgroundColor: "#00A8E8",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { backgroundColor: "#0086C2" },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Shorten URL"}
          </Button>
          
          <Tooltip title="View history">
            <IconButton
              onClick={() => setShowHistory(!showHistory)}
              sx={{
                color: "#B0BEC5",
                "&:hover": { color: "#00A8E8" }
              }}
            >
              {showHistory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </form>

      {shortUrl && (
        <Box sx={{ mt: 1 }}>
          <Divider sx={{ my: 2, borderColor: "#333" }} />
          
          <Typography variant="subtitle2" color="#B0BEC5" gutterBottom>
            Your shortened URL:
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              pl: 2,
              backgroundColor: "#1E1E1E",
              borderRadius: "6px",
              borderLeft: "4px solid #00A8E8"
            }}
          >
            <Typography
              component="a"
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackUrlClick(shortUrl)}
              sx={{
                color: "#00A8E8",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
                wordBreak: "break-all"
              }}
            >
              {shortUrl}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Copy to clipboard">
                <IconButton
                  onClick={() => copyToClipboard()}
                  size="small"
                  sx={{
                    color: "#00A8E8",
                    "&:hover": { backgroundColor: "rgba(0, 168, 232, 0.1)" }
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Generate QR code">
                <IconButton
                  onClick={() => setShowQRCode(!showQRCode)}
                  size="small"
                  sx={{
                    color: "#00A8E8",
                    "&:hover": { backgroundColor: "rgba(0, 168, 232, 0.1)" }
                  }}
                >
                  <QrCodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          
          {showQRCode && <QRCode url={shortUrl} />}
          
          <Typography variant="caption" color="#B0BEC5" sx={{ display: "block", mt: 1 }}>
            Original URL: {originalUrl.length > 40 ? originalUrl.substring(0, 40) + "..." : originalUrl}
          </Typography>
        </Box>
      )}

      <Collapse in={showHistory}>
        <Box sx={{ mt: 1 }}>
          <Divider sx={{ my: 2, borderColor: "#333" }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1">
              Recent URLs
            </Typography>
            
            {urlHistory.length > 0 && (
              <Button
                size="small"
                onClick={clearHistory}
                sx={{
                  color: "#f44336",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" }
                }}
              >
                Clear All
              </Button>
            )}
          </Box>
          
          {urlHistory.length === 0 ? (
            <Typography variant="body2" color="#B0BEC5" sx={{ py: 2, textAlign: "center" }}>
              Your shortened URL history will appear here
            </Typography>
          ) : (
            <List sx={{ 
              maxHeight: "250px", 
              overflow: "auto",
              backgroundColor: "#1A1A1A",
              borderRadius: "6px" 
            }}>
              {urlHistory.map(item => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Copy short URL">
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => copyToClipboard(item.shortUrl)}
                          sx={{ color: "#B0BEC5" }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => deleteHistoryItem(item.id)}
                          sx={{ color: "#B0BEC5" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  sx={{
                    py: 1,
                    borderBottom: "1px solid #222",
                    "&:last-child": { borderBottom: "none" }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        component="a" 
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackUrlClick(item.id)}
                        sx={{
                          color: "#00A8E8",
                          textDecoration: "none",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          "&:hover": { textDecoration: "underline" },
                          display: "block",
                          maxWidth: "280px",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {item.shortUrl}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="#777" sx={{ fontSize: "0.75rem" }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`${item.clicks} ${item.clicks === 1 ? 'click' : 'clicks'}`}
                          size="small"
                          sx={{
                            height: "18px",
                            fontSize: "0.65rem",
                            backgroundColor: "#333",
                            color: "#B0BEC5"
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>

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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}