"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertTriangle, Shield, ArrowLeft, Home, Lock } from "lucide-react"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"

const Forbidden = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isWarning, setIsWarning] = useState(false)

  // Get the attempted path
  const attemptedPath = location.pathname

  // Determine if this is a known route or completely unknown
  const isKnownRoute =
    attemptedPath.includes("/product/") || attemptedPath.includes("/dashboard/") || attemptedPath.includes("/shop/")

  // Warning animation effect
  useEffect(() => {
    const warningInterval = setInterval(() => {
      setIsWarning((prev) => !prev)
    }, 1000)

    return () => clearInterval(warningInterval)
  }, [])

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Button animation variants
  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.4, type: "spring", stiffness: 200 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  }

  // Shield animation variants
  const shieldVariants = {
    normal: { scale: 1 },
    warning: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      <NavBar2 />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Go to Home</span>
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center relative"
        >
          <motion.div variants={shieldVariants} animate={isWarning ? "warning" : "normal"} className="relative">
            <motion.div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {isKnownRoute ? (
                <Lock size={40} className="text-red-500" />
              ) : (
                <AlertTriangle size={40} className="text-red-500" />
              )}
            </motion.div>
            <motion.div
              animate={{
                scale: isWarning ? [1, 1.2, 1] : 1,
                opacity: isWarning ? [0.5, 0.7, 0.5] : 0.5,
              }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {isKnownRoute ? "Access Forbidden" : "Page Not Found"}
          </motion.h1>

          <motion.div variants={itemVariants} className="text-lg text-gray-600 mb-8">
            {isKnownRoute ? (
              <p>
                You don't have permission to access this resource.
                <br />
                <span className="text-sm text-gray-500">Attempted path: {attemptedPath}</span>
              </p>
            ) : (
              <p>
                The page you're looking for doesn't exist or has been moved.
                <br />
                <span className="text-sm text-gray-500">Attempted path: {attemptedPath}</span>
              </p>
            )}
          </motion.div>

          <motion.div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full flex items-center justify-center shadow-md"
            >
              <Home size={18} className="mr-2" />
              Return to Home
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(-1)}
              className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-full flex items-center justify-center shadow-sm"
            >
              <ArrowLeft size={18} className="mr-2" />
              Go Back
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 p-4 bg-red-100 rounded-lg border border-red-200">
            <div className="flex items-center justify-center mb-2">
              <Shield size={20} className="text-red-500 mr-2" />
              <h3 className="font-semibold text-red-700">Security Warning</h3>
            </div>
            <p className="text-red-600 text-sm">
              Attempting to access unauthorized routes may be logged and reported. If you believe you should have access
              to this resource, please contact the administrator.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default Forbidden

