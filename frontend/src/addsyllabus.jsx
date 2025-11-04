import React, { useState, useRef } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { useUI } from './uiContext.jsx';
import { useTranslation } from 'react-i18next';

function AddSyllabus() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const [msg, setMsg] = useState(t('Upload'));
  const [progress, setProgress] = useState(0);
  const { setLoading, showFlash } = useUI();

  const onFileChange = async (event) => {
    const file = event.target.files?.[0] || null;

    if (file == null) {
      setMsg(t('Upload'));
      return;
    }

    // set immediately and start upload with the fresh file reference
    setSelectedFile(file);
    setMsg(t('Preparing Upload') + file.name); // + file.name
    onFileUpload(file);
  };

  const onFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("myFile", file, file.name);

    try {
      setLoading(true);
      setProgress(0);
      setMsg(t('Uploading') + file.name); 

      await axios.post("/api/uploadfile", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(pct);
          setMsg(t('Uploading') + file.name + ' '+ pct +'%');
        }
      });

      console.log("Uploaded:", file.name);
      showFlash((t('Uploaded') + file.name), 'success');
      setMsg(t('Uploaded') + file.name);

    } catch (err) {
      console.error("Upload failed:", err);
      showFlash(t('Upload failed'), 'error');
      setMsg(t('Upload failed'));
    } finally {
      setLoading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
      // keep selectedFile cleared so UX is clean
      setSelectedFile(null);
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
          aria-label={t('Upload')}
          title={t('Upload')}
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
            textAlign: "center"
          }}
        >
          {msg}
        </Typography>
        {progress > 0 && (
          <Box sx={{ width: '80vw', maxWidth: 480 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
        
      </Box>
    </Box>
  );
}

export default AddSyllabus;
