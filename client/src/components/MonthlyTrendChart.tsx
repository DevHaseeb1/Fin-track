import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../utils/formatCurrency'

interface MonthlyData {
  month: number
  year: number
  income: number
  expense: number
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface MonthlyTrendChartProps {
  data: MonthlyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="flex items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
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
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" fontSize={12} tick={{ fill: '#9CA3AF' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
          <YAxis fontSize={12} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
          <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} animationBegin={200} animationDuration={800} />
          <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} animationBegin={400} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendChart
