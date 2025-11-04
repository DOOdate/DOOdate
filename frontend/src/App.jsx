import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import Login from './login.jsx';
import Home from "./home.jsx";
import AddSyllabus from "./addsyllabus.jsx";
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
        fontFamily: localStorage.getItem('font') ?? 'Roboto'
      }
    });
  }, [counter]);

  React.useEffect(() => {
    window.forceThemeRefresh = () => setCounter((c) => c + 1);
  })

  const { mode, setMode } = useColorScheme();
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
          </Routes>
          <NavbarConditional />
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  )
}

export default App
