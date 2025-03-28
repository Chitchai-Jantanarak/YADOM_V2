"use client"

import { useState, useEffect } from "react"
import PageTransition from "../components/layout/PageTransition"
import { Sidebar } from "../components/layout/Sidebar"
import { Header } from "../components/layout/Header"
import { authService } from "../services/authService"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile()
        setProfile(data)
      } catch (err) {
        setError("Failed to load profile data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex-1">
        <Header />
        <main className="pt-24 px-4 md:px-6 pb-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          ) : profile ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="w-32 h-32 mx-auto md:mx-0 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${profile.name.charAt(0)}`}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-4">{profile.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p>{profile.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{profile.tel || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{profile.address || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p>{profile.loginAt ? new Date(profile.loginAt).toLocaleString() : "Never"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No profile data available.</p>
          )}
        </main>
      </div>
    </div>
  )
}

export default PageTransition(Profile)

