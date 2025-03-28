import api from "./api"

// User roles
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
}

// API endpoints for authentication
const ENDPOINTS = {
  REGISTER: "/api/users/register",
  LOGIN: "/api/users/login",
  PROFILE: "/api/users/profile",
  FORGOT_PASSWORD: "/api/users/forgot-password",
  VERIFY_OTP: "/api/users/verify-otp",
  RESET_PASSWORD: "/api/users/reset-password",
}

// Check if user has required role
export const hasRole = (user, requiredRoles) => {
  if (!user) return false
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role)
  }
  return user.role === requiredRoles
}

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData)

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
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  // Get mock current user for development (only used if no real user is logged in)
  getMockCurrentUser: () => {
    if (process.env.NODE_ENV !== "production") {
      return {
        id: 1,
        name: "Development User",
        email: "dev@example.com",
        role: ROLES.ADMIN,
      }
    }
    return null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === "undefined") return false
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

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email })
      return response.data
    } catch (error) {
      console.error("Error requesting password reset:", error)
      throw error
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp, token) => {
    try {
      const response = await api.post(ENDPOINTS.VERIFY_OTP, { email, otp, token })
      return response.data
    } catch (error) {
      console.error("Error verifying OTP:", error)
      throw error
    }
  },

  // Reset password
  resetPassword: async (email, password, token) => {
    try {
      const response = await api.post(ENDPOINTS.RESET_PASSWORD, { email, password, token })
      return response.data
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  },

  // Check if user has required role
  hasRole: (user, requiredRoles) => {
    return hasRole(user, requiredRoles)
  },
}

// For backward compatibility
export const getCurrentUser = authService.getCurrentUser
export const isAuthenticated = authService.isAuthenticated

