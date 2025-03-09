import React, { useState } from "react";
import { Button, Box, Typography, TextField, CircularProgress } from "@mui/material";
import Tesseract from "tesseract.js";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Copy Icon

export default function OCRExtractor() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText(""); // Reset extracted text
    }
  };

  // Perform OCR with `eng` (Fixed Model)
  const extractText = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m), // Logs OCR progress
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-()[]",
        oem: 1, // LSTM OCR Engine
        psm: 3, // Auto-detect blocks of text
      });

      setText(data.text.trim());
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to extract text. Try another image.");
    }

    setLoading(false);
  };

  // Copy to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "20px",
        borderRadius: "8px",
        color: "#ffffff",
        maxWidth: "550px",
        margin: "auto",
      }}
    >
      <Typography variant="h5">OCR - Extract Text from Image</Typography>

      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="upload-input" />
      <label htmlFor="upload-input">
        <Button variant="contained" component="span" sx={{ backgroundColor: "#00A8E8", "&:hover": { backgroundColor: "#0086C2" } }}>
          Upload Image
        </Button>
      </label>

      {image && <img src={image} alt="Uploaded preview" style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }} />}

      <Button
        variant="contained"
        onClick={extractText}
        disabled={!image || loading}
        sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Extract Text"}
      </Button>

      {text && (
        <>
          <TextField
            multiline
            rows={10} // **Increased rows for better readability**
            variant="outlined"
            fullWidth
            value={text}
            disabled
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
            onClick={copyToClipboard}
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#1976D2" },
            }}
            startIcon={<ContentCopyIcon />}
          >
            {copied ? "Copied!" : "Copy Text"}
          </Button>
        </>
      )}
    </Box>
  );
}
