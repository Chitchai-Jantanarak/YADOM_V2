"use client"
import { Link, useLocation } from "react-router-dom"
import { User, ShoppingBag, Settings, LogOut, Home } from "lucide-react"
import { authService } from "../../services/authService"

const SidebarUser = () => {
  const location = useLocation()
  const currentUser = authService.getCurrentUser()

  const isActive = (path) => {
    return location.pathname === path ? "bg-primary text-white" : "hover:bg-gray-100"
  }

  const handleLogout = () => {
    authService.logout()
    window.location.href = "/login"
  }

  return ( <></>
    // <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
    //   <div className="p-4 border-b border-gray-200">
    //     <div className="flex items-center space-x-3">
    //       <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
    //         {currentUser?.name?.charAt(0) || "U"}
    //       </div>
    //       <div>
    //         <h3 className="font-medium">{currentUser?.name || "User"}</h3>
    //         <p className="text-xs text-gray-500">{currentUser?.email || ""}</p>
    //       </div>
    //     </div>
    //   </div>

    //   <nav className="p-4">
    //     <ul className="space-y-2">
    //       <li>
    //         <Link to="/" className={`flex items-center space-x-3 p-2 rounded-md ${isActive("/")}`}>
    //           <Home className="w-5 h-5" />
    //           <span>Home</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/user/settings"
    //           className={`flex items-center space-x-3 p-2 rounded-md ${isActive("/user/settings")}`}
    //         >
    //           <User className="w-5 h-5" />
    //           <span>Profile</span>
    //         </Link>
    //       </li>
    //       {/* <li>
    //         <Link
    //           to="/user/orders"
    //           className={`flex items-center space-x-3 p-2 rounded-md ${isActive("/user/orders")}`}
    //         >
    //           <ShoppingBag className="w-5 h-5" />
    //           <span>Orders</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/user/settings"
    //           className={`flex items-center space-x-3 p-2 rounded-md ${isActive("/user/settings")}`}
    //         >
    //           <Settings className="w-5 h-5" />
    //           <span>Settings</span>
    //         </Link>
    //       </li> */}
    //       <li>
    //         <button
    //           onClick={handleLogout}
    //           className="flex items-center space-x-3 p-2 rounded-md text-red-500 hover:bg-red-50 w-full text-left"
    //         >
    //           <LogOut className="w-5 h-5" />
    //           <span>Logout</span>
    //         </button>
    //       </li>
    //     </ul>
    //   </nav>
    // </div>
  )
}

export default SidebarUser

