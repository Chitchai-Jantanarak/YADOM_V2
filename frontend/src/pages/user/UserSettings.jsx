"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Save, X, Camera, AlertCircle, Check, Loader } from "lucide-react"
import { countryCodes } from "../../utils/CountryCode"
import { ROLES } from "../../services/authService"
import ProtectedRoute from "../../hoc/ProtectedRoute"
import UserAvatar from "../../components/ui/UserAvatar"
import { getUserImageUrl } from "../../utils/imageUtils"
import api from "../../services/api"
import PageTransition from "../../components/layout/PageTransition"

// Import the userService functions directly
import * as userService from "../../services/userService"

const UserSettings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+66",
    address: "",
  })
  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const refreshPage = () => {
    window.location.reload()
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userData = await userService.getProfile()
        setUser(userData)

        // Split name into first and last name
        const nameParts = userData.name.split(" ")
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""

        // Extract country code and phone number
        let countryCode = "+66" // Default
        let phoneNumber = userData.tel || ""

        // Try to extract country code from phone number
        for (const code of countryCodes) {
          if (phoneNumber && phoneNumber.startsWith(code.code)) {
            countryCode = code.code
            phoneNumber = phoneNumber.substring(code.code.length)
            break
          }
        }

        setFormData({
          firstName,
          lastName,
          email: userData.email,
          phoneNumber,
          countryCode,
          address: userData.address || "",
        })

        setImagePreview(getUserImageUrl(userData))
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const validateImageFile = (file) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return "Please select an image file (JPG, PNG, etc.)"
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return "Image size should be less than 5MB"
    }

    return null // No error
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset errors
    setImageError("")

    // Validate file
    const error = validateImageFile(file)
    if (error) {
      setImageError(error)
      setShowErrorModal(true)
      return
    }

    // Set file for preview
    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload image immediately
    try {
      setUploadingImage(true)

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Upload directly to the existing endpoint
      const response = await api.post("/api/upload/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Get the image URL from the response
      const imageUrl = response.data.url
      console.log("Uploaded image URL:", imageUrl)

      // Update user state with new image URL
      const updatedUser = {
        ...user,
        imageUrl: imageUrl,
      }

      setUser(updatedUser)

      // Update local storage user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (storedUser && storedUser.id) {
        const updatedStoredUser = {
          ...storedUser,
          imageUrl: imageUrl,
        }

        localStorage.setItem("user", JSON.stringify(updatedStoredUser))

        // Dispatch a storage event to notify other components
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: JSON.stringify(updatedStoredUser),
            oldValue: JSON.stringify(storedUser),
            storageArea: localStorage,
          }),
        )
      }

      setSuccess("Profile image updated successfully!")
      setShowSuccessModal(true)
    } catch (err) {
      console.error("Error uploading image:", err)
      setImageError(err.response?.data?.message || "Failed to upload image. Please try again.")
      setShowErrorModal(true)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      // Prepare user data
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        tel: `${formData.countryCode}${formData.phoneNumber}`,
        address: formData.address,
      }

      // Update user profile
      const updatedUser = await userService.updateProfile(userData)

      setSuccess("Profile updated successfully!")
      setShowSuccessModal(true)
      setUser(updatedUser)

      // Update localStorage if needed
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (storedUser && storedUser.id) {
        const updatedStoredUser = {
          ...storedUser,
          name: userData.name,
          email: userData.email,
        }
        localStorage.setItem("user", JSON.stringify(updatedStoredUser))
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.response?.data?.message || "Failed to update profile. Please try again.")
      setShowErrorModal(true)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      const nameParts = user.name.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      let countryCode = "+66"
      let phoneNumber = user.tel || ""

      for (const code of countryCodes) {
        if (phoneNumber && phoneNumber.startsWith(code.code)) {
          countryCode = code.code
          phoneNumber = phoneNumber.substring(code.code.length)
          break
        }
      }

      setFormData({
        firstName,
        lastName,
        email: user.email,
        phoneNumber,
        countryCode,
        address: user.address || "",
      })

      setImagePreview(getUserImageUrl(user))
      setImageFile(null)
      setImageError("")
    }

    setError("")
    setSuccess("")
  }

  if (loading) {
    return (
      <div className="w-full pt-16 flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
      <div className="w-full pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {/* Success and error alerts are now handled by modals */}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                {/* Profile Image */}
                <div className="relative">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer group ${uploadingImage ? "opacity-70" : ""}`}
                    onClick={!uploadingImage ? handleImageClick : undefined}
                    role="button"
                    aria-label="Change profile picture"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (!uploadingImage && (e.key === "Enter" || e.key === " ")) {
                        handleImageClick()
                      }
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt={`${user?.name || "User"}'s profile`}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          console.log("Image preview error:", e.target.src)
                          e.target.onerror = null // Prevent infinite loop

                          // If the preview fails, try to use the user's image URL
                          if (user?.imageUrl) {
                            const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"
                            const imageUrl = user.imageUrl.startsWith("http")
                              ? user.imageUrl
                              : `${apiBaseUrl}${user.imageUrl.startsWith("/") ? "" : "/"}${user.imageUrl}`

                            e.target.src = imageUrl
                          } else {
                            // Fall back to UI avatars
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`
                          }
                        }}
                      />
                    ) : (
                      <UserAvatar user={user} size="xl" className="w-full h-full" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadingImage ? (
                        <Loader className="h-8 w-8 text-white animate-spin" aria-hidden="true" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {imageError && <div className="text-red-500 text-xs mt-2 max-w-[200px]">{imageError}</div>}

                  <input
                    type="file"
                    id="profile-image"
                    name="profile-image"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    aria-label="Upload profile picture"
                    disabled={uploadingImage}
                  />

                  <div className="mt-2 text-center text-xs text-gray-500">Click to change profile picture</div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-blue-500">{user?.role}</p>
                  <p className="text-gray-600 mt-2">{user?.email}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="form-control">
                  <label htmlFor="firstName" className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    autoComplete="given-name"
                  />
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label htmlFor="lastName" className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    autoComplete="family-name"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label htmlFor="phoneNumber" className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <div className="flex">
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="select select-bordered w-24"
                      aria-label="Country code"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="input input-bordered flex-1"
                      required
                      autoComplete="tel-national"
                      aria-label="Phone number without country code"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="form-control md:col-span-2">
                  <label htmlFor="address" className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    autoComplete="street-address"
                  ></textarea>
                </div>

                {/* Password Reset Link */}
                <div className="form-control md:col-span-2">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value="••••••••••••"
                      className="input input-bordered w-full"
                      disabled
                      aria-label="Password field (disabled)"
                    />
                    <a href="/PasswordForgot" className="btn btn-ghost btn-sm ml-2" aria-label="Reset password">
                      Reset
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="btn btn-outline group"
                onClick={handleCancel}
                aria-label="Cancel changes"
                disabled={saving}
              >
                <X size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:scale-110" />
                <span className="transition-all duration-200 group-hover:text-white">Cancel</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary group"
                disabled={saving}
                aria-label={saving ? "Saving profile changes" : "Save profile changes"}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
                    <span className="transition-all duration-200">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:scale-110 group-hover:text-white"
                    />
                    <span className="transition-all duration-200 group-hover:text-white">Save</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Success!</h3>
              <p className="mb-6">{success}</p>
              <button className="btn btn-primary w-full" onClick={refreshPage}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">Error</h3>
              <p className="mb-6">{error}</p>
              <button className="btn btn-error w-full" onClick={() => setShowErrorModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

export default PageTransition(UserSettings)

