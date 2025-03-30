import { Navigate, useLocation } from "react-router-dom"
import { authService } from "../services/authService"

/**
 * Component that protects routes requiring authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array<string>} props.requiredRoles - Optional roles required to access this route
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()
  const currentUser = authService.getCurrentUser()

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Save the current location for potential redirect back after login
    return <Navigate to="/login" state={{ returnPath: location.pathname }} replace />
  }

  // If roles are specified, check if user has required role
  if (requiredRoles.length > 0 && currentUser) {
    const hasRequiredRole = authService.hasRole(currentUser, requiredRoles)
    if (!hasRequiredRole) {
      // Redirect to home page if not admin or owner
      return <Navigate to="/" replace />
    }
  }

  // User is authenticated and has required role (if specified)
  return children
}

export default ProtectedRoute

