import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useUI } from './uiContext.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function AddClass(){

    const location = useLocation();
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [deadlineId, setDeadlineId] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const [classInfo, setClassInfo] = React.useState(
            () => location.state?.classInfo ?? null
        );


    const handleMenuOpen = (event, id) => {
        setMenuAnchorEl(event.currentTarget);
        setDeadlineId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setDeadlineId(null);
    };

    const handleDelete = async () => {
    if (deadlineId == null) return;

        try {

            await axios.delete(`/api/deadlines/${deadlineId}/`);
            setClassInfo(prev => ({...prev,deadlines: prev.deadlines.filter(d => d.id !== deadlineId),}));

        } catch (err) {

            console.error(err);
            
        } finally {
            
            handleMenuClose();
        }
    };

    const handleColour = async () =>{
        //implement when colours
        return 
    };

    const { showFlash } = useUI();

    const deadLineUpdate  = (index, field, value) => {
        setClassInfo(prev => ({...prev, deadlines: prev.deadlines.map((d,i) => i == index ? {...d, [field]: value } : d),
        }));
    };

    const courseCodeUpdate = (value) => {
        setClassInfo(prev => ({...prev, course_code: value}))
    };

    const profEmailUpdate = (value) => {
        setClassInfo(prev => ({...prev, prof_email: value}))
    }

    const backendSave = async () => {
        
        console.log("here");
        try {
            await axios.patch(`/api/courses/${classInfo.id}/`, classInfo);
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            navigate("/manageclass")
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
            pb: 8,
        }}
        >
            <Typography variant="h4">
                Edit Class: {classInfo.course_code}
            </Typography>

            <List>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField
                        label="Course Code/Course Name"
                        value={classInfo.course_code}
                        onChange={e=>
                            courseCodeUpdate(e.target.value)
                        }
                        fullWidth
                    />
                </ListItem>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField
                        label="Prof Email"
                        value={classInfo.prof_email}
                        onChange={e=>
                            profEmailUpdate(e.target.value)
                        }
                        fullWidth
                    />
                </ListItem>
                {classInfo.deadlines.map((deadlines, index) => (
                    <ListItem 
                        key={index} 
                        sx={{display: "flex", gap:2, flexDirection: "column"}}
                        secondaryAction={
                        <IconButton
                            edge="end"
                            onClick={event => handleMenuOpen(event, deadlines.id)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        }
                        >
                        <TextField 
                            label="Assignment Name" 
                            value={deadlines.title ?? ""} 
                            onChange={e=>
                                deadLineUpdate(index, "title", e.target.value)
                            } 
                            fullWidth 
                        /> 

                        <TextField
                            label="Weight"
                            type="number"
                            value={deadlines.weight ?? ""}
                            onChange={e=>
                                deadLineUpdate(index, "weight", Number(e.target.value))
                            }
                            sx = {{maxWidth: 200}}
                        />

                        <TextField
                            label="Due Date"
                            value={deadlines.due_date ?? ""}
                            onChange={e=> 
                                deadLineUpdate(index, "due_date", e.target.value)
                            }   
                            sx = {{maxWidth: 200}}
                        />

                    </ListItem>
                ))}
            </List>
            <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
                }}
                transformOrigin={{
                vertical: "top",
                horizontal: "right",
                }}
            >
                <MenuItem onClick={handleColour}>Change Colour</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <Button type="button" variant="contained" onClick={()=>{
                backendSave()
                if (classInfo.course_code == "") return showFlash('Please enter a class name', 'warning');
                showFlash(`Class "${classInfo.course_code}" added`, 'success');
                
            }}>
                Save Changes
            </Button>
        </Box>
    );
}

export default AddClass;