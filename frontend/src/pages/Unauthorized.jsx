import { Link } from "react-router-dom"
import PageTransition from "../components/layout/PageTransition"

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go back
        </Link>
      </div>
    </div>
  )
}

export default PageTransition(Unauthorized)

