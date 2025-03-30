"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, Home, Package, Users, Settings } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { authService, ROLES } from "../../services/authService"
import UserAvatar from "../ui/UserAvatar"

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Get current user from auth service
  const currentUser = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  // Determine user role display text
  const getRoleDisplay = () => {
    if (!currentUser) return "Guest"

    switch (currentUser.role) {
      case ROLES.OWNER:
        return "Owner"
      case ROLES.ADMIN:
        return "Admin"
      case ROLES.CUSTOMER:
        return "Customer"
      default:
        return currentUser.role
    }
  }

  return (
    <>
      <header className="bg-white h-24 fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center">
          <button
            className="p-2 rounded-full hover:bg-gray-100 md:hidden mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold"></h1>
        </div>

        <div className="flex items-center gap-4">

          <div className="h-6 border-l border-gray-300 mx-2 hidden md:block"></div>

          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <LogOut className="h-5 w-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-40 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                &times;
              </button>
            </div>

            {currentUser && (
              <div className="p-4 border-b mb-4">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <UserAvatar user={currentUser} size="lg" />
                  </div>
                  <div>
                    <h3 className="font-medium">{currentUser.name}</h3>
                    <p className="text-sm text-blue-500">{getRoleDisplay()}</p>
                  </div>
                </div>
              </div>
            )}

            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    <span>Product</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customers"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <span>Customer</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Setting</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}