import PageTransition from "../components/layout/PageTransition"
import { Sidebar } from "../components/layout/Sidebar"
import { Header } from "../components/layout/Header"

const Customers = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex-1">
        <Header />
        <main className="pt-24 px-4 md:px-6 pb-8">
          <h1 className="text-3xl font-bold mb-6">Customer Management</h1>
          <p className="text-gray-600">This page is under construction.</p>
        </main>
      </div>
    </div>
  )
}

export default PageTransition(Customers)

