import React, {useCallback } from "react";
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
import { memo, useState } from 'react';

const createEmptyDeadline = () => ({
    title: "",
    due_date: "",
    weight: "",
});

const TextField1 = memo(function TextField1({ label, value, onChange
}) {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            fullWidth
        />
    );
});

const TextField2 = memo(function TextField2({ label, value, onChange
}) {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            sx = {{maxWidth: 200}}
        />
    );
});

const DeadlineRow = React.memo(function DeadlineRow({
    deadline,
    index,
    onFieldChange,
    onMenuOpen,
    }) {
    const handleTitleChange = React.useCallback(
        (e) => onFieldChange(index, "title", e.target.value),
        [index, onFieldChange]
    );

    const handleWeightChange = React.useCallback(
        (e) => onFieldChange(index, "weight", Number(e.target.value) || 0),
        [index, onFieldChange, 0]
    );

    const handleDueDateChange = React.useCallback(
        (e) => onFieldChange(index, "due_date", e.target.value),
        [index, onFieldChange]
    );

    return (
        <ListItem
        sx={{ display: "flex", gap: 2, flexDirection: "row" }}
        secondaryAction={
            <IconButton edge="end" onClick={event => onMenuOpen(event, deadline.id)}>
            <MoreVertIcon />
            </IconButton>
        }
        >
        <TextField1
            label="Name"
            value={deadline.title ?? ""}
            onChange={handleTitleChange}
        />

        <TextField2
            label="Weight"
            value={deadline.weight ?? ""}
            type="number"
            min = "0"
            onChange={handleWeightChange}
        />

        <TextField2
            label="Due Date"
            type="number"
            value={deadline.due_date ?? ""}
            onChange={handleDueDateChange}
        />
        </ListItem>
    );
});



function AddClass(){

    const location = useLocation();
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [deadlineId, setDeadlineId] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [selectedIds, setIds] = React.useState([]);

    const [classInfo, setClassInfo] = React.useState(
            () => location.state?.classInfo ?? null
    );

    const [name, setName] = React.useState(classInfo.course_code);

    const handleMenuOpen = (event, id) => {
        setMenuAnchorEl(event.currentTarget);
        setDeadlineId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setDeadlineId(null);
    };

    const handleDelete = async () => {
    if (deadlineId == null) return showFlash("Cannot delete assignment that does not exist", "warning");

        try {

            selectedIds.push(deadlineId);
            setClassInfo(prev => ({...prev,deadlines: prev.deadlines.filter(d => d.id !== deadlineId),}));

        } catch (err) {

            console.error(err);
            
        } finally {
            
            handleMenuClose();
        }
    };

    const { showFlash } = useUI();


    const deadLineUpdate = useCallback((index, field, value) => {
        setClassInfo(prev => {
            const deadlinesCopy = [...prev.deadlines];
            const deadline = deadlinesCopy[index];

            deadlinesCopy[index] = {
            ...deadline,
            [field]: value,
            };

            return {
            ...prev,
            deadlines: deadlinesCopy,
            };
        });
    }, []);

    const addDeadline = () => {
        setClassInfo(prev => ({
            ...prev,
            deadlines: [...prev.deadlines, createEmptyDeadline()],
        }));
    };

    const courseCodeUpdate = (value) => { setClassInfo(prev => ({...prev, course_code: value})) }; 
    const profEmailUpdate = (value) => { setClassInfo(prev => ({...prev, prof_email: value})) };


    const backendSave = async () => {

        try {
            if(selectedIds.length != 0){
                await axios.delete(`/api/deadlines/bulk-delete/`, {data: {ids: selectedIds}});
                setIds([]);
                if(classInfo.id == null){
                    await axios.post(`/api/courses/`, classInfo);
                } else{
                    await axios.patch(`/api/courses/${classInfo.id}/`, classInfo);
                }
    
            } else {
                if(classInfo.id == null){
                    await axios.post(`/api/courses/`, classInfo);
                } else{
                    await axios.patch(`/api/courses/${classInfo.id}/`, classInfo);
                }
            }
            navigate("/manageclass")
        } catch (err) {
            console.error("Error:", err.response?.data || err);
        } 
    };

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
                Edit Class: {name}
            </Typography>

            <List>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField1
                        label="Course Code/Course Name"
                        value={classInfo.course_code}
                        onChange={e=>
                            courseCodeUpdate(e.target.value)
                        }
                    />
                </ListItem>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField1
                        label="Prof Email"
                        value={classInfo.prof_email}
                        onChange={e=>
                            profEmailUpdate(e.target.value)
                        }
                    />
                </ListItem>
                {classInfo.deadlines.map((deadline, index) => (
                   <DeadlineRow
                        key={deadline.id ?? index}
                        deadline={deadline}
                        index={index}
                        onFieldChange={deadLineUpdate}
                        onMenuOpen={handleMenuOpen}
                    />
                ))}
                <Button
                    variant="contained"
                    onClick={() => addDeadline()}
                    sx={{
                      display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        borderRadius: 0,
                        bgcolor: "primary.secondary",
                        color: "common.white",
                        py: 1,
                        textTransform: "none"
                    }}
                >
                    Add Deadline
                </Button>
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
                <MenuItem onClick={handleDelete}>Remove Assignment</MenuItem>
            </Menu>
            <Button type="button" variant="contained" onClick={()=>{
               const hasInvalidDeadline = classInfo.deadlines.some(d => !d.title || d.title.trim() === "");

                if (hasInvalidDeadline) return showFlash("Missing or invalid information", "warning");
                
                if (classInfo.course_code == "") return showFlash('Please enter a class name', 'warning');
                showFlash(`Class "${classInfo.course_code}" added`, 'success');
                backendSave()
                
            }}>
                Save Changes
            </Button>
        </Box>
    );
}

export default AddClass;