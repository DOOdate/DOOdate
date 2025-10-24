import React, { useState, useRef } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

const DEFAULT_MSG = "Tap to upload syllabus";


function AddSyllabus() {
  const [msg, setMsg] = useState(DEFAULT_MSG);
  const inputRef = useRef(null); 


  const onFileChange = async (event) => {
    const inputRef = event.currentTarget;
    const file = inputRef.files?.[0] ?? null;
    
    
    if (!file) {
      setMsg(DEFAULT_MSG);
      return;
    }
    
    setMsg(`Current file: ${file.name}`);

    try{
      await onFileUpload(file);
    }
    //Add catch here when backend implemented to catch if file upload doesnt work
    finally{
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onFileUpload = async (file) => {
  
    const formData = new FormData();
    formData.append("myFile", file, file.name);
    await axios.post("/api/uploadfile", formData); 
    if (inputRef.current) inputRef.current.value = "";

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
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh'
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ 
                    borderRadius: 15, 
                    bgcolor: 'primary.secondary', 
                    width: '7vh', 
                    height: '7vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography variant="h2">+</Typography>
                </Box>
                <Typography variant="h6">Tap to upload syllabus</Typography>
            </Box>
        </Box>
    )
}
export default AddSyllabus