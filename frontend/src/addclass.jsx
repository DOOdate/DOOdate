import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useUI } from './uiContext.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function AddClass(){

    const [classInfo, setClassInfo] = React.useState([]);
    const location = useLocation();

    useEffect(() => {
        if (location?.state?.classInfo) {
            setClassInfo(location.state.classInfo);
        }
    }, [location]);
    const { showFlash } = useUI();

    const deadlineUpdate  = (index, field, value) => {
        setClassInfo(prev => ({...prev, deadlines: prev.deadlines.map((d,i) => i == index ? {...d, [field]: value } : d),
        }));
    };

    const backendSave = async () => {
        
        try {
            await axios.patch(`/api/courses/${classInfo.id}/`, classInfo);
        } catch (err) {
            console.error("Failed to save:", err);
        }
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
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
            // add bottom padding so fixed bottom navbar doesn't cover the button
            pb: 8,
        }}
        >
            <Typography variant="h4">Add Class</Typography>
            {/* <TextField 
                label="Class code" 
                value={code} 
                onChange={(e)=>setCode(e.target.value)} 
                fullWidth 
            /> */}

            {/* <TextField
                label="Or paste class JSON here (for testing)"
                multiline
                minRows={4}
                value={jsonText}
                onChange={(e)=>setJsonText(e.target.value)}
                placeholder='Paste the class JSON returned by the server'
                fullWidth
            /> */}
            {/* <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="button" variant="outlined" onClick={loadFromJson}>Load JSON</Button>
                <Button type="submit" variant="contained">Load from server</Button>
            </Box> */}
            {classInfo && (
                <>
                    <TextField 
                        label="Class name" 
                        value={name} 
                        onChange={(e)=>setName(e.target.value)} 
                        fullWidth 
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>Deadlines and due dates</Typography>
                    <Paper elevation={0} sx={{ bgcolor: 'background.paper', p: 2 }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {classInfo.deadlines.map((deadline, index) => (
                                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                    <ListItemText
                                        primary={deadline.title}
                                        secondary={
                                            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                <Typography component="span" variant="body2">
                                                    Due: {formatDate(deadline.due_date)}
                                                </Typography>
                                                {typeof deadline.weight === 'number' && (
                                                    <Typography component="span" variant="body2">
                                                        Weight: {deadline.weight >= 0 ? `${deadline.weight}%` : 'unknown'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </>
            )}
            <Button type="button" variant="contained" onClick={()=>{
                if (!name.trim()) return showFlash('Please enter a class name', 'warning');
                showFlash(`Class "${name}" added`, 'success');
                setName('');
                setCode('');
                setClassInfo(null);
                setJsonText('');
            }}>Add class</Button>
        </Box>
    );
}

export default AddClass;