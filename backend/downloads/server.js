const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  
  if (!videoUrl) {
    return res.status(400).json({ error: "No video URL provided" });
  }

  try {
    const outputPath = path.join(__dirname, "downloads", "video.mp4");

    await youtubedl(videoUrl, {
      output: outputPath,
      format: "mp4",
    });

    res.download(outputPath, "downloaded-video.mp4", () => {
      fs.unlinkSync(outputPath); // Delete file after download
    });
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
