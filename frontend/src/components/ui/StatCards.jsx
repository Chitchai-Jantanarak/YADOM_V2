import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

export const StatCards = ({ totalUsers, totalProducts, totalOrders, totalRevenue }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-6 shadow flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers ? totalUsers.toLocaleString() : "0"}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <Package className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts ? totalProducts.toLocaleString() : "0"}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow flex items-center">
        <div className="bg-purple-100 p-3 rounded-full mr-4">
          <ShoppingCart className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders ? totalOrders.toLocaleString() : "0"}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow flex items-center">
        <div className="bg-amber-100 p-3 rounded-full mr-4">
          <DollarSign className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">{totalRevenue ? formatCurrency(totalRevenue) : formatCurrency(0)}</p>
        </div>
      </div>
    </div>
  )
}

