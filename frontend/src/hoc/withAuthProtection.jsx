"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService, ROLES } from "../services/authService"

/**
 * Higher-order component that handles authentication redirections
 * @param {React.Component} Component - The component to wrap
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirects unauthenticated users to login
 * @param {boolean} options.redirectAuthenticated - If true, redirects authenticated users based on role
 */
const withAuthProtection = (Component, { requireAuth = false, redirectAuthenticated = false } = {}) => {
  const AuthProtectedComponent = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
      // Get a fresh check of authentication status
      const isAuthenticated = authService.isAuthenticated()
      const currentUser = authService.getCurrentUser()

      // Check for a recent logout flag in sessionStorage
      const recentlyLoggedOut = sessionStorage.getItem("recentlyLoggedOut") === "true"

      // If user just logged out, allow them to see login/register pages
      if (recentlyLoggedOut && redirectAuthenticated) {
        // Clear the flag after using it
        sessionStorage.removeItem("recentlyLoggedOut")
        setAuthChecked(true)
        return
      }

      // Case 1: Require authentication (protected routes)
      if (requireAuth && !isAuthenticated) {
        // Save the current location for potential redirect back after login
        const returnPath = location.pathname
        navigate("/login", {
          replace: true,
          state: { returnPath },
        })
        return
      }

      // Case 2: Redirect authenticated users (login/register pages)
      if (redirectAuthenticated && isAuthenticated && currentUser) {
        // Get the return path from location state if available
        const returnPath = location.state?.returnPath || "/"

        // Determine redirect path based on user role
        let redirectPath

        if (authService.hasRole(currentUser, [ROLES.ADMIN, ROLES.OWNER])) {
          // Admin and Owner users go to dashboard main
          redirectPath = "/dashboard/main"
        } else {
          // Regular customers go to previous page or home
          redirectPath = returnPath
        }

        navigate(redirectPath, { replace: true })
        return
      }

      setAuthChecked(true)
    }, [navigate, location])

    // Don't render anything until auth check is complete
    if (!authChecked && (requireAuth || redirectAuthenticated)) {
      return null // Or a loading spinner
    }

    return <Component {...props} />
  }

  return AuthProtectedComponent
}

export default withAuthProtection

