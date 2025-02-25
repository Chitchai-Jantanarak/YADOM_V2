import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx'
import Starter from '../pages/Starter.jsx';
import Register from '../pages/Register.jsx'
import PasswordForgot from '../pages/PasswordForgot.jsx';
import PasswordReset from '../pages/PasswordReset.jsx';

import '../styles/App.css';

function App() {
  const location = useLocation();

  return (
    <>
      {/* Router and routes */}
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route index element={<Home />} />
            <Route path="/Starter" element={<Starter />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/PasswordForgot" element={<PasswordForgot />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />
          </Routes>
        </AnimatePresence>
    </>
  );
};

export default App;