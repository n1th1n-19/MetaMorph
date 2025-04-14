import React, { useState, useRef } from "react";
import { Button, Box, Typography, TextField, CircularProgress, Alert, Snackbar, IconButton, Stack, Paper } from "@mui/material";
import Tesseract from "tesseract.js";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function OCRExtractor() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [language, setLanguage] = useState("eng");
  const [ocrMode, setOcrMode] = useState(1);
  const [pageSegMode, setPageSegMode] = useState(3); 
  
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Please upload an image smaller than 10MB.");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file.");
        return;
      }

      setImage(URL.createObjectURL(file));
      setText("");
      setError(null);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setImage(null);
    setText("");
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const extractText = async () => {
    if (!image) {
      setError("Please upload an image first!");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const { data } = await Tesseract.recognize(
        image,
        language,
        {
          logger: m => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
          oem: ocrMode, 
          psm: pageSegMode,
        }
      );

      if (data.text.trim()) {
        setText(data.text.trim());
      } else {
        setError("No text could be extracted from this image. Try adjusting settings or using a clearer image.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setError("Failed to extract text. Please try another image or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setSnackbarOpen(true);
          if (textAreaRef.current) {
            textAreaRef.current.focus();
          }
        })
        .catch(() => {
          setError("Failed to copy text. Please try manually selecting and copying.");
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: "auto", bgcolor: "#121212" }}>
      <Stack spacing={3}>
        <Typography variant="h5" align="center" gutterBottom>
          OCR - Extract Text from Image
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
            ref={fileInputRef}
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<ImageIcon />}
              sx={{ bgcolor: "#00A8E8", "&:hover": { bgcolor: "#0086C2" } }}
            >
              Upload Image
            </Button>
          </label>

          {image && (
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<DeleteIcon />}
              sx={{ borderColor: "#ff5252", color: "#ff5252", "&:hover": { borderColor: "#ff1744", bgcolor: "rgba(255,82,82,0.08)" } }}
            >
              Clear
            </Button>
          )}
        </Stack>

        {image && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Box
              component="img"
              src={image}
              alt="Uploaded preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "250px",
                borderRadius: "8px",
                objectFit: "contain",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}
            />
          </Box>
        )}

        <Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<SettingsIcon />}
            endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ mb: 2, bgcolor: "#555", "&:hover": { bgcolor: "#777" } }}
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
          </Button>

          {showAdvanced && (
            <Stack spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Language:
                </Typography>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #555"
                  }}
                >
                  <option value="eng">English</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="spa">Spanish</option>
                  <option value="ita">Italian</option>
                  <option value="jpn">Japanese</option>
                  <option value="kor">Korean</option>
                  <option value="chi_sim">Chinese (Simplified)</option>
                  <option value="chi_tra">Chinese (Traditional)</option>
                  <option value="rus">Russian</option>
                  <option value="ara">Arabic</option>
                </select>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  OCR Engine Mode:
                </Typography>
                <select
                  value={ocrMode}
                  onChange={(e) => setOcrMode(Number(e.target.value))}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #555"
                  }}
                >
                  <option value="0">Legacy Engine Only</option>
                  <option value="1">Neural nets LSTM Engine only</option>
                  <option value="2">Legacy + LSTM engines</option>
                  <option value="3">Default, based on what is available</option>
                </select>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Page Segmentation Mode:
                </Typography>
                <select
                  value={pageSegMode}
                  onChange={(e) => setPageSegMode(Number(e.target.value))}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #555"
                  }}
                >
                  <option value="3">Auto-detect blocks of text (Default)</option>
                  <option value="4">Single column of text</option>
                  <option value="6">Single uniform block of text</option>
                  <option value="7">Single text line</option>
                  <option value="11">Sparse text with no orientation</option>
                  <option value="13">Raw line. Treat the image as a single text line</option>
                </select>
              </Box>
            </Stack>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={extractText}
          disabled={!image || loading}
          sx={{
            bgcolor: "#4CAF50",
            "&:hover": { bgcolor: "#388E3C" },
            height: "48px"
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
              Processing... {progress}%
            </>
          ) : (
            "Extract Text"
          )}
        </Button>

        {text && (
          <>
            <TextField
              multiline
              rows={10}
              variant="outlined"
              fullWidth
              value={text}
              inputRef={textAreaRef}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                bgcolor: "#1E1E1E",
                borderRadius: "5px",
                "& .MuiInputBase-input": { color: "#FFFFFF" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
                },
              }}
            />

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={copyToClipboard}
                startIcon={<ContentCopyIcon />}
                sx={{
                  bgcolor: "#2196F3",
                  "&:hover": { bgcolor: "#1976D2" },
                }}
              >
                Copy Text
              </Button>
            </Stack>
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          message="Text copied to clipboard!"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Stack>
    </Paper>
  );
}