import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '../utils/formatCurrency'

interface CategoryData {
  category: string
  type: string
  total: number
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16']

interface CategoryPieChartProps {
  data: CategoryData[]
  loading?: boolean
}

const RADIAN = Math.PI / 180

const renderInsideLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, category }: any) => {
  if (percent < 0.08) return null

  const radius = (innerRadius + outerRadius) / 2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

const CategoryPieChart = ({ data, loading }: CategoryPieChartProps) => {
  if (loading) {
    return <div className="h-80 bg-gray-100 animate-pulse rounded-xl" />
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={renderInsideLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryPieChart
