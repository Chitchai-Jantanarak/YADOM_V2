import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const AromaChart = ({ aromaStats }) => {
  if (!aromaStats || aromaStats.length === 0) return null

  // Sort by count and take top 5
  const data = [...aromaStats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((stat) => ({
      name: stat.name,
      count: stat.count,
    }))

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Popular Aromas</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={(value) => value} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

