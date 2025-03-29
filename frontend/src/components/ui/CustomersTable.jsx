import { useState, useRef } from "react"
import { Search, Filter, User, Mail, Phone, MapPin, Package, X } from 'lucide-react'

export const CustomersTable = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("")
  
  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700">No Customers Found</h3>
        <p className="text-gray-500 mt-2">There are no customers to display at this time.</p>
      </div>
    )
  }

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("")
    setSearchField("all")
    setSortBy("name")
    setSortOrder("asc")
    setFilterStatus("")
  }

  // Filter customers based on search term and field
  const filteredCustomers = customers.filter(customer => {
    // Filter by order status
    const statusMatch = filterStatus ? customer.latestOrderStatus === filterStatus : true
    
    // If no search term, just return status match
    if (!searchTerm) return statusMatch
    
    const term = searchTerm.toLowerCase()
    
    // Search in specific field or all fields
    if (searchField === "name") {
      return (
        ((customer.firstName || customer.name || "")?.toLowerCase().includes(term) || 
         (customer.lastName || "")?.toLowerCase().includes(term)) && 
        statusMatch
      )
    } else if (searchField === "email") {
      return (customer.email || "")?.toLowerCase().includes(term) && statusMatch
    } else if (searchField === "phone") {
      return (customer.phone || customer.tel || "")?.toLowerCase().includes(term) && statusMatch
    } else if (searchField === "address") {
      return (
        ((customer.address || "")?.toLowerCase().includes(term) || 
         (customer.city || "")?.toLowerCase().includes(term) || 
         (customer.state || "")?.toLowerCase().includes(term) || 
         (customer.zipCode || "")?.toLowerCase().includes(term)) && 
        statusMatch
      )
    } else {
      // Search in all fields
      return (
        ((customer.firstName || customer.name || "")?.toLowerCase().includes(term) || 
         (customer.lastName || "")?.toLowerCase().includes(term) || 
         (customer.email || "")?.toLowerCase().includes(term) || 
         (customer.phone || customer.tel || "")?.toLowerCase().includes(term) || 
         (customer.address || "")?.toLowerCase().includes(term) || 
         (customer.city || "")?.toLowerCase().includes(term) || 
         (customer.state || "")?.toLowerCase().includes(term) || 
         (customer.zipCode || "")?.toLowerCase().includes(term)) && 
        statusMatch
      )
    }
  })

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue, bValue
    
    if (sortBy === "name") {
      // Handle different name formats (firstName+lastName or just name)
      aValue = a.firstName && a.lastName 
        ? `${a.firstName} ${a.lastName}`.toLowerCase() 
        : (a.name || '').toLowerCase()
      bValue = b.firstName && b.lastName 
        ? `${b.firstName} ${b.lastName}`.toLowerCase() 
        : (b.name || '').toLowerCase()
    } else if (sortBy === "email") {
      aValue = (a.email || '').toLowerCase()
      bValue = (b.email || '').toLowerCase()
    } else if (sortBy === "date") {
      aValue = new Date(a.createdAt || 0)
      bValue = new Date(b.createdAt || 0)
    } else if (sortBy === "status") {
      aValue = a.latestOrderStatus || ''
      bValue = b.latestOrderStatus || ''
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-gray-600"
      case "WAITING":
        return "text-amber-500"
      case "CONFIRMED":
        return "text-green-600"
      case "COMPLETED":
        return "text-blue-600"
      case "CANCELED":
        return "text-red-600"
      case "No Orders":
        return "text-gray-400"
      default:
        return "text-gray-600"
    }
  }

  // Format address
  const formatAddress = (customer) => {
    const parts = [
      customer.address,
      customer.city,
      customer.state,
      customer.zipCode
    ].filter(Boolean)
    
    return parts.join(', ') || 'No address provided'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Get customer name based on available fields
  const getCustomerName = (customer) => {
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`
    } else if (customer.name) {
      return customer.name
    }
    return "Unknown"
  }

  // Get customer phone based on available fields
  const getCustomerPhone = (customer) => {
    return customer.phone || customer.tel || 'No phone provided'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Customer List</h2>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search ${searchField === 'all' ? 'all fields' : searchField}...`}
                  className="pl-10 pr-4 py-2 border rounded-l-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                className="border-l-0 border rounded-r-md px-3 py-2 bg-gray-50"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="address">Address</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <select
              className="border rounded-md px-4 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Order Status</option>
              <option value="No Orders">No Orders</option>
              <option value="PENDING">Pending</option>
              <option value="WAITING">Waiting</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>

            <select 
              className="border rounded-md px-4 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              className="border rounded-md px-3 py-2"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              type="button"
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>

            <button
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2"
              onClick={resetAllFilters}
              type="button"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filterStatus || searchTerm) && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <p>
              {searchTerm && (
                <span>
                  Search: <strong>{searchField === 'all' ? 'All fields' : searchField}</strong> for <strong>"{searchTerm}"</strong>
                  {filterStatus && ", "}
                </span>
              )}
              {filterStatus && (
                <span>
                  Status: <strong>{filterStatus}</strong>
                </span>
              )}
            </p>
            <button onClick={resetAllFilters} className="text-sm bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded">
              Clear Filters
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latest Order Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(customer)}
                        </div>
                        <div className="text-sm text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {customer.email || 'No email provided'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {getCustomerPhone(customer)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-start">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                      <span>{formatAddress(customer)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-gray-400" />
                      <span className={`${getStatusColor(customer.latestOrderStatus)}`}>
                        {customer.latestOrderStatus || 'No Orders'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => window.location.href = `/customers/${customer.id}`}
                        type="button"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {sortedCustomers.length} of {customers.length} customers
        </div>
      </div>
    </div>
  )
}