import React, { useState } from "react";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useUI } from './uiContext.jsx';
import { useLocation } from "react-router-dom";

function AddClass(){
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const { showFlash } = useUI();

    const location = useLocation();
    const { serverData } = location.state || {};

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim()) return showFlash('Please enter a class name', 'warning');
        // Minimal local behaviour: announce success and clear fields.
        showFlash(`Class "${name}" added`, 'success');
        setName('');
        setCode('');
    }

    return (
        <Box
        component="form"
        onSubmit={submit}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            mt: 6,
            bgcolor: 'background.default',
            color: 'text.primary',
            p: 2,
        }}
        >
            <Typography variant="h4">{JSON.stringify(serverData, null, 2)}</Typography>
            <TextField label="Class name" value={name} onChange={(e)=>setName(e.target.value)} fullWidth />
            <TextField label="Class code (optional)" value={code} onChange={(e)=>setCode(e.target.value)} fullWidth />
            <Button type="submit" variant="contained">Add class</Button>
        </Box>
    )
}
export default AddClass