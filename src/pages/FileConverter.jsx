import { useState, useEffect } from "react";
import { 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography, 
  TextField,
  Paper,
  Alert,
  Snackbar,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
  Grid,
  CircularProgress
} from "@mui/material";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { 
  CloudUpload, 
  Download, 
  FilePresent, 
  Refresh,
  Info,
  SwapHoriz
} from "@mui/icons-material";

export default function FileFormatConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("txt");
  const [convertedData, setConvertedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [availableFormats, setAvailableFormats] = useState([]);

  const formatDefinitions = {
    xlsx: { name: "Excel Workbook", targets: ["csv", "json", "txt"] },
    xls: { name: "Excel 97-2003 Workbook", targets: ["csv", "json", "txt"] },
    csv: { name: "CSV File", targets: ["xlsx", "json", "txt"] },
    docx: { name: "Word Document", targets: ["txt", "pdf"] },
    pdf: { name: "PDF Document", targets: ["txt"] },
    json: { name: "JSON File", targets: ["csv", "xlsx", "txt"] },
    txt: { name: "Text File", targets: ["pdf", "docx"] }
  };

  useEffect(() => {
    if (file) {
      const fileExt = file.name.split(".").pop().toLowerCase();
      if (formatDefinitions[fileExt]) {
        const targetFormats = formatDefinitions[fileExt].targets;
        setAvailableFormats(targetFormats);
        
        if (!targetFormats.includes(format)) {
          setFormat(targetFormats[0]);
        }
      } else {
        setError("Unsupported file format. Please try another file.");
        setAvailableFormats([]);
      }
    } else {
      setAvailableFormats([]);
    }
  }, [file, format]);

  const clearFile = () => {
    setFile(null);
    setFileName("");
    setConvertedData(null);
    setError("");
  };

  const getFileIcon = (extension) => {
    return <FilePresent />;
  };

  const handleFileChange = (event) => {
    setError("");
    setConvertedData(null);
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 15 * 1024 * 1024) { 
        setError("File is too large. Maximum size is 15MB.");
        return;
      }
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
    setError("");
    setConvertedData(null);
    
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 15 * 1024 * 1024) { 
        setError("File is too large. Maximum size is 15MB.");
        return;
      }
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!formatDefinitions[fileExt]?.targets.includes(format)) {
      setError(`Cannot convert ${fileExt} to ${format} format.`);
      return;
    }

    setIsConverting(true);
    setConvertedData(null);
    setError("");
    
    const stopProgress = simulateProgress();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;

      try {
        if (fileExt === "xlsx" || fileExt === "xls") {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (format === "csv") {
            setConvertedData(XLSX.utils.sheet_to_csv(sheet));
          } else if (format === "json") {
            setConvertedData(JSON.stringify(XLSX.utils.sheet_to_json(sheet), null, 2));
          } else if (format === "txt") {
            setConvertedData(XLSX.utils.sheet_to_txt(sheet));
          }
        } 
        else if (fileExt === "csv") {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (format === "json") {
            setConvertedData(JSON.stringify(XLSX.utils.sheet_to_json(sheet), null, 2));
          } else if (format === "xlsx") {
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, sheet, "Sheet1");
            const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName.split(".")[0]}.xlsx`);
            setConvertedData("Excel file prepared for download");
          } else if (format === "txt") {
            setConvertedData(XLSX.utils.sheet_to_txt(sheet));
          }
        }
        else if (fileExt === "json") {
          const jsonData = JSON.parse(data);
          
          if (format === "csv") {
            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            setConvertedData(XLSX.utils.sheet_to_csv(worksheet));
          } else if (format === "xlsx") {
            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");
            const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName.split(".")[0]}.xlsx`);
            setConvertedData("Excel file prepared for download");
          } else if (format === "txt") {
            setConvertedData(JSON.stringify(jsonData, null, 2));
          }
        }
        else if (fileExt === "docx") {
          if (format === "txt") {
            const result = await mammoth.extractRawText({ arrayBuffer: data });
            setConvertedData(result.value);
          } else if (format === "pdf") {
            setError("Direct DOCX to PDF conversion isn't fully supported yet.");
          }
        } 
        else if (fileExt === "pdf" && format === "txt") {
          try {
            const pdfDoc = await PDFDocument.load(data);
            const pageCount = pdfDoc.getPageCount();
            let extractedText = "";
            
            for (let i = 0; i < pageCount; i++) {
              extractedText += `[Content from page ${i+1}]\n\n`;
            }
            
            setConvertedData(extractedText || "PDF text extraction is limited. Try another tool for better results.");
          } catch (pdfError) {
            throw new Error(`PDF processing error: ${pdfError.message}`);
          }
        } 
        else if (fileExt === "txt") {
          const textContent = new TextDecoder().decode(new Uint8Array(data));
          
          if (format === "docx" || format === "pdf") {
            setError(`Direct TXT to ${format.toUpperCase()} conversion isn't fully supported yet.`);
          }
        } 
        else {
          throw new Error("Unsupported conversion.");
        }
        
        setProgress(100);
        setSuccess(`Successfully converted to ${format.toUpperCase()} format!`);
        
      } catch (error) {
        console.error("Conversion error:", error);
        setError(`Error during conversion: ${error.message}`);
      } finally {
        setIsConverting(false);
        stopProgress();
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsConverting(false);
      stopProgress();
    };

    if (["xlsx", "xls", "docx", "pdf"].includes(fileExt)) {
      reader.readAsArrayBuffer(file);
    } else if (["csv", "json", "txt"].includes(fileExt)) {
      if (fileExt === "json" || format === "json") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } else {
      setError("Unsupported file format.");
      setIsConverting(false);
      stopProgress();
    }
  };

  const handleDownload = () => {
    if (!convertedData) {
      setError("No converted file available. Convert first.");
      return;
    }

    try {
      if (convertedData === "Excel file prepared for download") {
        setSuccess("Excel file has been downloaded");
        return;
      }
      
      let blob;
      let mimeType = "text/plain";
      
      switch (format) {
        case "json":
          mimeType = "application/json";
          break;
        case "csv":
          mimeType = "text/csv";
          break;
        case "txt":
          mimeType = "text/plain";
          break;
        default:
          mimeType = "text/plain";
      }
      
      blob = new Blob([convertedData], { type: mimeType });
      saveAs(blob, `${fileName.split(".")[0]}.${format}`);
      setSuccess("File downloaded successfully!");
    } catch (error) {
      setError(`Download failed: ${error.message}`);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };
  
  const getFormatName = (formatExt) => {
    const formats = {
      txt: "Text (TXT)",
      csv: "Spreadsheet (CSV)",
      json: "JSON Data",
      pdf: "Document (PDF)",
      docx: "Word (DOCX)",
      xlsx: "Excel (XLSX)"
    };
    return formats[formatExt] || formatExt.toUpperCase();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: "550px",
        margin: "auto",
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#121212",
        color: "#ffffff"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          File Format Converter
        </Typography>
        <Tooltip title="Clear" placement="top">
          <IconButton 
            onClick={clearFile} 
            disabled={!file}
            sx={{ color: file ? "#00A8E8" : "#555" }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: "100%",
          padding: "30px 20px",
          border: "2px dashed #00A8E8",
          borderRadius: "12px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragActive ? "rgba(0, 168, 232, 0.08)" : "#1E1E1E",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          "&:hover": {
            backgroundColor: "rgba(0, 168, 232, 0.05)",
          }
        }}
      >
        {file ? (
          <>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              backgroundColor: "rgba(0, 168, 232, 0.1)",
              padding: "10px 16px", 
              borderRadius: "8px",
              width: "fit-content"
            }}>
              {getFileIcon(file.name.split(".").pop().toLowerCase())}
              <Typography sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="#bbb">
              {(file.size / 1024).toFixed(1)} KB • {file.type || `${file.name.split(".").pop().toUpperCase()} File`}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ 
                color: "#00A8E8", 
                borderColor: "#00A8E8",
                "&:hover": { borderColor: "#007bb2", backgroundColor: "rgba(0, 168, 232, 0.05)" } 
              }}
            >
              Change File
              <input type="file" accept=".docx,.xls,.xlsx,.pdf,.csv,.json,.txt" onChange={handleFileChange} hidden />
            </Button>
          </>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: "#00A8E8", mb: 1 }} />
            <Typography variant="h6" sx={{ color: "#FFFFFF" }}>
              Drag & Drop your file here
            </Typography>
            <Typography variant="body2" color="#bbb" sx={{ mb: 2 }}>
              or
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ 
                backgroundColor: "#00A8E8", 
                "&:hover": { backgroundColor: "#007bb2" } 
              }}
            >
              Browse Files
              <input type="file" accept=".docx,.xls,.xlsx,.pdf,.csv,.json,.txt" onChange={handleFileChange} hidden />
            </Button>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1} justifyContent="center">
                {["xlsx", "pdf", "docx", "json", "txt", "csv"].map((ext) => (
                  <Grid item key={ext}>
                    <Chip 
                      label={ext.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        backgroundColor: "rgba(0, 168, 232, 0.1)",
                        color: "#aaa",
                        fontSize: "0.7rem"
                      }} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Box>

      {file && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#B0BEC5" }}>Convert to</InputLabel>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={availableFormats.length === 0 || isConverting}
                sx={{
                  backgroundColor: "#1E1E1E",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00A8E8" },
                }}
              >
                {availableFormats.map((fmt) => (
                  <MenuItem key={fmt} value={fmt}>{getFormatName(fmt)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", color: "#888" }}>
            <SwapHoriz />
          </Box>
          <Chip 
            label={file.name.split(".").pop().toUpperCase()}
            sx={{ 
              backgroundColor: "#1E1E1E",
              color: "#FFF",
              fontWeight: "bold",
              minWidth: "60px"
            }}
          />
        </Box>
      )}

      <Button
        onClick={handleConvert}
        disabled={!file || isConverting || availableFormats.length === 0}
        variant="contained"
        sx={{
          py: 1.5,
          backgroundColor: "#28a745",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#218838" },
          "&.Mui-disabled": {
            backgroundColor: "#1E1E1E",
            color: "#555"
          }
        }}
      >
        {isConverting ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} sx={{ color: "white" }} />
            <Typography>Converting...</Typography>
          </Box>
        ) : (
          "Convert File"
        )}
      </Button>

      {isConverting && (
        <Box sx={{ width: "100%", mt: -2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: "3px",
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#28a745"
              }
            }} 
          />
          <Typography variant="caption" color="#888" sx={{ display: "block", textAlign: "right", mt: 0.5 }}>
            {progress}%
          </Typography>
        </Box>
      )}

      {convertedData && (
        <Button
          onClick={handleDownload}
          variant="contained"
          startIcon={<Download />}
          sx={{
            py: 1.5,
            backgroundColor: "#FF5722",
            color: "#FFFFFF",
            "&:hover": { backgroundColor: "#E64A19" },
          }}
        >
          Download {format.toUpperCase()} File
        </Button>
      )}

      {file && availableFormats.length > 0 && (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          padding: "10px 16px",
        }}>
          <Info fontSize="small" sx={{ color: "#888" }} />
          <Typography variant="body2" color="#888">
            Converting {file.name.split(".").pop().toUpperCase()} to {format.toUpperCase()}
          </Typography>
        </Box>
      )}

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={Boolean(success)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
}