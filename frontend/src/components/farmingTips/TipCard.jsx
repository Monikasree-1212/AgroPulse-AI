import { useMemo } from 'react'

const CATEGORY_CONFIG = {
  Weather:       { icon: 'Weather', color: '#3b82f6' },
  Harvest:       { icon: 'Farming', color: '#16a34a' },
  Storage:       { icon: 'Storage', color: '#f97316' },
  Market:        { icon: 'Chart', color: '#8b5cf6' },
  Fertilizer:    { icon: 'Crop', color: '#22c55e' },
  Irrigation:    { icon: 'Water', color: '#06b6d4' },
  'Pest Control':{ icon: 'Pest', color: '#ef4444' },
}

const PRIORITY_STYLES = {
  high:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',    dot: 'bg-red-500'    },
  medium: { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', dot: 'bg-yellow-500' },
  low:    { badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',   dot: 'bg-gray-400'   },
}

const SEASON_STYLES = {
  Kharif: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Rabi:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Zaid:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  All:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

export default function TipCard({ tip }) {
  const catCfg  = useMemo(() => CATEGORY_CONFIG[tip.category] ?? CATEGORY_CONFIG.Weather, [tip.category])
  const priCfg  = useMemo(() => PRIORITY_STYLES[tip.priority] ?? PRIORITY_STYLES.medium,  [tip.priority])
  const seaStyle = SEASON_STYLES[tip.season] ?? SEASON_STYLES.All

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden animate-fadeIn"
      style={{ borderTopWidth: '3px', borderTopColor: catCfg.color }}
    >
      {/* Priority indicator dot */}
      <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${priCfg.dot} ${tip.priority === 'high' ? 'animate-pulse' : ''}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${catCfg.color}18` }}
          >
            {catCfg.icon}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1.5">
              {tip.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Priority badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priCfg.badge}`}>
                {(tip.priority ?? 'medium').toUpperCase()}
              </span>
              {/* Season badge */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${seaStyle}`}>
                {tip.season}
              </span>
              {/* Category badge */}
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${catCfg.color}18`, color: catCfg.color }}
              >
                {tip.category}
              </span>
              {/* Commodity badge */}
              {tip.commodity && tip.commodity !== 'All' && (
                <span className="text-[10px] font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  {tip.commodity}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pl-[52px]">
          {tip.description}
        </p>
      </div>
    </div>
  )
}
