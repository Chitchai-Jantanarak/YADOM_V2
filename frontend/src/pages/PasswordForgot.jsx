"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import OtpInput from "react-otp-input"
import Logo from "../components/ui/Logo"
import PageTransition from "../components/layout/PageTransition"
import { authService } from "../services/authService"

const PasswordForgot = () => {
  const navigate = useNavigate()
  const [steps, setSteps] = useState(1)
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Load saved state from sessionStorage on component mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("passwordResetState")
    if (savedState) {
      const state = JSON.parse(savedState)
      setSteps(state.steps || 1)
      setEmail(state.email || "")
      setResetToken(state.resetToken || "")
      setEmailSent(state.emailSent || false)

      // Only set OTP if we're on step 2
      if (state.steps === 2 && state.otp) {
        setOtp(state.otp)
      }
    }
  }, [])

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      steps,
      email,
      resetToken,
      emailSent,
      otp: steps === 2 ? otp : "", // Only save OTP if we're on step 2
    }
    sessionStorage.setItem("passwordResetState", JSON.stringify(stateToSave))
  }, [steps, email, resetToken, emailSent, otp])

  // Clear saved state when component unmounts or when reset is complete
  useEffect(() => {
    return () => {
      if (steps === 3) {
        // Clear state when reset is complete and user navigates away
        sessionStorage.removeItem("passwordResetState")
      }
    }
  }, [steps])

  const handleOtpChange = (otp) => {
    setOtp(otp)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmitEmail = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setResetToken(response.token)
      setEmailSent(true)
      setSteps(2)
    } catch (err) {
      console.error("Error:", err)
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setError("")
    setLoading(true)

    try {
      await authService.verifyOTP(email, otp, resetToken)
      setSteps(3)
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to restart the process
  const handleRestart = () => {
    sessionStorage.removeItem("passwordResetState")
    setSteps(1)
    setEmail("")
    setOtp("")
    setResetToken("")
    setEmailSent(false)
    setError("")
  }

  // Function to resend verification code
  const handleResendCode = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setResetToken(response.token)
      setEmailSent(true)
      setOtp("")
      setError("")
      // Show success message
      setError("Verification code resent successfully!")
    } catch (err) {
      console.error("Error:", err)
      setError(err.response?.data?.message || "Failed to resend verification code. Please try again.")
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

          {steps === 1 && (
            <>
              {/* content I */}
              <div className="row-span-7 flex items-center justify-center">
                <div className="inline-block font-poppins text-center w-2/3 space-y-5">
                  <h1 className="font-extrabold text-3xl">Forget Password</h1>
                  <h2 className="font-montserrat font-light text-sm text-black tracking-wider">
                    Please enter your email to reset the password
                  </h2>

                  {error && (
                    <div
                      className={`${error.includes("successfully") ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"} px-4 py-3 rounded border`}
                    >
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form className="space-y-3" onSubmit={handleSubmitEmail}>
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
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Enter"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}

          {steps === 2 && (
            <>
              {/* content II */}
              <div className="row-span-7 flex items-center justify-center">
                <div className="inline-block font-poppins text-center w-2/3 space-y-5">
                  <h1 className="font-extrabold text-3xl">Check your email</h1>
                  <h2 className="font-montserrat font-light text-sm text-black tracking-wider">
                    We sent a verification code to {email}
                    <br /> Enter the 6-digit code mentioned in the email
                  </h2>

                  {error && (
                    <div
                      className={`${error.includes("successfully") ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"} px-4 py-3 rounded border`}
                    >
                      {error}
                    </div>
                  )}

                  {emailSent && !error && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      Email sent successfully! Check your inbox for the verification code.
                    </div>
                  )}

                  <br />

                  <div className="flex text-center justify-center">
                    <OtpInput
                      value={otp}
                      onChange={handleOtpChange}
                      numInputs={6}
                      renderInput={(props) => (
                        <input
                          {...props}
                          style={{ width: "48px", height: "56px", marginRight: "10px" }}
                          className="input input-bordered"
                        />
                      )}
                    />
                  </div>

                  <div className="mt-6 flex flex-col space-y-3">
                    <button
                      onClick={handleVerifyOTP}
                      className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </button>

                    <div className="flex justify-center space-x-4 text-sm">
                      <button onClick={handleResendCode} className="text-blue-600 hover:underline" disabled={loading}>
                        Resend Code
                      </button>
                      <span className="text-gray-400">|</span>
                      <button onClick={handleRestart} className="text-blue-600 hover:underline" disabled={loading}>
                        Change Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {steps === 3 && (
            <>
              {/* content III */}
              <div className="row-span-7 flex items-center justify-center">
                <div className="inline-block font-poppins text-center w-2/3 space-y-5">
                  <h1 className="font-extrabold text-3xl">Password reset</h1>
                  <h2 className="font-montserrat font-light text-sm text-black tracking-wider">
                    Your verification was successful.
                    <br /> Click confirm to set a new password
                  </h2>

                  <br />
                  <Link
                    to={`/PasswordReset?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`}
                  >
                    <button className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1">
                      Confirm
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="col-span-2 flex bg-red-500 max-sm:hidden"></div>
      </section>
    </div>
  )
}

export default PageTransition(PasswordForgot)

