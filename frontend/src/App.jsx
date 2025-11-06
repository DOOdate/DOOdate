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
