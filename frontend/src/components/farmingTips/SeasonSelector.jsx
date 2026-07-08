const SEASONS = [
  { key: 'All',    label: 'All Seasons', icon: '🌍', desc: 'Year-round' },
  { key: 'Kharif', label: 'Kharif',      icon: '🌧️', desc: 'Jun – Sep'  },
  { key: 'Rabi',   label: 'Rabi',        icon: '❄️',  desc: 'Oct – Feb'  },
  { key: 'Zaid',   label: 'Zaid',        icon: '☀️',  desc: 'Mar – May'  },
]

export function getCurrentSeason() {
  const m = new Date().getMonth() + 1
  if (m >= 6 && m <= 9)  return 'Kharif'
  if (m >= 10 || m <= 2) return 'Rabi'
  return 'Zaid'
}

export default function SeasonSelector({ active, onChange }) {
  const current = getCurrentSeason()
  return (
    <div className="flex flex-wrap gap-2">
      {SEASONS.map(({ key, label, icon, desc }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold
            transition-all duration-150
            ${active === key
              ? 'bg-green-600 text-white border-green-600 shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400'}
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
          {key === current && key !== 'All' && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active === key ? 'bg-white/20 text-white' : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'}`}>
              Now
            </span>
          )}
          <span className={`text-[10px] hidden sm:inline ${active === key ? 'text-white/70' : 'text-gray-400'}`}>
            {desc}
          </span>
        </button>
      ))}
    </div>
  )
}
