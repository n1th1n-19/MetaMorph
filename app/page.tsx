"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Avatar,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CampaignIcon from "@mui/icons-material/Campaign";
import MicIcon from "@mui/icons-material/Mic";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LinkIcon from "@mui/icons-material/Link";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SparkleIcon from "@mui/icons-material/AutoAwesome";
import ImageIcon from "@mui/icons-material/Image";
import SecurityIcon from "@mui/icons-material/Security";
import CodeIcon from "@mui/icons-material/Code";

const tools = [
  {
    title: "Text to Speech",
    description: "Convert written text into natural-sounding speech",
    icon: CampaignIcon,
    path: "/to-speech",
    category: "Audio",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#667eea",
  },
  {
    title: "Speech to Text",
    description: "Convert audio recordings into text",
    icon: MicIcon,
    path: "/speech-to-text",
    category: "Audio",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "#f093fb",
  },
  {
    title: "QR Code Generator",
    description: "Generate QR codes from text or URLs",
    icon: QrCodeIcon,
    path: "/qr-code",
    category: "Generator",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    color: "#4facfe",
  },
  {
    title: "File Converter",
    description: "Convert files between different formats",
    icon: CompareArrowsIcon,
    path: "/file-converter",
    category: "Converter",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "#43e97b",
  },
  {
    title: "URL Shortener",
    description: "Create short, shareable links from long URLs",
    icon: LinkIcon,
    path: "/url-shortener",
    category: "Utility",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    color: "#fa709a",
  },
  {
    title: "OCR Extractor",
    description: "Extract text from images using OCR",
    icon: TextFieldsIcon,
    path: "/ocr-extractor",
    category: "Extractor",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    color: "#a8edea",
  },
  {
    title: "Mp4 to Mp3",
    description: "Convert MP4 video files to MP3 audio format",
    icon: DownloadIcon,
    path: "/mp4-to-mp3",
    category: "Converter",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    color: "#fcb69f",
  },
  {
    title: "Image Converter",
    description: "Convert images between different formats (JPG, PNG, WebP)",
    icon: ImageIcon,
    path: "/image-converter",
    category: "Converter",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
    color: "#ff6b6b",
  },
  {
    title: "Password Generator",
    description: "Generate secure, random passwords with customizable options",
    icon: SecurityIcon,
    path: "/password-generator",
    category: "Security",
    gradient: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
    color: "#4caf50",
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting",
    icon: CodeIcon,
    path: "/json-formatter",
    category: "Developer",
    gradient: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#2196f3",
  },
];

const categories = [
  "All",
  "Audio",
  "Generator",
  "Converter",
  "Security",
  "Developer",
  "Utility",
  "Extractor",
];

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(0, 168, 232, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 4, md: 6 },
            textAlign: "center",
          }}
        >
          <Fade in timeout={1000}>
            <Box>
              <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    background:
                      "linear-gradient(135deg, #00a8e8 0%, #0078d4 100%)",
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  <SparkleIcon fontSize="inherit" />
                </Avatar>
              </Box>

              <Typography
                variant={isMobile ? "h3" : "h1"}
                component="h1"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 2,
                  letterSpacing: "-0.02em",
                }}
              >
                MetaMorph
              </Typography>

              <Typography
                variant={isMobile ? "h6" : "h4"}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 4,
                  fontWeight: 300,
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.4,
                }}
              >
                One app, endless transformations
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  maxWidth: "500px",
                  mx: "auto",
                  mb: 4,
                }}
              >
                Transform, convert, and enhance your digital content with our
                powerful suite of tools
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={{
                  color:
                    selectedCategory === category
                      ? "#000"
                      : "rgba(255, 255, 255, 0.7)",
                  backgroundColor:
                    selectedCategory === category ? "#00a8e8" : "transparent",
                  borderColor:
                    selectedCategory === category
                      ? "#00a8e8"
                      : "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    backgroundColor:
                      selectedCategory === category
                        ? "#0078d4"
                        : "rgba(0, 168, 232, 0.1)",
                    borderColor: "#00a8e8",
                    color: selectedCategory === category ? "#000" : "#fff",
                  },
                  transition: "all 0.3s ease",
                  fontWeight: selectedCategory === category ? 600 : 400,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ pb: 8 }}>
          {filteredTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Grid item xs={12} sm={6} lg={4} key={tool.title}>
                <Fade in timeout={800 + index * 100}>
                  <Card
                    onMouseEnter={() => setHoveredCard(tool.title)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => router.push(tool.path)}
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${tool.color}20`,
                        border: `1px solid ${tool.color}40`,
                        "& .tool-icon": {
                          transform: "scale(1.1)",
                          color: tool.color,
                        },
                        "& .arrow-icon": {
                          opacity: 1,
                          transform: "translateX(0)",
                        },
                        "& .gradient-bg": {
                          opacity: 0.1,
                        },
                      },
                    }}
                  >
                    {/* Gradient Background */}
                    <Box
                      className="gradient-bg"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: tool.gradient,
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        zIndex: 0,
                      }}
                    />

                    <CardContent
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Avatar
                            className="tool-icon"
                            sx={{
                              width: 48,
                              height: 48,
                              background: `${tool.color}15`,
                              color: "rgba(255, 255, 255, 0.8)",
                              mr: 2,
                              transition: "all 0.4s ease",
                            }}
                          >
                            <IconComponent />
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#fff",
                                fontWeight: 600,
                                mb: 0.5,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                              }}
                            >
                              {tool.title}
                            </Typography>
                            <Chip
                              label={tool.category}
                              size="small"
                              sx={{
                                backgroundColor: `${tool.color}20`,
                                color: tool.color,
                                fontSize: "0.7rem",
                                height: 20,
                                border: `1px solid ${tool.color}30`,
                              }}
                            />
                          </Box>
                        </Box>

                        <IconButton
                          className="arrow-icon"
                          size="small"
                          sx={{
                            color: tool.color,
                            opacity: 0,
                            transform: "translateX(10px)",
                            transition: "all 0.4s ease",
                            "&:hover": {
                              backgroundColor: `${tool.color}20`,
                            },
                          }}
                        >
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          lineHeight: 1.6,
                          flexGrow: 1,
                        }}
                      >
                        {tool.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
