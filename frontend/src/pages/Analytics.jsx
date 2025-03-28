import PageTransition from "../components/layout/PageTransition"
import { Sidebar } from "../components/layout/Sidebar"
import { Header } from "../components/layout/Header"

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex-1">
        <Header />
        <main className="pt-24 px-4 md:px-6 pb-8">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Owner Access Only</p>
            <p>This page contains sensitive business analytics and is restricted to owner access.</p>
          </div>
          <p className="text-gray-600">This page is under construction.</p>
        </main>
      </div>
    </div>
  )
}

export default PageTransition(Analytics)

