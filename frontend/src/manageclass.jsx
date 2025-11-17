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

function ManageClass(){

    const [items, setItems] = React.useState([]);
    const [classInfo, setSendData] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {

        const loadItems = async () => {
            const res = await axios.get("/api/courses/0")
            setItems(res.data);
        };
        loadItems();
    }, []);

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
            setSendData(await axios.get(`/api/courses/${selectedItemId}/`));
            navigate("/addclass", {state: {classInfo}});

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
            // add bottom padding so fixed bottom navbar doesn't cover the button
            pb: 8,
        }}
        >
            <Typography variant="h4">Your Classes</Typography>

            <List>
                {items.map(item => (
                <ListItem
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
                    <ListItemText primary={item.label} />
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
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

        </Box>
    );
}

export default ManageClass;