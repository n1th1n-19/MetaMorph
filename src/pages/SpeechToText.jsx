// import React, { useState } from "react";
// import { Button, Box, Typography, TextField } from "@mui/material";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// export default function SpeechToText() {
//   const [isListening, setIsListening] = useState(false);
//   const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

//   // Check if the browser supports speech recognition
//   if (!browserSupportsSpeechRecognition) {
//     return <Typography variant="h6">⚠️ Speech Recognition is not supported in this browser. Please use Chrome or Edge.</Typography>;
//   }

//   // Start listening
//   const startListening = () => {
//     SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//     setIsListening(true);
//   };

//   // Stop listening
//   const stopListening = () => {
//     SpeechRecognition.stopListening();
//     setIsListening(false);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 2,
//         width: "100%",
//         maxWidth: "500px",
//         margin: "auto",
//         padding: "20px",
//         backgroundColor: "#121212",
//         borderRadius: "8px",
//         color: "#ffffff",
//       }}
//     >
//       <Typography variant="h5">Speech-to-Text (Web Speech API)</Typography>

//       <TextField
//         multiline
//         rows={4}
//         variant="outlined"
//         fullWidth
//         value={transcript}
//         disabled
//         sx={{
//           backgroundColor: "#1E1E1E",
//           borderRadius: "5px",
//           input: { color: "#FFFFFF" },
//           "& .MuiOutlinedInput-root": {
//             "& fieldset": { borderColor: "#444" },
//             "&:hover fieldset": { borderColor: "#666" },
//             "&.Mui-focused fieldset": { borderColor: "#00A8E8" },
//           },
//         }}
//       />

//       <Button
//         variant="contained"
//         onClick={isListening ? stopListening : startListening}
//         sx={{
//           backgroundColor: isListening ? "#FF5722" : "#00A8E8",
//           color: "#FFFFFF",
//           "&:hover": { backgroundColor: isListening ? "#E64A19" : "#0086C2" },
//         }}
//       >
//         {isListening ? "Stop Listening" : "Start Listening"}
//       </Button>

//       <Button
//         variant="outlined"
//         onClick={resetTranscript}
//         sx={{
//           color: "#00A8E8",
//           borderColor: "#00A8E8",
//           "&:hover": { borderColor: "#0086C2", color: "#0086C2" },
//         }}
//       >
//         Reset
//       </Button>
//     </Box>
//   );
// }
