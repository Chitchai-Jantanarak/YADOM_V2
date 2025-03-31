"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import GradientBG from "../components/layout/GradientBG"
import Logo from "../components/ui/Logo"
import PageTransition from "../components/layout/PageTransition"
import withAuthProtection from "../hoc/withAuthProtection"

const Starter = () => {
  // Clear any logout flags when visiting the starter page and handle responsive sizing
  useEffect(() => {
    sessionStorage.removeItem("recentlyLoggedOut")

    // Handle responsive logo sizing
    const handleResize = () => {
      // Force a re-render when window size changes
      // This ensures the Logo component gets the updated window.innerWidth
      setState({})
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add state for forcing re-renders on window resize
  const [state, setState] = useState({})

  return (
    <>
      <GradientBG />
      {/* Centered text */}
      <div className="absolute top-1/2 left-1/2 w-[90%] sm:w-[80%] md:w-[500px] -translate-x-1/2 -translate-y-1/2 z-10 text-white flex flex-col items-center text-center text-base sm:text-xl md:text-2xl px-4 sm:px-0">
        <Logo
          width={window.innerWidth < 640 ? "150" : "200"}
          height={window.innerWidth < 640 ? "90" : "120"}
          color="white"
        />
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0 mt-4">
          <Link to="/login" className="card bg-blue-400 grid h-16 sm:h-20 flex-grow place-items-center rounded-lg">
            <button className="tracking-widest transition-all duration-300 util-textshadow-black hover:border-black w-full h-full">
              LOGIN
            </button>
          </Link>
          <div className="divider sm:relative sm:top-4 sm:mx-5 my-2 sm:my-0">OR</div>
          <Link
            to="/register"
            className="card border-2 bg-base-content flex-grow place-items-center grid h-16 sm:h-20 rounded-lg"
          >
            <button className="text-white tracking-widest transition-all duration-300 util-textshadow-default w-full h-full">
              SIGN UP
            </button>
          </Link>
        </div>
        <a href="/" className="text-white tracking-widest underline util-textshadow-default mt-6 text-sm sm:text-base">
          CONTINUE WITHOUT ACCOUNT
        </a>
      </div>
    </>
  )
}

export default withAuthProtection(PageTransition(Starter), {
  redirectAuthenticated: true,
})

