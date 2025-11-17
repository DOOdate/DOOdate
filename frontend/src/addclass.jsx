import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useUI } from './uiContext.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from './userContext.jsx';
import { t } from "i18next";

function AddClass(){
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [classInfo, setClassInfo] = useState(null);
    const [jsonText, setJsonText] = useState('');
    const location = useLocation();
    const { data, setData } = useUserContext();

    useEffect(() => {
        if (location?.state?.classInfo) {
            setClassInfo(location.state.classInfo);
            if (location.state.classInfo.course_code) setName(location.state.classInfo.course_code);
        }
    }, [location]);
    const { showFlash } = useUI();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!code.trim()) return showFlash('Please enter a class code', 'warning');

        // Try to fetch class information from the backend. If there's no known endpoint,
        // this will fail silently and leave the UI for manual paste or upload flow.
        (async () => {
            try {
                const resp = await axios.get(`/api/classinfo?code=${encodeURIComponent(code)}`);
                if (resp?.data) {
                    setClassInfo(resp.data);
                    if (resp.data.course_code) setName(resp.data.course_code);
                    return;
                }
            } catch (err) {
                // No server endpoint available or request failed — fall back to waiting for upload
                console.debug('Fetching class info failed:', err?.message || err);
                showFlash('Could not fetch class info from server; paste JSON or upload a syllabus.', 'info');
            }
        })();
    }

    const loadFromJson = () => {
        if (!jsonText.trim()) return showFlash('Paste class JSON into the box first', 'warning');
        try {
            const parsed = JSON.parse(jsonText);
            if (parsed && (parsed.course_code || parsed.deadlines)) {
                setClassInfo(parsed);
                if (parsed.course_code) setName(parsed.course_code);
                showFlash('Loaded class info from JSON', 'success');
            } else {
                showFlash('JSON does not look like class info', 'warning');
            }
        } catch (err) {
            showFlash('Invalid JSON: ' + err.message, 'error');
        }
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default', 
            color: 'text.primary',
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
                let t = JSON.parse(data);
                t.classes.push(location.state.classInfo);
                setData(JSON.stringify(t));
            }}>Add class</Button>
        </Box>
    );
}

export default AddClass;