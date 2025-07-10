import { QRCodeSVG } from "qrcode.react";
import { useRef, useState, useCallback, useEffect } from "react";
import "../CSS/qrcode.css";


const downloadStringAsFile = (data, filename) => {
  try {
    const a = document.createElement("a");
    a.download = filename;
    a.href = data;
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a); 
    return true;
  } catch (error) {
    console.error("Download failed:", error);
    return false;
  }
};

const convertSvgToPng = (svgNode, callback) => {
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    const img = new Image();
    img.onload = () => {
      
      const canvas = document.createElement("canvas");
      
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        callback(null, new Error("Failed to get canvas context"));
        return;
      }
      
      
      ctx.scale(scale, scale);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngData = canvas.toDataURL("image/png");
      callback(pngData, null);
    };
    
    img.onerror = (err) => {
      callback(null, new Error("Image conversion failed"));
    };
    
    img.src = svgData;
  } catch (error) {
    callback(null, error);
  }
};

const serializeSvg = (svgNode) => {
  if (!svgNode) return null;
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    return {
      string: svgString,
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
    };
  } catch (error) {
    console.error("SVG serialization failed:", error);
    return null;
  }
};

export const QrCodeGenerator = () => {
  const [value, setValue] = useState("https://www.github.com/n1th1n-19");
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState("H");
  const [foregroundColor, setForegroundColor] = useState("#2E5FFF");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const svgRef = useRef(null);
  const inputRef = useRef(null);
  

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  }, []);

  
  const handleValueChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleDownloadSvg = useCallback(() => {
    setIsLoading(true);
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      setIsLoading(false);
      return;
    }
    
    const result = serializeSvg(svgNode);
    if (!result) {
      showNotification("Failed to generate SVG", "error");
      setIsLoading(false);
      return;
    }
    

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const contentHint = value.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `qrcode_${contentHint}_${timestamp}.svg`;
    
    const success = downloadStringAsFile(result.dataUrl, filename);
    if (success) {
      showNotification("SVG downloaded successfully");
    } else {
      showNotification("Failed to download SVG", "error");
    }
    
    setIsLoading(false);
  }, [value, showNotification]);


  const handleDownloadPng = useCallback(() => {
    setIsLoading(true);
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      setIsLoading(false);
      return;
    }
    
    convertSvgToPng(svgNode, (pngData, error) => {
      if (error || !pngData) {
        showNotification("Failed to convert to PNG", "error");
        setIsLoading(false);
        return;
      }
      

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const contentHint = value.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `qrcode_${contentHint}_${timestamp}.png`;
      
      const success = downloadStringAsFile(pngData, filename);
      if (success) {
        showNotification("PNG downloaded successfully");
      } else {
        showNotification("Failed to download PNG", "error");
      }
      
      setIsLoading(false);
    });
  }, [value, showNotification]);


  const handleCopySvg = useCallback(() => {
    const svgNode = svgRef.current;
    
    if (!svgNode) {
      showNotification("QR code not found", "error");
      return;
    }
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    
    navigator.clipboard.writeText(svgString)
      .then(() => {
        showNotification("SVG copied to clipboard");
      })
      .catch(() => {
        showNotification("Failed to copy SVG", "error");
      });
  }, [showNotification]);


  const handleClear = useCallback(() => {
    setValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="qr-container">
      <h1 className="qr-title">QR Code Generator</h1>
      
      <div className="qr-input-group">
        <input
          className="qr-input"
          onChange={handleValueChange}
          value={value}
          placeholder="Enter text or URL"
          ref={inputRef}
          aria-label="QR code content"
        />
        {value && (
          <button 
            className="qr-clear-button" 
            onClick={handleClear} 
            type="button"
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="qr-options">
        <div className="qr-option">
          <label htmlFor="qr-size">Size:</label>
          <input
            id="qr-size"
            type="range"
            min="100"
            max="400"
            step="10"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span>{size}px</span>
        </div>
        
        <div className="qr-option">
          <label htmlFor="qr-error-correction">Error Correction:</label>
          <select
            id="qr-error-correction"
            value={errorCorrection}
            onChange={(e) => setErrorCorrection(e.target.value)}
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
        
        <div className="qr-option">
          <label htmlFor="qr-fg-color">Foreground:</label>
          <input
            id="qr-fg-color"
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
          />
        </div>
        
        <div className="qr-option">
          <label htmlFor="qr-bg-color">Background:</label>
          <input
            id="qr-bg-color"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
      </div>
      
      <div className="qr-code-wrapper">
        {value ? (
          <QRCodeSVG
            bgColor={backgroundColor}
            className="qr-code"
            fgColor={foregroundColor}
            level={errorCorrection}
            marginSize={2}
            ref={svgRef}
            size={size}
            title={value}
            value={value || " "} 
          />
        ) : (
          <div className="qr-placeholder">Enter text to generate QR code</div>
        )}
      </div>
      
      <div className="qr-buttons">
        <button 
          className="qr-button" 
          onClick={handleDownloadSvg} 
          disabled={!value || isLoading}
          type="button"
        >
          {isLoading ? "Processing..." : "Download SVG"}
        </button>
        <button
          className="qr-button"
          onClick={handleDownloadPng}
          disabled={!value || isLoading}
          type="button"
        >
          {isLoading ? "Processing..." : "Download PNG"}
        </button>
        <button
          className="qr-button"
          onClick={handleCopySvg}
          disabled={!value}
          type="button"
        >
          Copy SVG
        </button>
      </div>
      
      {notification.message && (
        <div className={`qr-notification qr-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
