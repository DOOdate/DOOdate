import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarIcon from '../assets/calendar-icon.svg';
import AddIcon from '../assets/plus-icon.svg';
import SettingsIcon from '../assets/settings-icon.svg';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useColorScheme  } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useUI } from '../uiContext.jsx';

let globalnavvalue = 0;

function Navbar() {
    const { t } = useTranslation();
    const [value, setValue] = useState(globalnavvalue);
    const pages = ['../home', '../addsyllabus', '../settings'];
    const navigate = useNavigate();
    const { mode, setMode } = useColorScheme();
    let prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const { flash, setFlash } = useUI();
    return (
        <>
        <BottomNavigation
          showLabels
          className="navbar"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            globalnavvalue = newValue
            navigate(pages[newValue]);
          }}
        >
          {/* awful styling */}
          <BottomNavigationAction aria-label={t('CalendarAria')} label={t('Calendar')} icon={<img src={CalendarIcon} className="navbar-icon" style={{filter: `invert(${mode === "system" ? prefersDark ? 1 : 0 : mode === "dark" ? 1 : 0})`}} />} />
          <BottomNavigationAction aria-label={t('AddClassAria')} label={t('Add Class')} icon={<img src={AddIcon} className="navbar-icon" style={{filter: `invert(${mode === "system" ? prefersDark ? 1 : 0 : mode === "dark" ? 1 : 0})`}}/>} />
          <BottomNavigationAction aria-label={t('SettingsAria')} label={t('Settings')} icon={<img src={SettingsIcon} className="navbar-icon" style={{filter: `invert(${mode === "system" ? prefersDark ? 1 : 0 : mode === "dark" ? 1 : 0})`}} />} />
        </BottomNavigation>
        <Snackbar
          open={!!flash?.open}
          autoHideDuration={4000}
          onClose={() => setFlash(f => ({ ...f, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setFlash(f => ({ ...f, open: false }))} severity={flash?.severity || 'info'} sx={{ width: '100%' }}>
            {flash?.message}
          </Alert>
        </Snackbar>
        </>
    )   
}

export default Navbar