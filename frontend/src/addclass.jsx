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
import DateTime from "./components/DateTimeCOMP.jsx";
import dayjs from 'dayjs';
import CourseColourField from "./components/CourseColour.jsx";



const createEmptyDeadline = () => ({
    title: "",
    due_date: "",
    weight: "",
});

const createEmptyLatePolicy = () => ({
    policy_date: "",
    penalty: "",
});

const TextField1 = memo(function TextField1({ label, value, onChange
}) {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            slotProps={{maxLength: 200}}
            fullWidth
        />
    );
});

const TextField2 = memo(function TextField2({ label, value, onChange }) {
  return (
    <TextField
        label={label}
        type="number"
        value={value}
        onChange={onChange}
        slotProps={{
            htmlInput: {
            min: 0,
            max: 100,
            step: 1,
            inputMode: "decimal",
            },
        }}
        fullWidth
    />
  );
});

const LatePolicyRow = React.memo(function LatePolicyRow({
    policy,
    index,
    onFieldChange,
    onMenuOpen,
    }){
    
    const handlePenaltyChange = React.useCallback(
    (e) => {
        let raw = e.target.value;

        if (raw === "") {
        onFieldChange(index, "penalty", "", "lp");
        return;
        }

        const num = parseFloat(raw);
        if (!Number.isNaN(num)) {
        if (num < 0) raw = "0";
        if (num > 100) raw = "100";
        }

        onFieldChange(index, "penalty", raw, "lp");
    },
    [index, onFieldChange]
    );


    const handlePolicyDateChange = React.useCallback(
        (newValue) => {
            let raw = e.target.value;

        if (raw === "") {
        onFieldChange(index, "penalty", "", "lp");
        return;
        }

        const num = parseFloat(raw);
        if (!Number.isNaN(num)) {
        if (num < 0) raw = "0";
        }
            onFieldChange(index, "time", newValue ? newValue.toDate().toISOString() : null, "lp");
        },
        [index, onFieldChange]
    );

    return (
        <ListItem
        sx={{ display: "flex", gap: 2, flexDirection: "row" }}
        secondaryAction={
            <IconButton edge="end" onClick={event => onMenuOpen(event, policy.id)}>
            <MoreVertIcon />
            </IconButton>
        }
        >

        <TextField2
            label="Penalty %"
            value={policy.penalty ?? ""}
            onChange={handlePenaltyChange}
        />

        <TextField2
            label="Hrs Late"
            value={policy.time ?? null}
            onChange={handlePolicyDateChange}
        />
        </ListItem>
    );
    
});

const DeadlineRow = React.memo(function DeadlineRow({
    deadline,
    index,
    onFieldChange,
    onMenuOpen,
    }) {

    const handleTitleChange = React.useCallback(
        (e) => onFieldChange(index, "title", e.target.value, "dl"),
        [index, onFieldChange]
    );

    const handleWeightChange = React.useCallback(
        (e) => {
            let raw = e.target.value;

            if (raw === "") {
            onFieldChange(index, "weight", "", "dl");
            return;
            }

            const num = parseFloat(raw);
            if (!Number.isNaN(num)) {
            if (num < 0) raw = "0";
            if (num > 100) raw = "100";
            }

            onFieldChange(index, "weight", raw, "dl");
        },
        [index, onFieldChange]
    );


    const handleDueDateChange = React.useCallback(
        (newValue) => {
            onFieldChange(index, "due_date", newValue ? newValue.toDate().toISOString() : null, "dl");
        },
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
            onChange={handleWeightChange}
        />

        <DateTime
            value={deadline.due_date ?? null}
            onChange={handleDueDateChange}
        />
        </ListItem>
    );
});


import { useUserContext } from './userContext.jsx';
import { t } from "i18next";

function AddClass(){

    const location = useLocation();
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [selectedDLIds, setDLIds] = React.useState([]);
    const [selectedLPIds, setLPIds] = React.useState([]);
    const [msg, setMsg] = React.useState("");
    const localId = localStorage.getItem("id");
    const { data, setData } = useUserContext();

    if(localId == null){
        navigate("/home");
    }

    const [classInfo, setClassInfo] = React.useState(
        () => location.state?.classInfo ?? null
    );

    if (classInfo.user === null) 
        setClassInfo(prev => ({...prev, user: localId}));

    const handleMenuOpen = (event, index, id, type) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedIndex(index);
        setSelectedType(type);
        setSelectedId(id.id);
        
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedIndex(null);
        setSelectedType(null);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        
        setClassInfo(prev => {
            if (selectedType == "dl") {
                selectedDLIds.push(selectedId);
                return {
                ...prev,
                deadlines: prev.deadlines.filter((_, i) => i !== selectedIndex),
            };
            } else if (selectedType == "lp") {
                selectedLPIds.push(selectedId);
                return {
                ...prev,
                late_policy: prev.late_policy.filter((_, i) => i !== selectedIndex),
                };
            }
            return prev;
        });

        handleMenuClose();

    };

    const { showFlash } = useUI();


    const generic_Update = useCallback((index, field, value, type) => {
        setClassInfo(prev => {

            let listKey;

            if(type == "dl"){
                listKey = "deadlines";
            }

            else if(type == "lp"){
                listKey = "late_policy";
            }

            else{
                return prev;
            }
            
            const list = prev[listKey];

            const newList = [...list];

            newList[index] = {
                ...newList[index],
                [field]: value,
            };

            return{
                ...prev,
                [listKey]: newList
            }

        });
    }, []);

    const addDeadline = () => {
        setClassInfo(prev => ({
            ...prev,
            deadlines: [...prev.deadlines, createEmptyDeadline()],
        }));
    };

    const addLatePolicy = () => {
        setClassInfo(prev => ({
            ...prev,
            late_policy: [...prev.late_policy, createEmptyLatePolicy()],
        }));
    };

    const courseCodeUpdate = (value) => { setClassInfo(prev => ({...prev, course_code: value})) }; 
    const profEmailUpdate = (value) => { setClassInfo(prev => ({...prev, prof_email: value})) };
    const colourUpdate = (value) => { setClassInfo(prev => ({...prev, colour: value}))};
    


    const backendSave = async () => {

        try {
            console.log(classInfo);   
            if(classInfo.id == null){
                
                await axios.post(`/api/courses/`, classInfo);
                setMsg("created");
            } else{
                await axios.patch(`/api/courses/${classInfo.id}/`, classInfo);
                setMsg("created");
            }
            
    
        } catch (err) {
            console.error("Error:", err.response?.data || err);
        } finally {
            showFlash(`Class "${classInfo.course_code}" ${msg}`, 'success');
            setData(JSON.stringify(classInfo));
            navigate("/manageclass")
            setLPIds([]);
            setDLIds([]);
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
            p: 2,
            pb: 8,
        }}
        >
            <Typography variant="h4" sx={{display: "flex", flexDirection: "row"}}>
                Edit Class: {classInfo.course_code}
            </Typography>
            <CourseColourField 
                value={classInfo.colour}
                onChange={colourUpdate}
            />
            <List>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField1
                        label="Course Code/Course Name"
                        value={classInfo.course_code}
                        slotProps={{maxLength: 15}}
                        onChange={e=>
                            courseCodeUpdate(e.target.value)
                        }
                    />
                </ListItem>
                <ListItem sx={{display: "flex", gap:2, flexDirection: "column"}}>
                    <TextField1
                        label="Prof Email"
                        value={classInfo.prof_email}
                        slotProps={{maxLength: 255}}
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
                        onFieldChange={generic_Update}
                        onMenuOpen={(event) => handleMenuOpen(event, index, deadline, "dl")}
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
                {classInfo.late_policy.map((policy, index) => (
                   <LatePolicyRow
                        key={policy.id ?? index}
                        policy={policy}
                        index={index}
                        onFieldChange={generic_Update}
                        onMenuOpen={(event) => handleMenuOpen(event, index, policy, "lp")}
                    />
                ))}
                <Button
                    variant="contained"
                    onClick={() => addLatePolicy()}
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
                    Add Late Policy
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
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <Button type="button" variant="contained" onClick={()=>{
               const hasInvalidDeadline = classInfo.deadlines.some(d => !d.title || d.title.trim() === "");

                if (hasInvalidDeadline) return showFlash("Missing or invalid information", "warning");
                
                if (classInfo.course_code == "") return showFlash('Please enter a class name', 'warning');
                
                backendSave()
                
            }}>
                Save Changes
            </Button>
        </Box>
    );
}

export default AddClass;