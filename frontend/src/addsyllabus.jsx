import React, { useState, useRef } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

function AddSyllabus() {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const [msg, setMsg] = useState("Tap to upload syllabus");

  const onFileChange = async (event) => {
    const file = event.target.files?.[0] || null;
    
    
    if (file == null) {
     setMsg("Tap to upload syllabus");   
     return;  
    }
    
    else{
      setSelectedFile(file);
      setMsg(`Current file: ${file.name}`);
      onFileUpload(selectedFile);
    }
  };

  const onFileUpload = async (file) => {
  
    const formData = new FormData();
    formData.append("myFile", file, file.name);
   

    try {
      await axios.post("/api/uploadfile", formData); 
      console.log("Uploaded:", file.name);

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
         if (inputRef.current) inputRef.current.value = "";
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <IconButton
          component="label"
          aria-label="Upload syllabus"
          title="Upload syllabus"
          sx={{
            borderRadius: "50%",
            bgcolor: "primary.secondary",  
            width: "7vh",
            height: "7vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "common.white",
            p: 0,
            "&:hover": { opacity: 0.9 },
          }}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={onFileChange}
            accept="application/pdf,image/*"
          />
          <Typography variant="h2" sx={{ lineHeight: 1 }}>+</Typography>
        </IconButton>

       <Typography
          variant="h6"
          aria-live="polite"
          sx={{
            maxWidth: "80vw",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {msg}
        </Typography>
        
      </Box>
    </Box>
  );
}

export default AddSyllabus;
