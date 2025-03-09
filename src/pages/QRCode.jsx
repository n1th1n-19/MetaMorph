import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import "../CSS/qrcode.css";
import Aurora from '../Components/Aurora';


function downloadStringAsFile(data, filename) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = data;
  a.click();
}

const handleDownloadPng = (svgNode) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgNode);
  const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Failed to convert SVG to PNG.");
      return;
    }
    ctx.drawImage(img, 0, 0);
    const pngData = canvas.toDataURL("image/png");
    downloadStringAsFile(pngData, "qrcode.png");
  };
  img.onerror = () => {
    alert("Failed to convert SVG to PNG.");
  };
  img.src = svgData;
};

export const QrCodeGenerator = () => {
  const [value, setValue] = useState("https://www.github.com/n1th1n-19");
  const svgRef = useRef(null);

  const handleDownloadSvg = () => {
    const svgNode = svgRef.current;
    if (!svgNode) {
      return;
    }
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    downloadStringAsFile(svgData, "qrcode.svg");
  };

  return (
    <div className="qr-container">
      
      <h1 className="qr-title">QR Code</h1>
      <input
        className="qr-input"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Enter text or URL"
      />
      <div className="qr-code-wrapper">
        <QRCodeSVG
          bgColor={"#ffffff"}
          className="qr-code"
          fgColor={"#2E5FFF"}
          level="H"
          marginSize={2}
          minVersion={4}
          ref={svgRef}
          size={200}
          title={value}
          value={value}
        />
      </div>
      <div className="qr-buttons">
        <button className="qr-button" onClick={handleDownloadSvg} type="button">
          Download SVG
        </button>
        <button
          className="qr-button"
          onClick={() => {
            if (svgRef.current) {
              handleDownloadPng(svgRef.current);
            }
          }}
          type="button"
        >
          Download PNG
        </button>
        <CopySvgButton svgRef={svgRef} />
      </div>
    </div>
  );
};

export default QrCodeGenerator;

const CopySvgButton = ({ svgRef }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySvg = (svgNode) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    navigator.clipboard.writeText(svgString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <button
      className="qr-button"
      onClick={() => {
        if (svgRef.current) {
          handleCopySvg(svgRef.current);
        }
      }}
      type="button"
    >
      {isCopied ? "Copied!" : "Copy SVG"}
    </button>
  );
};