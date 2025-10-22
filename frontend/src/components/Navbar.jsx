import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarIcon from '../assets/calendar-icon.svg';
import AddIcon from '../assets/plus-icon.svg';
import SettingsIcon from '../assets/settings-icon.svg';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [value, setValue] = useState(0);
    const pages = ['../home', '../addsyllabus', '../settings'];
    const navigate = useNavigate();
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
          <BottomNavigationAction label="Calendar" icon={<img src={CalendarIcon} class="navbar-icon" />} />
          <BottomNavigationAction label="Add Class" icon={<img src={AddIcon} class="navbar-icon" />} />
          <BottomNavigationAction label="Settings" icon={<img src={SettingsIcon} class="navbar-icon" />} />
        </BottomNavigation>
    )   
}

export default Navbar