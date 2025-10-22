import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react'
import Login from './login.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#FFFFFF',
          light: '#DADADA',
          secondary: '#262626'
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: '#000000',
          light: '#EEEEEE'
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
