interface SummaryCardProps {
  title: string
  value: string
  type: 'income' | 'expense' | 'balance'
  loading?: boolean
}

const config = {
  income: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    accent: 'bg-gradient-to-b from-green-400 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  expense: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
    accent: 'bg-gradient-to-b from-red-400 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    iconBg: 'bg-red-100',
  },
  balance: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    accent: 'bg-gradient-to-b from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
}

const SummaryCard = ({ title, value, type, loading }: SummaryCardProps) => {
  const c = config[type]

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-36 rounded-lg animate-shimmer" />
          ) : (
            <p className={`text-2xl font-bold mt-1.5 ${c.text}`}>{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg} shrink-0`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {c.icon}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
