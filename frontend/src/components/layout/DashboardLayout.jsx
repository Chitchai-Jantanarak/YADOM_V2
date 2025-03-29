import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { authService } from "../../services/authService"

const DashboardLayout = () => {
  const navigate = useNavigate()
  
  // Check if user is authenticated
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - fixed position */}
      <Sidebar />
      
      {/* Main content area with proper margin */}
      <div className="flex-1 ml-0 bg-white">
        {/* Header - fixed at top */}
        <Header />
        {/* Main content with padding */}
        <div className="pt-16 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout