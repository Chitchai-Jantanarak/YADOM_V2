"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Logo from "../components/ui/Logo"
import PageTransition from "../components/layout/PageTransition"
import { authService } from "../services/authService"

const PasswordReset = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validParams, setValidParams] = useState(false)

  useEffect(() => {
    // First try to get params from URL
    const params = new URLSearchParams(location.search)
    let emailParam = params.get("email")
    let tokenParam = params.get("token")

    // If not in URL, try to get from sessionStorage
    if (!emailParam || !tokenParam) {
      const savedState = sessionStorage.getItem("passwordResetParams")
      if (savedState) {
        const state = JSON.parse(savedState)
        emailParam = state.email
        tokenParam = state.token
      }
    }

    if (!emailParam || !tokenParam) {
      setError("Invalid reset link. Please request a new password reset.")
      setValidParams(false)
      return
    }

    // Save params to sessionStorage for persistence
    sessionStorage.setItem("passwordResetParams", JSON.stringify({ email: emailParam, token: tokenParam }))

    setEmail(emailParam)
    setToken(tokenParam)
    setValidParams(true)
  }, [location])

  // Load form state if available
  useEffect(() => {
    const savedFormState = sessionStorage.getItem("passwordResetFormState")
    if (savedFormState) {
      setFormData(JSON.parse(savedFormState))
    }
  }, [])

  // Save form state when it changes
  useEffect(() => {
    if (formData.password || formData.confirmPassword) {
      sessionStorage.setItem("passwordResetFormState", JSON.stringify(formData))
    }
  }, [formData])

  // Clear saved state when reset is complete
  useEffect(() => {
    if (success) {
      sessionStorage.removeItem("passwordResetParams")
      sessionStorage.removeItem("passwordResetFormState")
      sessionStorage.removeItem("passwordResetState") // Clear the state from PasswordForgot too
    }
  }, [success])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword(email, formData.password, token)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="max-h-full max-w-full grid sm:grid-cols-7">
        <div className="col-span-5 grid grid-rows-8">
          {/* header */}
          <div className="row-span-1 flex justify-between items-center p-5 m-0 w-full">
            <Logo />

            <div className="flex items-center space-x-4">
              <span className="font-montserrat font-extralight text-xs">No Account yet?</span>
              <Link to="/register">
                <button className="font-montserrat font-medium px-5 py-2 border border-black transition-all duration-300 hover:bg-black hover:text-white">
                  Sign up
                </button>
              </Link>
            </div>
          </div>

          {/* content */}
          <div className="row-span-7 flex items-center justify-center">
            <div className="inline-block font-poppins text-center w-2/3 space-y-5">
              <h1 className="font-extrabold text-3xl">Set a new password</h1>
              <h2 className="font-montserrat font-light text-sm text-black tracking-wider">
                Create a new password. Ensure it differs from previous ones for security
              </h2>

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Password updated successfully! Redirecting to login...
                </div>
              )}

              {!validParams && !success && (
                <div className="mt-4">
                  <p className="text-red-600 mb-4">Invalid reset link.</p>
                  <Link to="/PasswordForgot">
                    <button className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1">
                      Request New Reset Link
                    </button>
                  </Link>
                </div>
              )}

              {/* Form */}
              {validParams && !success && (
                <form className="space-y-3" onSubmit={handleSubmit}>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-left font-extrabold">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="input input-bordered w-full"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={success}
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="input input-bordered w-full"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={success}
                    />
                  </div>

                  <br />

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                      disabled={loading || success}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex bg-red-500 max-sm:hidden"></div>
      </section>
    </div>
  )
}

export default PageTransition(PasswordReset)

