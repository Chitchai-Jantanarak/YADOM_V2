import { Clock, AlertCircle, CheckCircle, CheckCircle2, XCircle } from "lucide-react"

export const OrderStatusCards = ({ orderStats }) => {
  if (!orderStats) return null

  const { waiting, pending, confirmed, completed, canceled } = orderStats

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Order Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-amber-100 rounded-lg p-4 shadow">
          <h3 className="text-amber-600 text-xl font-medium">Waiting</h3>
          <p className="text-sm text-amber-500">Waiting for customer payment</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-amber-600">{waiting}</p>
            <Clock className="h-10 w-10 text-amber-400" />
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 shadow">
          <h3 className="text-gray-600 text-xl font-medium">Pending</h3>
          <p className="text-sm text-gray-500">Waiting for admin to confirm</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-gray-600">{pending}</p>
            <AlertCircle className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-green-100 rounded-lg p-4 shadow">
          <h3 className="text-green-600 text-xl font-medium">Confirmed</h3>
          <p className="text-sm text-green-500">Confirmed by admin</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-green-600">{confirmed}</p>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg p-4 shadow">
          <h3 className="text-blue-600 text-xl font-medium">Completed</h3>
          <p className="text-sm text-blue-500">Completed by admin</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-blue-600">{completed}</p>
            <CheckCircle2 className="h-10 w-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-red-100 rounded-lg p-4 shadow">
          <h3 className="text-red-600 text-xl font-medium">Canceled</h3>
          <p className="text-sm text-red-500">Canceled by customer</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-red-600">{canceled}</p>
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

