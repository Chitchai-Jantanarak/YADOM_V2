"use client"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Home from "../pages/Home.jsx"
import Login from "../pages/Login.jsx"
import Starter from "../pages/Starter.jsx"
import Register from "../pages/Register.jsx"
import PasswordForgot from "../pages/PasswordForgot.jsx"
import PasswordReset from "../pages/PasswordReset.jsx"
import ProductDetail from "../pages/ProductDetails.jsx"
import ProductView from "../pages/ProductView.jsx"
import Shop_Accessory from "../pages/Shop_Accessory.jsx"
import Shop_Product from "../pages/Shop_Product.jsx"
import Shop_Selection from "../pages/Shop_Selection.jsx"
import ModelConfigurator from "../pages/ModelConfigurator.jsx"
import AboutSecent from "../pages/AboutSecent.jsx"
import AboutUs from "../pages/AboutUs.jsx"
import Contact from "../pages/Contact.jsx"

// Protected Pages
import DashboardLayout from "../components/layout/DashboardLayout.jsx"
import DashboardMain from "../pages/dashboard/DashboardMain.jsx"
import DashboardAnalytics from "../pages/dashboard/DashboardAnalytics.jsx"
import DashboardCustomers from "../pages/dashboard/DashboardCustomers.jsx"
import DashboardOrders from "../pages/dashboard/DashboardOrders.jsx"
import DashboardProduct from "../pages/dashboard/DashboardProduct.jsx"
import DashboardSettings from "../pages/dashboard/DashboardSettings.jsx"

// Configurator Customer Pages
import UserLayout from "../components/layout/UserLayout.jsx"
import UserSettings from "../pages/user/UserSettings.jsx"
import UserCart from "../pages/user/UserCart.jsx"
import UserCheckout from "../pages/user/UserCheckout.jsx"
import UserPayment from "../pages/user/UserPayment.jsx"
import OrderConfirmation from "../pages/user/OrderConfirmation.jsx"
import OrderSummary from "../pages/user/OrderSummary.jsx"

import Unauthorized from "../pages/Unauthorized.jsx"
import Forbidden from "../pages/Forbidden.jsx"

// Auth Components
import ProtectedRoute from "../hoc/ProtectedRoute.jsx"
import { ROLES } from "../services/authService.js"

// Styles
import "../styles/App.css"

function App() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Starter" element={<Starter />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/PasswordForgot" element={<PasswordForgot />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />
          <Route path="/AboutSecent" element={<AboutSecent />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Contact" element={<Contact />} />

          {/* User Configurator Route */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard route */}
            <Route index element={<Navigate to="/user/settings" replace />} />

            <Route 
              path="settings"
              element={
                <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                  <UserSettings />
                </ProtectedRoute>
              }
            />

            <Route 
              path="cart"
              element={
                <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                  <UserCart />
                </ProtectedRoute>
              }
            />

            <Route
              path="checkout"
              element={
                <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                  <UserCheckout />
                </ProtectedRoute>
              }
            />

            <Route
              path="payment/:orderId"
              element={
                <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                  <UserPayment />
                </ProtectedRoute>
              }
            />

            <Route
              path="orders/:orderId"
              element={
                <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route 
            path="order/:orderId"
            element={
              <ProtectedRoute requiredRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.OWNER]}>
                <OrderSummary />
              </ProtectedRoute>
            }
          />



          {/* Shop Routes */}
          <Route path="/product" element={<Shop_Selection />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/product/:productType/:productid" element={<ModelConfigurator />} /> 
          <Route path="/Shop" element={<Shop_Selection />} />
          <Route path="/Shop_Product" element={<Shop_Product />} />
          <Route path="/Shop_Accessory" element={<Shop_Accessory />} />

          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.OWNER]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard route */}
            <Route index element={<Navigate to="/dashboard/main" replace />} />
            
            {/* Main dashboard - accessible to all authenticated users */}
            <Route path="main" element={<DashboardMain />} />
            
            <Route 
              path="analytics"
              element={
                <ProtectedRoute requiredRoles={[ROLES.OWNER]}>
                  <DashboardAnalytics />
                </ProtectedRoute>
              }
            />

            <Route 
              path="customers"
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <DashboardCustomers />
                </ProtectedRoute>
              }
            />

            <Route 
              path="orders" 
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <DashboardOrders />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/dashboard/products"
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <DashboardProduct />
                </ProtectedRoute>}
            />
            <Route
              path="/dashboard/products/:id"
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <ProductDetail />
                </ProtectedRoute>}
            />
            
            <Route 
              path="settings"
              element={
                <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
                  <DashboardSettings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Forbidden />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App

