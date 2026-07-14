import { formatCurrency } from '../utils/formatCurrency'

interface Transaction {
  _id: string
  type: string
  amount: number
  description: string
  date: string
  category: { name: string; type: string }
}

interface TransactionTableProps {
  transactions: Transaction[]
  loading: boolean
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
}

const TransactionTable = ({ transactions, loading, onEdit, onDelete }: TransactionTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No transactions yet. Add one to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-700">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-gray-700">{tx.description || '-'}</td>
              <td className="py-3 px-4">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {tx.category?.name || 'Unknown'}
                </span>
              </td>
              <td className={`py-3 px-4 text-right font-medium ${
                tx.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => onEdit(tx)}
                  className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tx._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
