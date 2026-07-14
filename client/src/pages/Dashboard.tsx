import { useState, useEffect } from 'react'
import api from '../api'
import SummaryCard from '../components/SummaryCard'
import CategoryPieChart from '../components/CategoryPieChart'
import MonthlyTrendChart from '../components/MonthlyTrendChart'
import { formatCurrency } from '../utils/formatCurrency'

const Dashboard = () => {
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
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Total Income" value={formatCurrency(summary?.totalIncome || 0)} color="text-green-600" loading={loading} />
        <SummaryCard title="Total Expenses" value={formatCurrency(summary?.totalExpense || 0)} color="text-red-600" loading={loading} />
        <SummaryCard title="Net Balance" value={formatCurrency(summary?.netBalance || 0)} color="text-blue-600" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
          <CategoryPieChart data={byCategory} loading={loading} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trend</h3>
          <MonthlyTrendChart data={monthly} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
