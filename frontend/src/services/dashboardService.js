import api from "./api"

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/api/dashboard/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard statistics")
  }
}
