import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarIcon from '../assets/calendar-icon.svg';
import AddIcon from '../assets/plus-icon.svg';
import SettingsIcon from '../assets/settings-icon.svg';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useColorScheme  } from "@mui/material/styles";

function Navbar() {
    const [value, setValue] = useState(0);
    const pages = ['../home', '../addsyllabus', '../settings'];
    const navigate = useNavigate();
    const { mode, setMode } = useColorScheme();
    return (
        <BottomNavigation
          showLabels
          className="navbar"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(pages[newValue]);
          }}
        >
          <BottomNavigationAction label="Calendar" icon={<img src={CalendarIcon} className="navbar-icon" style={{filter: `invert(${mode === "dark" ? 1 : 0})`}} />} />
          <BottomNavigationAction label="Add Class" icon={<img src={AddIcon} className="navbar-icon" style={{filter: `invert(${mode === "dark" ? 1 : 0})`}}/>} />
          <BottomNavigationAction label="Settings" icon={<img src={SettingsIcon} className="navbar-icon" style={{filter: `invert(${mode === "dark" ? 1 : 0})`}} />} />
        </BottomNavigation>
    )   
}

export default Navbar