import { Link, useLocation } from "react-router-dom"
import PageTransition from "../components/layout/PageTransition"

const Unauthorized = () => {
  const location = useLocation()
  const isForbidden = location.pathname === "/forbidden"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {isForbidden ? "Access Forbidden" : "Unauthorized Access"}
        </h1>
        <div className="text-6xl mb-4">{isForbidden ? "🚫" : "🔒"}</div>
        <p className="text-gray-700 mb-6">
          {isForbidden
            ? "You don't have permission to access this page. Please contact an administrator if you believe this is an error."
            : "You need to be logged in to access this page."}
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/Login"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Go to Login
          </Link>
          <Link
            to="/product"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PageTransition(Unauthorized)

