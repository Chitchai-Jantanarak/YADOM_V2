"use client"

import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import NavBar2 from "./NavBar2"
import { authService } from "../../services/authService"

const UserLayout = () => {
  const navigate = useNavigate()

  // Check if user is authenticated
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-white p-0 m-0 flex-col">
      {/* NavBar2 for navigation */}
      <NavBar2 />

      {/* Main content area with proper margin */}
      <div className="flex-1 bg-white pt-16 pb-16 md:pb-0">
        {/* Main content with padding */}
        <div className="p-0 m-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserLayout

