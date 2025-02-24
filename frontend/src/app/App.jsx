import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import PasswordForgot from '../pages/PasswordForgot.jsx';
import PasswordReset from '../pages/PasswordReset.jsx';

import '../styles/App.css';

const App = () => {

  return (
    <>
      {/* Router and routes */}
      <Router>
        <AnimatePresence>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/PasswordForgot" element={<PasswordForgot />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </>
  );
};

export default App;