interface StatCardProps {
  value: string | number
  label: string
  color?: string
}

export default function StatCard({ value, label, color = 'text-white' }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 md:p-4 text-center flex-1 min-w-0">
      <div className={`text-lg md:text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  )
}
