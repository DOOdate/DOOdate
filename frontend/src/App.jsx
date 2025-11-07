import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import Login from './login.jsx';
import Home from "./home.jsx";
import AddSyllabus from "./addsyllabus.jsx";
import AddClass from "./addclass.jsx";
import Settings from "./settings.jsx";
import { UIProvider } from './uiContext.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled, useColorScheme  } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "./components/Navbar.jsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "@fontsource/opendyslexic/400.css";
import "@fontsource/opendyslexic/700.css"
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {

  const [counter, setCounter] = React.useState('0')

  const theme = React.useMemo(() => {
    return createTheme({
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
      typography: {
        fontFamily: localStorage.getItem('font') ?? 'Roboto',
        fontSize: parseInt(localStorage.getItem('fontsize') ?? 14)
      }
    });
  }, [counter]);

  React.useEffect(() => {
    window.forceThemeRefresh = () => setCounter((c) => c + 1);
  })

  const { mode, setMode } = useColorScheme();
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  let darkMode = false
  if(mode !== 'system' && mode !== undefined){
    if(mode == 'dark'){
      darkMode = true
    }
  } else{
    if(mode === 'system'){
      darkMode = prefersDark
    } else if (localStorage.getItem('mui-mode')!== null){
      darkMode = (localStorage.getItem('mui-mode') == 'dark')
    } else{
      darkMode = prefersDark
    }
  }
  let metaTheme = document.querySelector('meta[name="theme-color"]'); 
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', darkMode ? '#000000' : '#ffffff');
  
  const [value, setValue] = useState(0);
  const pages = ['/home', '/addsyllabus', '/settings']
  function NavbarConditional(){
    const location = useLocation();
    return location.pathname !== '/' ? <Navbar /> : null;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/addsyllabus" element={<AddSyllabus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path='/addclass' element={<AddClass />} />
          </Routes>
          <NavbarConditional />
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  )
}

export default App
