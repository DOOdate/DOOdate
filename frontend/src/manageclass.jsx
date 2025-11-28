import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useUI } from './uiContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './userContext.jsx';
import { useTranslation } from 'react-i18next';

const createEmptyCourse = () => ({
    id: null,
    course_code: "",
    prof_email: "",
    user: "",
    colour: "",
    late_policy: [],
    deadlines: [],
});

function ManageClass(){
    const { t } = useTranslation();

    const [items, setItems] = React.useState([]);
    const navigate = useNavigate();
    const localId = localStorage.getItem("id");
    const {data, setData} = useUserContext();

    if(localId == null){
        navigate("/home");
    }

    React.useEffect(() => {
        const loadItems = async () => {
            if(data === "{}" || data.courses === undefined){
                const res = await axios.get(`/api/users/${localId}`);
                const userData = res.data;
                setItems(userData.courses);
                setData(JSON.stringify(userData));
            }
            else{
                setItems(data.courses);
            }
        };
        loadItems();
    }, [data, setData]);

    React.useEffect(() => {
        if (!data || data === "{}") return;
    
        try {
        const parsed = JSON.parse(data);
    
        const courses = Array.isArray(parsed.courses) ? parsed.courses : [];
    
        setItems(courses);
        } catch (e) {
        console.error("Invalid JSON in user context data:", data, e);
        setItems([]); 
        }
    }, [data]);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [selectedItemId, setSelectedItemId] = React.useState(null);

    const menuOpen = Boolean(menuAnchorEl);

    const handleMenuOpen = (event, itemId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedItemId(itemId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedItemId(null);
    };

    const handleEdit = async () => {
        if (selectedItemId == null) return;

        try {
            const { data } = await axios.get(`/api/courses/${selectedItemId}/`);

            navigate("/addclass", {state: {classInfo : data}});

        } catch (err) {

            console.error(err);
            
        } finally {
            handleMenuClose();
            
        }
        
    };

   const handleDelete = async () => {
    if (selectedItemId == null) return;

        try {

            await axios.delete(`/api/courses/${selectedItemId}/`);
            setItems(prev => prev.filter(item => item.id !== selectedItemId));

        } catch (err) {

            console.error(err);
            
        } finally {
            
            handleMenuClose();
        }
    };

    return(
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
            <Typography variant="h4">{t("Your Classes")}</Typography>

            <List>
                {items.map(item => (
        
                <ListItem
                    sx={{
                        px: 0.5
                    }}
                    key={item.id}
                    secondaryAction={
                    <IconButton
                        edge="end"
                        onClick={event => handleMenuOpen(event, item.id)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    }
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexDirection: "row" }}>
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                borderRadius: 0.5,          
                                bgcolor: item.colour,      
                                flexShrink: 0,
                            }}
                        />
                        <ListItemText primary={item.course_code} />
                    </Box>
                </ListItem>
                ))}
                <Button
                    variant="contained"
                    onClick={() => navigate("/addclass", {state: {classInfo : createEmptyCourse ()}})}
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
                    {t("Add Class")}
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
                <MenuItem onClick={handleEdit}>{t("Edit")}</MenuItem>
                <MenuItem onClick={handleDelete}>{t("Delete")}</MenuItem>
            </Menu>

        </Box>
    );
}

export default ManageClass;