import api from "./api"
import imageService from "./imageService"

export const register = async (userData) => {
  const response = await api.post("/api/users/register", userData)
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post("/api/users/login", { email, password })

  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  sessionStorage.setItem("recentlyLoggedOut", "true")
}

export const getProfile = async () => {
  try {
    const response = await api.get("/api/users/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const uploadProfileImage = async (imageFile) => {
  try {
    // Use the imageService to upload the file
    const result = await imageService.uploadImage(imageFile)

    if (!result.success) {
      throw new Error(result.error || "Failed to upload image")
    }

    // Update user profile with the new image URL
    const userData = {
      imageUrl: result.url,
    }

    const response = await api.put("/api/users/profile", userData)

    // Update stored user data if available
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    if (storedUser && storedUser.id) {
      const updatedStoredUser = {
        ...storedUser,
        imageUrl: result.url,
      }
      localStorage.setItem("user", JSON.stringify(updatedStoredUser))
    }

    return response.data
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}

export const updateProfile = async (userData) => {
  try {
    const response = await api.put("/api/users/profile", userData)

    // Update stored user data if available
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    if (storedUser && storedUser.id) {
      const updatedStoredUser = {
        ...storedUser,
        name: userData.name,
        email: userData.email,
        imageUrl: userData.imageUrl || storedUser.imageUrl,
      }
      localStorage.setItem("user", JSON.stringify(updatedStoredUser))
    }

    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/users/forgot-password", { email })
    return response.data
  } catch (error) {
    console.error("Error requesting password reset:", error)
    throw error
  }
}

// Verify OTP
export const verifyOTP = async (email, otp, token) => {
  try {
    const response = await api.post("/api/users/verify-otp", { email, otp, token })
    return response.data
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

// Reset password
export const resetPassword = async (email, password, token) => {
  try {
    const response = await api.post("/api/users/reset-password", { email, password, token })
    return response.data
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users/admin")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

// Get user by ID (admin only)
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

// Search users (admin only)
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/api/users/search?query=${query}`)
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

// Get user orders (admin only)
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/orders`)
    return response.data
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error
  }
}

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}