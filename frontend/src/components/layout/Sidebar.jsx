"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, Settings, BarChart2, ShoppingBag } from "lucide-react"
import { authService, ROLES, hasRole } from "../../services/authService"
import UserAvatar from "../ui/UserAvatar"
import Logo from "../ui/Logo"
import { useEffect, useRef, useState } from "react"
import { getUiAvatarUrl, getUserImageUrl } from "../../utils/imageUtils"
import imageService from "../../services/imageService"

// Debugging console 
// import { debugImageLoading } from "../../utils/debugUtils"

export const Sidebar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const activeItemRef = useRef(null)
  const [user, setUser] = useState(null)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [avatarError, setAvatarError] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      // Get the authenticated user
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      setAvatarError(false)

      if (currentUser && currentUser.id) {
        try {
          // Try to get the image URL from the API
          const result = await imageService.getProfileImage(currentUser.id)
          if (result.success && result.url) {
            setImageUrl(result.url)
          //   debugImageLoading("Sidebar-API", result.url, currentUser)
          } else {
            // Fall back to the utility function
            const url = getUserImageUrl(currentUser)
            setImageUrl(url)
            // debugImageLoading("Sidebar-Fallback", url, currentUser)
          }
        } catch (error) {
          console.error("Error loading profile image:", error)
          setAvatarError(true)
        }
      }
    }

    loadUserData()

    // Set up event listener for storage changes (for when user data is updated)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newUser)
          setForceUpdate((prev) => prev + 1)
          setAvatarError(false)

          if (newUser && newUser.id) {
            // Update image URL when user changes
            const url = getUserImageUrl(newUser)
            setImageUrl(url)
            // debugImageLoading("Sidebar-Storage", url, newUser)
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Handle image error
  const handleImageError = (e) => {
    console.log("Sidebar image error:", e.target.src)
    setAvatarError(true)
    e.target.src = getUiAvatarUrl(user?.name)
  }

  // Define navigation items with role-based access and updated paths
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard/main",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Analytics",
      icon: BarChart2,
      path: "/dashboard/analytics",
      roles: [ROLES.OWNER], // Only owners can access analytics
    },
    {
      title: "Products",
      icon: Package,
      path: "/dashboard/products",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      path: "/dashboard/orders",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Customers",
      icon: Users,
      path: "/dashboard/customers",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
  ]

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => !item.roles || hasRole(user, item.roles))

  // Check if a route is active
  const isRouteActive = (path) => {
    // Exact match
    if (currentPath === path) return true

    // Special case for main dashboard
    if (path === "/dashboard/main" && (currentPath === "/dashboard" || currentPath === "/")) return true

    // Check if it's a sub-route (but not for the main dashboard to avoid highlighting it for all dashboard routes)
    if (path !== "/dashboard/main" && currentPath.startsWith(path)) return true

    return false
  }

  // Scroll active item into view when route changes
  useEffect(() => {
    if (activeItemRef.current) {
      // Scroll the active item into view with a smooth behavior
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentPath])

  return (
    <div className="bg-white h-screen w-72 fixed left-0 top-0 shadow-md z-20 hidden md:block overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
            {user &&
              (avatarError ? (
                <img
                  src={getUiAvatarUrl(user?.name) || "/placeholder.svg"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : imageUrl ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  key={`user-img-${forceUpdate}-${imageUrl}`}
                />
              ) : (
                <UserAvatar user={user} size="lg" key={`user-avatar-${forceUpdate}`} onImageError={handleImageError} />
              ))}
          </div>
          <div>
            <h5 className="text-lg font-bold">{user?.name || "User"}</h5>
            <p className="text-sm text-blue-500">{user?.role || "Guest"}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const active = isRouteActive(item.path)
            return (
              <li key={item.path} ref={active ? activeItemRef : null}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 p-3 rounded-md relative
                    transition-all duration-300 ease-in-out
                    ${
                      active
                        ? "bg-blue-50 text-blue-600 font-medium pl-4 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:pl-4"
                    }
                  `}
                >
                  {/* Left border indicator for active item */}
                  {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></span>}

                  <item.icon className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
                  <span>{item.title}</span>

                  {/* Right indicator for active item */}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* App info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-gray-500 border-t">
        <Logo />
        <p className="text-sm">Yadom cooperations</p>
      </div>
    </div>
  )
}

export default Sidebar

