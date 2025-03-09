import React, { useState } from "react";
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function FileFormatConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("txt");
  const [convertedData, setConvertedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const fileExt = file.name.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;

      try {
        if (fileExt === "xlsx" || fileExt === "xls") {
          // Convert Excel to CSV or JSON
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (format === "csv") {
            setConvertedData(XLSX.utils.sheet_to_csv(sheet));
          } else if (format === "json") {
            setConvertedData(JSON.stringify(XLSX.utils.sheet_to_json(sheet), null, 2));
          }
        } else if (fileExt === "docx") {
          // Convert DOCX to TXT
          if (format === "txt") {
            const result = await mammoth.extractRawText({ arrayBuffer: data });
            setConvertedData(result.value);
          }
        } else if (fileExt === "pdf" && format === "txt") {
          // Convert PDF to Text
          const pdfDoc = await PDFDocument.load(data);
          let extractedText = "";

          for (const page of pdfDoc.getPages()) {
            extractedText += page.getTextContent().items.map((item) => item.str).join(" ") + "\n";
          }

          setConvertedData(extractedText);
        } else {
          alert("Unsupported conversion.");
        }
      } catch (error) {
        alert("Error during conversion: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (!convertedData) {
      alert("No converted file available. Convert first.");
      return;
    }

    const blob = new Blob([convertedData], { type: "text/plain" });
    saveAs(blob, `${fileName.split(".")[0]}.${format}`);
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
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" sx={{ color: "#E0E0E0", fontSize: "25px" }}>
        File Converter
      </Typography>

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: "100%",
          padding: "20px",
          border: "2px dashed #00A8E8",
          borderRadius: "8px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragActive ? "#1E1E1E" : "transparent",
          color: "#00A8E8",
          fontSize: "14px",
        }}
      >
        Drag & Drop your file here or{" "}
        <label htmlFor="file-upload" style={{ color: "#00A8E8", cursor: "pointer", fontWeight: "bold" }}>
          browse
        </label>
        <input type="file" id="file-upload" accept=".docx,.xls,.xlsx,.pdf,.csv,.json,.txt" onChange={handleFileChange} style={{ display: "none" }} />
      </Box>

      <TextField
        label="Selected File"
        variant="outlined"
        value={fileName || "No file selected"}
        fullWidth
        disabled
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
        <InputLabel sx={{ color: "#B0BEC5" }}>Convert to</InputLabel>
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          sx={{
            backgroundColor: "#1E1E1E",
            color: "#FFFFFF",
            borderRadius: "5px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
          }}
        >
          <MenuItem value="txt">Text (TXT)</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="docx">DOCX</MenuItem>
          <MenuItem value="xlsx">XLSX</MenuItem>
        </Select>
      </FormControl>

      <Button
        onClick={handleConvert}
        sx={{
          textTransform: "none",
          backgroundColor: "#28a745",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#218838" },
          width: "100%",
        }}
      >
        Convert File
      </Button>

      {convertedData && (
        <Button
          onClick={handleDownload}
          sx={{
            textTransform: "none",
            backgroundColor: "#FF5722",
            color: "#FFFFFF",
            "&:hover": { backgroundColor: "#E64A19" },
            width: "100%",
          }}
        >
          Download File
        </Button>
      )}
    </Box>
  );
}
