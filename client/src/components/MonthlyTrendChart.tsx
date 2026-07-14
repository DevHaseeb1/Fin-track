import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MonthlyData {
  month: number
  year: number
  income: number
  expense: number
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface MonthlyTrendChartProps {
  data: MonthlyData[]
  loading?: boolean
}

const MonthlyTrendChart = ({ data, loading }: MonthlyTrendChartProps) => {
  if (loading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: `${monthNames[d.month - 1]} ${d.year}`,
    Income: d.income,
    Expense: d.expense,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
          <Legend />
          <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendChart
