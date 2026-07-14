import { useState, useEffect } from 'react'
import api from '../api'
import TransactionTable from '../components/TransactionTable'
import TransactionForm from '../components/TransactionForm'

interface Category {
  _id: string
  name: string
  type: string
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTx, setEditingTx] = useState<any>(null)
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data))
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (filterType) params.type = filterType
      if (filterCategory) params.category = filterCategory
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const res = await api.get('/transactions', { params })
      setTransactions(res.data.data.transactions)
      setTotalPages(res.data.data.pagination.totalPages)
    } catch (err) {
      console.error('Failed to load transactions', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, filterType, filterCategory, startDate, endDate])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await api.delete(`/transactions/${id}`)
      fetchTransactions()
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const handleSaved = () => {
    setShowForm(false)
    setEditingTx(null)
    fetchTransactions()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <button
          onClick={() => { setEditingTx(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onEdit={(tx) => { setEditingTx(tx); setShowForm(true) }}
          onDelete={handleDelete}
        />
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTx}
          onClose={() => { setShowForm(false); setEditingTx(null) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Transactions
