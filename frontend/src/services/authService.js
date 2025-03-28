import api from "./api"

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
}

export const ORDER_STATUS = {
  WAITING: "WAITING",
  PENDING: "PENDING",
  CANCELED: "CANCELED",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
}

const ENDPOINTS = {
  REGISTER: "/api/users/register",
  LOGIN: "/api/users/login",
  PROFILE: "/api/users/profile",
}

export const hasRole = (user, requiredRoles) => {
  if (!user) return false
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role)
  }
  return user.role === requiredRoles
}

// Mock function for development
export const getMockCurrentUser = () => {
  // First try to get from localStorage (for real auth)
  const user = localStorage.getItem("user")
  if (user) return JSON.parse(user)

  // For development, return a mock user with OWNER role
  return {
    id: 1,
    name: "น้องกฤกฤ",
    email: "admin@example.com",
    role: ROLES.OWNER, // Change to ADMIN or CUSTOMER to test different roles
    loginAt: new Date().toISOString(),
  }
}

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, { email, password })

      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          }),
        )
      }

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get(ENDPOINTS.PROFILE)
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put(ENDPOINTS.PROFILE, userData)
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  // Check if user has required role
  hasRole: (user, requiredRoles) => {
    return hasRole(user, requiredRoles)
  },

  // Get mock user for development
  getMockCurrentUser: () => {
    return getMockCurrentUser()
  },
}

// For backward compatibility
export const getCurrentUser = authService.getCurrentUser

