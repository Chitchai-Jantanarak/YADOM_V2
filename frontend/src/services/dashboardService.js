import api from "./api"

// Dashboard endpoints
const endpoints = {
  stats: "/api/dashboard/stats",
}

export const getDashboardStats = async () => {
  const response = await api.get(endpoints.stats)
  return response.data
}

