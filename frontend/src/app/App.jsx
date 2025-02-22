import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'

import '../styles/App.css';

const App = () => {
  return (
    <>
      {/* Router and routes */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;