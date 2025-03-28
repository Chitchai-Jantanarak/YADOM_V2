import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export const ProductTypeChart = ({ productTypeStats }) => {
  if (!productTypeStats || productTypeStats.length === 0) return null

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  const data = productTypeStats.map((stat) => ({
    name: stat.type,
    value: stat.count,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Product Types</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

