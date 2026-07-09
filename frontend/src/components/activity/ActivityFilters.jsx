const FILTERS = [
  { key: 'all',        label: 'All',        icon: 'List' },
  { key: 'price',      label: 'Price',      icon: '💲' },
  { key: 'prediction', label: 'Prediction', icon: '🔮' },
  { key: 'weather',    label: 'Weather',    icon: '🌦️' },
  { key: 'profit',     label: 'Profit',     icon: '💰' },
  { key: 'mandi',      label: 'Mandi',      icon: '🏪' },
  { key: 'voice',      label: 'Voice',      icon: '🎤' },
  { key: 'government', label: 'Government', icon: '🏛️' },
]

export default function ActivityFilters({ active, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label, icon }) => {
        const count = key === 'all'
          ? Object.values(counts).reduce((s, v) => s + v, 0)
          : (counts[key] ?? 0)
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              transition-all duration-150 border
              ${active === key
                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400'}
            `}
          >
            <span>{icon}</span>
            <span>{label}</span>
            {count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active === key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
