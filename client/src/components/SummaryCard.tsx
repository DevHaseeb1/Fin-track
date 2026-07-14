interface SummaryCardProps {
  title: string
  value: string
  color: string
  loading?: boolean
}

const SummaryCard = ({ title, value, color, loading }: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <div className="mt-2 h-8 w-32 bg-gray-200 animate-pulse rounded" />
      ) : (
        <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
      )}
    </div>
  )
}

export default SummaryCard
