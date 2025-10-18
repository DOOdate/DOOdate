import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react'
import Login from './login.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import CalendarIcon from "./assets/calendar-icon.svg"
import AddIcon from "./assets/plus-icon.svg"
import SettingsIcon from "./assets/settings-icon.svg"

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  const [value, setValue] = useState(0);
  const pages = ['/home', '/addsyllabus', '/settings']
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(pages[newValue]);
          }}
        >
          <BottomNavigationAction label="Calendar" icon={<img src={CalendarIcon} />} />
          <BottomNavigationAction label="Add Class" icon={<img src={AddIcon} />} />
          <BottomNavigationAction label="Settings" icon={<img src={SettingsIcon} />} />
        </BottomNavigation>
    </ThemeProvider>
  )
}

export default App
