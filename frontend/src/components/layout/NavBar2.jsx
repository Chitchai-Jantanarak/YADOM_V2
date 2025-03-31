"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, LogOut, Settings, ShoppingBag, HelpCircle, Home, ChevronDown, Menu, X } from "lucide-react"

import Arrow from "../ui/Arrow"
import Logo from "../ui/Logo"
import UserAvatar from "../ui/UserAvatar"
import { authService, ROLES } from "../../services/authService"
import { getUserImageUrl, getUiAvatarUrl } from "../../utils/imageUtils"
import { debugImageLoading } from "../../utils/debugUtils"
import imageService from "../../services/imageService"

const NavBar2 = () => {
  const navigate = useNavigate()
  // State for navbar visibility
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollTimer, setScrollTimer] = useState(null)
  const [user, setUser] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [avatarError, setAvatarError] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  // Track which mobile menu items are expanded
  const [expandedItems, setExpandedItems] = useState({})

  // Check if user is authenticated and load user image
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
            debugImageLoading("NavBar-API", result.url, currentUser)
          } else {
            // Fall back to the utility function
            const url = getUserImageUrl(currentUser)
            setImageUrl(url)
            debugImageLoading("NavBar-Fallback", url, currentUser)
          }
        } catch (error) {
          console.error("Error loading profile image:", error)
          setAvatarError(true)
        }
      }
    }

    loadUserData()

    // Listen for storage events (login/logout)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newUser)
          setForceUpdate((prev) => prev + 1)
          setAvatarError(false)

          if (newUser && newUser.id) {
            // Update image URL when user changes
            const url = getUserImageUrl(newUser)
            setImageUrl(url)
            debugImageLoading("NavBar-Storage", url, newUser)
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Handle image error
  const handleImageError = (e) => {
    console.log("NavBar image error:", e.target.src)
    setAvatarError(true)
    e.target.src = getUiAvatarUrl(user?.name)
  }

  const menuItems = [
    {
      name: "PRODUCT",
      link: "/Shop_selection",
      subHead: true,
      icon: ShoppingBag,
      clickable: false, // PRODUCT is not clickable, only toggles submenu like ABOUT
      subHeading: [
        { name: "INHALERS", link: "/Shop_Product" },
        { name: "ACCESSORIES", link: "/Shop_Accessory" },
      ],
    },
    {
      name: "ABOUT",
      link: "/aboutus",
      subHead: true,
      icon: HelpCircle,
      clickable: false, // ABOUT is not clickable, only toggles submenu
      subHeading: [
        { name: "About Secent", link: "/AboutSecent" },
        { name: "About Us", link: "/AboutUs" },
      ],
    },
    { name: "CONTACT", link: "/contact", subHead: false, icon: User },
    { name: "CART", link: "/cart", subHead: false, icon: ShoppingBag },
  ]

  // Only add LOGIN to menu items if user is not authenticated
  if (!user) {
    menuItems.push({ name: "LOGIN", link: "/starter", subHead: false, icon: User })
  }

  const menuItemsLeft = menuItems.filter((item) => item.subHead)
  const menuItemsRight = menuItems.filter((item) => !item.subHead)

  // Handle scroll behavior for navbar
  useEffect(() => {
    let timer

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (timer) {
        clearTimeout(timer)
      }

      if (currentScrollY > lastScrollY && visible && currentScrollY > 100) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY - 10 && !visible) {
        setVisible(true)
      }

      timer = setTimeout(() => {
        setVisible(true)
      }, 7000)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [lastScrollY, visible])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const handleLinkClick = (hash) => {
    // If hash is provided, scroll to that element
    if (hash) {
      // Allow time for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        } else {
          // If no element with this id, just scroll to top
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      }, 100)
    } else {
      // Default behavior - scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    // Close mobile menu if open
    setIsMobileMenuOpen(false)
  }

  // Handle user menu toggle
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Toggle mobile submenu (accordion style)
  const toggleMobileSubmenu = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false)
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen, isMobileMenuOpen])

  // Handle logout
  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    navigate("/")
  }

  // Common link style for both left and right menu items
  const menuLinkStyle = "capitalize p-1 group-hover:text-tertiary relative overflow-hidden select-none"
  const menuItemStyle =
    "flex items-center px-2 py-6 border-transparent group transition-all duration-300 ease-in-out hover:scale-110"

  return (
    <div
      className={`nav sticky w-full top-0 z-[90] transition-transform duration-300 p-3 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ backgroundColor: "transparent" }}
    >
      <div className="px-[5%] bg-white rounded-lg">
        <div className="grid grid-cols-3 py-4 justify-between items-center outline-black/5">
          {/* Section - L */}
          <div className="flex items-center space-x-12">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden mobile-menu-button flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-tertiary hover:bg-gray-100 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>

            <nav className="hidden md:block">
              <ul className="flex relative space-x-8 tracking-widest select-none">
                {menuItemsLeft.map((item, index) => (
                  <li key={index} className={menuItemStyle}>
                    <Link to={item.link || "#"} className={menuLinkStyle} onClick={() => handleLinkClick()}>
                      <span className="relative z-10 select-none">{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-tertiary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                    </Link>
                    {item.subHead && <Arrow className="group-hover:rotate-180 transition-transform duration-300" />}

                    {item.subHead && item.subHeading.length > 0 && (
                      <div className="absolute top-full border-t-2 border-black/5 -mx-2 bg-white shadow-lg p-4 space-y-2 hidden group-hover:block transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-lg transform origin-top scale-95 group-hover:scale-100 select-none">
                        {item.subHeading.map((sub, idx) => {
                          // Extract hash if present in the link
                          const hasHash = sub.link.includes("#")
                          const hash = hasHash ? sub.link.split("#")[1] : null

                          return (
                            <Link
                              key={idx}
                              to={sub.link}
                              className="text-sm p-4 text-black block hover:text-tertiary rounded-md transition-all duration-200 hover:scale-105 transform origin-left select-none"
                              onClick={() => handleLinkClick(hash)}
                            >
                              {sub.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Section - M */}
          {/* Logo */}
          <Link
            className="flex h-full w-full items-center justify-center transition-all duration-300 hover:scale-110 select-none"
            to={"/"}
            onClick={() => handleLinkClick()}
          >
            <Logo />
          </Link>

          {/* Section - R */}
          <div className="flex justify-end items-center space-x-12">
            <nav className="hidden md:block">
              <ul className="flex relative space-x-8 tracking-widest select-none">
                {menuItemsRight.map((item, index) => (
                  <li key={index} className={menuItemStyle}>
                    <Link to={item.link} className={menuLinkStyle} onClick={() => handleLinkClick()}>
                      <span className="relative z-10 select-none">{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-tertiary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                    </Link>
                  </li>
                ))}

                {/* User Avatar and Dropdown (only shown when authenticated) */}
                {user && (
                  <li className="user-menu-container relative flex items-center px-2 py-6 border-transparent transition-all duration-300 ease-in-out">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-2 focus:outline-none"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-tertiary hover:scale-110 transition-transform duration-300">
                        {avatarError ? (
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
                          <UserAvatar
                            user={user}
                            size="md"
                            key={`user-avatar-${forceUpdate}`}
                            onImageError={handleImageError}
                          />
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-[110] py-2">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                              {avatarError ? (
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
                                  key={`dropdown-img-${forceUpdate}-${imageUrl}`}
                                />
                              ) : (
                                <UserAvatar
                                  user={user}
                                  size="lg"
                                  key={`dropdown-avatar-${forceUpdate}`}
                                  onImageError={handleImageError}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              {user.tel && <p className="text-xs text-gray-500 truncate">{user.tel}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          {/* Dashboard (for admin/owner only) */}
                          {user.role && (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) && (
                            <Link
                              to="/dashboard/main"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Home className="h-4 w-4" />
                              <span>Dashboard</span>
                            </Link>
                          )}

                          {/* Profile Settings */}
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>My Profile</span>
                          </Link>

                          {/* Account Settings */}
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Account Settings</span>
                          </Link>

                          {/* Orders */}
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            <span>My Orders</span>
                          </Link>

                          {/* Help & Support */}
                          <Link
                            to="/help"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <HelpCircle className="h-4 w-4" />
                            <span>Help & Support</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="py-1 border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>
            </nav>

            {/* Mobile User Avatar (only shown when authenticated) */}
            {user && (
              <div className="md:hidden user-menu-container relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-tertiary hover:scale-110 transition-transform duration-300">
                    {avatarError ? (
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
                        key={`mobile-img-${forceUpdate}-${imageUrl}`}
                      />
                    ) : (
                      <UserAvatar
                        user={user}
                        size="md"
                        key={`mobile-avatar-${forceUpdate}`}
                        onImageError={handleImageError}
                      />
                    )}
                  </div>
                </button>

                {/* Mobile User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[110] py-2">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          {avatarError ? (
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
                              key={`mobile-dropdown-img-${forceUpdate}-${imageUrl}`}
                            />
                          ) : (
                            <UserAvatar
                              user={user}
                              size="lg"
                              key={`mobile-dropdown-avatar-${forceUpdate}`}
                              onImageError={handleImageError}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items - Same as desktop */}
                    <div className="py-1">
                      {user.role && (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) && (
                        <Link
                          to="/dashboard/main"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/help"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="py-1 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu with collapsible submenus */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-[100] bg-white flex flex-col"
          style={{ height: "100vh", width: "100vw" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full bg-white shadow-sm text-gray-600 hover:text-tertiary focus:outline-none"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          {/* Main Menu with collapsible submenus */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* User Profile Section (if authenticated) */}
            {user && (
              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-tertiary">
                    {avatarError ? (
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
                        key={`mobile-menu-img-${forceUpdate}-${imageUrl}`}
                      />
                    ) : (
                      <UserAvatar
                        user={user}
                        size="lg"
                        key={`mobile-menu-avatar-${forceUpdate}`}
                        onImageError={handleImageError}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => handleLinkClick()}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Menu Items with collapsible submenus */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm">
                  {item.subHead ? (
                    <div className="relative">
                      {/* Header that toggles submenu */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleMobileSubmenu(index)}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-300 ${expandedItems[index] ? "rotate-180" : ""}`}
                        />
                      </div>

                      {/* Submenu */}
                      <div
                        className={`bg-gray-50 overflow-hidden transition-all duration-300 ${
                          expandedItems[index] ? "max-h-96 py-2" : "max-h-0"
                        }`}
                      >
                        <ul className="pl-4 space-y-2">
                          {item.subHeading.map((sub, idx) => (
                            <li key={idx}>
                              <Link
                                to={sub.link}
                                className="flex items-center gap-2 p-3 rounded-md hover:bg-white transition-colors"
                                onClick={() => handleLinkClick()}
                              >
                                <span className="w-2 h-2 bg-tertiary rounded-full"></span>
                                <span>{sub.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    // Regular menu item without submenu
                    <Link
                      to={item.link}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                      onClick={() => handleLinkClick()}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Admin Access Section */}
            {user && user.role && (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">Admin Access</h3>
                <Link
                  to="/dashboard/main"
                  className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => handleLinkClick()}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              <p>© 2023 Yadom Cooperations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar2

