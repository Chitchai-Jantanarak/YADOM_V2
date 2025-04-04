"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { authService, ROLES } from "../services/authService"
import Logo from "../components/ui/Logo"
import PageTransition from "../components/layout/PageTransition"
import withAuthProtection from "../hoc/withAuthProtection"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Clear the recently logged out flag when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("recentlyLoggedOut")
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authService.login(formData.email, formData.password)

      // Get the return path from location state or default paths based on role
      const returnPath = location.state?.returnPath || "/"
      const user = authService.getCurrentUser()

      if (user && authService.hasRole(user, [ROLES.ADMIN, ROLES.OWNER])) {
        // Admin and Owner users go to dashboard main
        navigate("/dashboard/main")
      } else {
        // Regular customers go to previous page or home
        navigate(returnPath)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="max-h-full max-w-full grid sm:grid-cols-7">
        <div className="col-span-2 flex bg-red-500 max-sm:hidden"></div>

        <div className="col-span-5 grid grid-rows-8">
          {/* header */}
          <div className="row-span-1 flex justify-between items-center p-5 m-0 w-full">
            <Link to="/">
              <Logo />
            </Link>

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
              <h1 className="font-extrabold text-3xl">login</h1>
              <h2 className="font-montserrat font-light text-sm text-black tracking-wider">
                PLEASE LOGIN TO CONTINUE TO YOUR ACCOUNT
              </h2>

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

              {/* Form */}
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-left font-extrabold">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-left font-extrabold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Link to="/PasswordForgot">
                  <p className="font-montserrat font-light text-sm text-right pt-3 hover:underline">
                    {" "}
                    Forgot Password?{" "}
                  </p>
                </Link>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default withAuthProtection(PageTransition(Login), {
  redirectAuthenticated: true,
})

