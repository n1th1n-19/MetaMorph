import React, { useState } from "react";
import { nanoid } from "nanoid";
import { TextField, Button, Box, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generateShortUrl = () => {
    if (!originalUrl.startsWith("http")) {
      alert("Enter a valid URL (with http or https).");
      return;
    }
    const uniqueId = nanoid(6); // Generates a 6-character short ID
    const shortLink = `https://morph/${uniqueId}`;
    setShortUrl(shortLink);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
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
        backgroundColor: "#121212",
        borderRadius: "8px",
        color: "#fff",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <Typography variant="h5">URL Shortener</Typography>

      <TextField
        label="Enter URL"
        variant="outlined"
        fullWidth
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
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
        onClick={generateShortUrl}
        sx={{
          backgroundColor: "#00A8E8",
          minWidth: "120px", // Smaller button
          padding: "6px 12px",
          fontSize: "14px",
          "&:hover": { backgroundColor: "#0086C2" },
        }}
      >
        Shorten
      </Button>

      {shortUrl && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">
            <a href={originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#00A8E8" }}>
              {shortUrl}
            </a>
          </Typography>

          <Button
            variant="outlined"
            onClick={copyToClipboard}
            sx={{
              color: "#00A8E8",
              borderColor: "#00A8E8",
              minWidth: "40px",
              padding: "5px",
              "&:hover": { borderColor: "#0086C2", color: "#0086C2" },
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </Button>

          {copied && <Typography variant="caption" sx={{ color: "#66BB6A" }}>Copied!</Typography>}
        </Box>
      )}
    </Box>
  );
}
