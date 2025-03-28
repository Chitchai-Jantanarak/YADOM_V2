import api from "./api"

// Dashboard endpoints
const endpoints = {
  stats: "/dashboard/stats",
}

export const getDashboardStats = async () => {
  const response = await api.get(endpoints.stats)
  return response.data
}

