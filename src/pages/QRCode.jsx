"use client";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { ModernSimpleInput } from "@/cuicui/common-ui/inputs/modern-simple-input/modern-simple-input";
import { useCopyToClipboard } from "@/cuicui/hooks/use-copy-to-clipboard";

function downloadStringAsFile(data, filename) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = data;
  a.click();
}

// Function to handle PNG download
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
  const [value, setValue] = useState("https://www.modul.day");
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
    <div className="flex flex-col items-center gap-4">
      <ModernSimpleInput
        className="w-80 text-center"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <QRCodeSVG
        bgColor={"#ffffff00"}
        className="rounded-md dark:bg-white"
        fgColor={"#2E5FFF"}
        imageSettings={{
          src: "https://www.modul.day/favicon.ico",
          height: 22,
          width: 22,
          opacity: 1,
          excavate: true,
        }}
        level="H"
        marginSize={2}
        minVersion={4}
        ref={svgRef}
        size={200}
        title={value}
        value={value}
      />
      <div className="flex flex-col gap-2 *:transform-gpu *:rounded-lg *:border *:border-neutral-400/10 *:bg-neutral-400/20 *:px-3 *:py-1.5 *:text-neutral-600 *:transition-transform *:dark:text-neutral-300">
        <button className="hover:scale-90" onClick={handleDownloadSvg} type="button">
          Download SVG
        </button>
        <button
          className="hover:scale-90"
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
  const [_copiedText, copyTextToClipboard, isCopied] = useCopyToClipboard();

  const handleCopySvg = (svgNode) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgNode);
    copyTextToClipboard(svgString);
  };

  return (
    <button
      className="hover:scale-90"
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
