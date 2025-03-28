"use client"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Login from "../pages/Login.jsx"
import Starter from "../pages/Starter.jsx"
import Register from "../pages/Register.jsx"
import PasswordForgot from "../pages/PasswordForgot.jsx"
import PasswordReset from "../pages/PasswordReset.jsx"
import Shop_Accessory from "../pages/Shop_Accessory.jsx"
import Shop_Product from "../pages/Shop_Product.jsx"
import Shop_Product_Detail from "../pages/Shop_Product_Detail.jsx"
import Shop_Selection from "../pages/Shop_Selection.jsx"

// Protected Pages
import Dashboard from "../pages/Dashboard.jsx"
import Unauthorized from "../pages/Unauthorized.jsx"

// Auth Components
import ProtectedRoute from "../utils/ProtectedRoute.jsx"
import { ROLES } from "../services/authService.js"

// Styles
import "../styles/App.css"

function App() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Protected Dashboard Route (Home Page) */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/Starter" element={<Starter />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/PasswordForgot" element={<PasswordForgot />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />

          {/* Shop Routes */}
          <Route path="/product" element={<Shop_Selection />} />
          <Route path="/Shop_Product" element={<Shop_Product />} />
          <Route path="/Shop_Product/:productId" element={<Shop_Product_Detail />} />
          <Route path="/Shop_Accessory" element={<Shop_Accessory />} />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forbidden" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App

