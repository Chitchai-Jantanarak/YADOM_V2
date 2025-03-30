"use client"

import { useEffect } from "react"
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

    useEffect(() => {
      const isAuthenticated = authService.isAuthenticated()
      const currentUser = authService.getCurrentUser()

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
    }, [navigate, location])

    return <Component {...props} />
  }

  return AuthProtectedComponent
}

export default withAuthProtection

