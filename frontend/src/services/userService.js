import api from "./apiService"

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
}

export const getProfile = async () => {
  const response = await api.get("/api/users/profile")
  return response.data
}

export const updateProfile = async (userData) => {
  const response = await api.put("/api/users/profile", userData)

  // Update stored user data
  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

export const forgotPassword = async (email) => {
  const response = await api.post("/api/users/forgot-password", { email })
  return response.data
}

export const verifyOTP = async (email, otp) => {
  const response = await api.post("/api/users/verify-otp", { email, otp })
  return response.data
}

export const resetPassword = async (email, password, token) => {
  const response = await api.post("/api/users/reset-password", { email, password, token })
  return response.data
}

