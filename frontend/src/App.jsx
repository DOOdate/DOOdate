import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import Login from './login.jsx';
import Home from "./home.jsx";
import AddSyllabus from "./addsyllabus.jsx";
import Settings from "./settings.jsx";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled, useColorScheme  } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "./components/Navbar.jsx";
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const theme = createTheme({
    colorSchemes: {
      dark: {
        palette: {
          primary: {
            main: '#FFFFFF',
            light: '#DADADA',
            secondary: '#1A1A1A',
            base: '#000000'

          },
        },
      },
      light: {
        palette: {
          primary: {
            main: '#000000',
            light: '#EEEEEE',
            secondary: '#F1F1F1',
            base: '#FFFFFF'

          },
        },
      },
    },
  });
  const { mode, setMode } = useColorScheme();
  let darkMode = false
  console.log(mode)
  if(mode !== 'system' && mode !== undefined){
    if(mode === 'dark'){
      darkMode = true
    }
  } else{
    let prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
    darkMode = prefersDark
  }
  let metaTheme = document.querySelector('meta[name="theme-color"]'); 
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', darkMode ? '#000000' : '#ffffff');
  console.log(darkMode)
  const [value, setValue] = useState(0);
  const pages = ['/home', '/addsyllabus', '/settings']
  function NavbarConditional(){
    const location = useLocation();
    return location.pathname !== '/' ? <Navbar /> : null;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/addsyllabus" element={<AddSyllabus />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <NavbarConditional />
      </BrowserRouter>
      
    </ThemeProvider>
  )
}

export default App
