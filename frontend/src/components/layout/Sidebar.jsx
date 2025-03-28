import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, Settings, BarChart2, ShoppingBag, FileText, PieChart } from "lucide-react"
import { authService, ROLES, hasRole } from "../../services/authService"

export const Sidebar = () => {
  const location = useLocation()

  // First try to get the authenticated user
  let user = authService.getCurrentUser()

  // If no authenticated user, use mock for development
  if (!user && process.env.NODE_ENV === "development") {
    user = authService.getMockCurrentUser()
  }

  // Define navigation items with role-based access
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Products",
      icon: Package,
      path: "/products",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      path: "/orders",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Customers",
      icon: Users,
      path: "/customers",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/reports",
      roles: [ROLES.OWNER], // Only owners can access reports
    },
    {
      title: "Analytics",
      icon: BarChart2,
      path: "/analytics",
      roles: [ROLES.OWNER], // Only owners can access analytics
    },
    {
      title: "Sales Insights",
      icon: PieChart,
      path: "/sales-insights",
      roles: [ROLES.OWNER], // Only owners can access sales insights
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      roles: [ROLES.ADMIN, ROLES.OWNER],
    },
  ]

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => !item.roles || hasRole(user, item.roles))

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-md z-20 hidden md:block">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img src="/placeholder.svg?height=40&width=40" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-blue-500">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 ${
                  location.pathname === item.path ||
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path))
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                } rounded-md`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

