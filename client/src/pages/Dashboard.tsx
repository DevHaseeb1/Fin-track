import { useState, useEffect } from 'react'
import api from '../api'
import SummaryCard from '../components/SummaryCard'
import CategoryPieChart from '../components/CategoryPieChart'
import MonthlyTrendChart from '../components/MonthlyTrendChart'
import { formatCurrency } from '../utils/formatCurrency'
import { useAuth } from '../context/AuthContext'

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const SkeletonChart = () => (
  <div className="bg-white rounded-2xl border border-emerald-100/50 p-6 shadow-sm">
    <div className="h-5 w-44 rounded animate-shimmer mb-6" />
    <div className="h-64 rounded-xl animate-shimmer" />
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState<any>(null)
  const [byCategory, setByCategory] = useState<any[]>([])
  const [monthly, setMonthly] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/by-category'),
          api.get('/analytics/monthly'),
        ])
        setSummary(summaryRes.data.data)
        setByCategory(categoryRes.data.data.data || [])
        setMonthly(monthlyRes.data.data.data || [])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pt-2">
      <div className="flex items-center gap-4">
        <div className="h-10 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-emerald-600/70 mt-0.5">Here's your financial overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Total Income" value={formatCurrency(summary?.totalIncome || 0)} type="income" loading={loading} />
        <SummaryCard title="Total Expenses" value={formatCurrency(summary?.totalExpense || 0)} type="expense" loading={loading} />
        <SummaryCard title="Net Balance" value={formatCurrency(summary?.netBalance || 0)} type="balance" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-emerald-100/50 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Spending by Category</h3>
              <p className="text-xs text-gray-500 mb-4">Breakdown of your expenses</p>
              <CategoryPieChart data={byCategory} />
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100/50 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Monthly Trend</h3>
              <p className="text-xs text-gray-500 mb-4">Income vs expenses over time</p>
              <MonthlyTrendChart data={monthly} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
