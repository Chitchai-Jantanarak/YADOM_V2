import { Navigate, useLocation } from "react-router-dom"
import { authService, hasRole } from "../services/authService"

const ProtectedRoute = ({ children, requiredRoles }) => {
  const location = useLocation()

  // try to get the authenticated user
  let user = authService.getCurrentUser()

  // If no authenticated user, use mock for development
  if (!user && process.env.NODE_ENV === "development") {
    user = authService.getMockCurrentUser()
  }

  if (!user) {
    // Redirected to login pages if authenticated user is not found
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles && !hasRole(user, requiredRoles)) {
    // Forbidden access nor allowed role :>
    return <Navigate to="/forbidden" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

