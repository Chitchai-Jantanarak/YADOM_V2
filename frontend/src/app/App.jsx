import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx'
import Starter from '../pages/Starter.jsx';
import Register from '../pages/Register.jsx'
import PasswordForgot from '../pages/PasswordForgot.jsx';
import PasswordReset from '../pages/PasswordReset.jsx';
// import Product from '../pages/Product.jsx'
import Shop_Accessory from '../pages/Shop_Accessory.jsx'
import Shop_Product from '../pages/Shop_Product.jsx'
import Shop_Product_Detail from '../pages/Shop_Product_Detail.jsx'
import Shop_Selection from '../pages/Shop_Selection.jsx';

import '../styles/App.css';

function App() {
  const location = useLocation();

  return (
    <>
      {/* Router and routes */}
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            {/* !TODO : REMARK THE TEST PAGE */}
            <Route path="/" element={<Shop_Product />} /> 

            <Route path="/Starter" element={<Starter />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/PasswordForgot" element={<PasswordForgot />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />

            <Route path="/Shop_Product" element={<Shop_Product />} />
            <Route path="/Shop_Product/:productId" element={<Shop_Product_Detail />} />
          </Routes>
        </AnimatePresence>
    </>
  );
};

export default App;