import { useState, useEffect, type FormEvent } from 'react'
import api from '../api'

interface Category {
  _id: string
  name: string
  type: string
}

interface TransactionFormProps {
  onClose: () => void
  onSaved: () => void
  transaction?: any
}

const TransactionForm = ({ onClose, onSaved, transaction }: TransactionFormProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState(transaction?.category?._id || '')
  const [type, setType] = useState(transaction?.type || 'expense')
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [date, setDate] = useState(transaction?.date?.split('T')[0] || new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/categories').then((res) => {
      let cats = res.data.data
      if (type) cats = cats.filter((c: Category) => c.type === type)
      setCategories(cats)
    })
  }, [type])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { category, type, amount: parseFloat(amount), description, date }
      if (transaction) {
        await api.put(`/transactions/${transaction._id}`, payload)
      } else {
        await api.post('/transactions', payload)
      }
      onSaved()
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  const filteredCategories = categories.filter((c) => c.type === type)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setCategory('') }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {filteredCategories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm
