import axios from "axios"

// Base API configuration using environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // For client-side only
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Unauthorized - could redirect to login
      if (error.response.status === 401) {
        console.error("Unauthorized access")
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        sessionStorage.setItem("recentlyLoggedOut", "true")
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }

      // Server error
      if (error.response.status >= 500) {
        console.error("Server error:", error.response.data)
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received")
    } else {
      // Other errors
      console.error("Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api

