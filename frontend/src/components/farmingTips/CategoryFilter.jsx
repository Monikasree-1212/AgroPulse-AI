const CATEGORIES = [
  { key: 'All',          icon: '📋' },
  { key: 'Weather',      icon: '🌤️' },
  { key: 'Harvest',      icon: '🌾' },
  { key: 'Storage',      icon: '🏚️' },
  { key: 'Market',       icon: '📊' },
  { key: 'Fertilizer',   icon: '🌱' },
  { key: 'Irrigation',   icon: '💧' },
  { key: 'Pest Control', icon: '🐛' },
]

export default function CategoryFilter({ active, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ key, icon }) => {
        const count = key === 'All'
          ? Object.values(counts).reduce((s, v) => s + v, 0)
          : (counts[key] ?? 0)
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              border transition-all duration-150
              ${active === key
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400'}
            `}
          >
            <span>{icon}</span>
            <span>{key}</span>
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
