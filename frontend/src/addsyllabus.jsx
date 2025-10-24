import React from "react";
import axios from "axios";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";

function AddSyllabus(){

    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const onFileChange = async (event) => {

        const file = event.target.files?.[0] || null;
        setSelectedFile(file);

        if(file){
            await onFileUpload(file);
        }

    };

    const onFileUpload = () => {
        const formData = new FormData();

        if(!file) return;
        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );

        // console.log(selectedFile);
        // axios.post("api/uploadfile", formData);

    };

    return (
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IconButton
                    component="label"
                    aria-label="Upload syllabus"
                    title="Upload syllabus"
                
                    sx={{ 
                        borderRadius: 15, 
                        bgcolor: 'primary.secondary', 
                        width: '7vh', 
                        height: '7vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: "common.white",
                        "&:hover": {opacity: 0.9, bgcolor: "primary.secondary" },
                        p: 0,
                    }}
                >
                    <input
                        ref = {inputRef}
                        type = "file"
                        hidden
                        onChange={onFileChange}
                        accept="application/pdf,image/*"
                    />
                    <Typography variant="h2" sx={{lineHeight: 1}}>
                        +
                    </Typography>

                </IconButton>
                    <Typography variant="h2">+</Typography>
                
                <Typography variant="h6">Tap to upload syllabus</Typography>
            </Box>
        </Box>
    );
}
export default AddSyllabus