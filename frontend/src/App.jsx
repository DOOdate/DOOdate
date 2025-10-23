import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React from 'react';
import Login from './login.jsx';
import Home from "./home.jsx";
import AddSyllabus from "./addsyllabus.jsx";
import Settings from "./settings.jsx";
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
            main: '#000000',
            light: '#DADADA',
            secondary: '#1A1A1A'
          },
        },
      },
      light: {
        palette: {
          primary: {
            main: '#FFFFFF',
            light: '#EEEEEE',
            secondary: '#F1F1F1'
          },
        },
      },
    },
  });
  const { mode, setMode } = useColorScheme();
  const [value, setValue] = useState(0);
  const pages = ['/home', '/addsyllabus', '/settings']
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
        <Navbar />
      </BrowserRouter>
      
    </ThemeProvider>
  )
}

export default App
