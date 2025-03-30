"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import PageTransition from "../components/layout/PageTransition"
import Logo from "../components/ui/Logo"
import Door from "../components/ui/Door"
import { countryCodes } from "../utils/CountryCode"

import withAuthProtection from "../hoc/withAuthProtection"

const Register = () => {
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState("+66")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value)
  }

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

    setLoading(true)

    try {
      // Format phone number with country code
      const tel = `${selectedCountry}${formData.phoneNumber}`

      // Prepare user data
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        tel,
        address: "", // Can be updated later in profile
      }

      const response = await authService.register(userData)

      // By default, new users are CUSTOMER role, so redirect to home
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register">
      <section className="max-h-full max-w-full grid">
        <div className="max-h-lvh grid grid-rows-8 md:mx-36 bg-white">
          {/* header */}
          <div className="row-span-1 flex justify-center items-center p-5 m-0 w-full">
            <Link to="/">
              <Logo width="160" height="60" />
            </Link>
          </div>

          {/* content */}
          <div className="row-span-7 flex items-center justify-center">
            <div className="inline-block font-poppins w-2/3 space-y-5">
              <h1 className="font-extrabold text-3xl">Create an Account</h1>

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Account Field */}
                <h2 className="font-anybody font-light text-sm text-gray-400 tracking-wider">Account Details</h2>
                {/* First Name */}
                <div className="space-y-2">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className="input input-bordered w-full"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Last Name */}
                <div className="space-y-2">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    className="input input-bordered w-full"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
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
                {/* Phone number */}
                <div className="flex space-x-2 flex-row w-full">
                  <select
                    className="select select-bordered w-full max-w-24"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                  >
                    <option disabled value="+66">
                      +66
                    </option>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2 w-full">
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className="input input-bordered w-full"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <h2 className="font-anybody font-light text-sm text-gray-400 tracking-wider">Create Password</h2>
                {/* Password */}
                <div className="space-y-2">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Confirm Password */}
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
                  />
                </div>

                <br />

                {/* Submit Button */}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>

                  <Link className="flex flex-row space-x-2" to={"/Login"}>
                    <p> Login </p>
                    <Door />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="fixed -z-10 bg-blue-500 h-full w-full"></div>
      </section>
    </div>
  )
}

// First apply PageTransition, then apply withAuthProtection
export default withAuthProtection(PageTransition(Register), {
  redirectAuthenticated: true,
})

