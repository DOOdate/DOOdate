import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react'
import Login from './login.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
