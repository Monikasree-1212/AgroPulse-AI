import { useMemo } from 'react'

const TYPE_CONFIG = {
  price:      { icon: '💲',      label: 'Price Check',  accent: '#16a34a' },
  prediction: { icon: '🔮',    label: 'AI Prediction', accent: '#3b82f6' },
  weather:    { icon: '🌦️', label: 'Weather',       accent: '#f59e0b' },
  profit:     { icon: '💰', label: 'Profit Sim',    accent: '#8b5cf6' },
  mandi:      { icon: '🏪', label: 'Mandi Search',  accent: '#f97316' },
  voice:      { icon: '🎤', label: 'Voice AI',      accent: '#06b6d4' },
  government: { icon: '🏛️', label: 'Gov. Schemes',  accent: '#ec4899' },
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function ActivityCard({ activity, onDelete }) {
  const cfg = useMemo(() => TYPE_CONFIG[activity.activityType] ?? TYPE_CONFIG.price, [activity.activityType])

  return (
    <div
      className="group relative flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn"
      style={{ borderLeftWidth: '3px', borderLeftColor: cfg.accent }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[36px] flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${cfg.accent}18` }}
      >
        {cfg.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${cfg.accent}18`, color: cfg.accent }}
          >
            {cfg.label}
          </span>
          {activity.commodity && (
            <span className="text-[10px] font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {activity.commodity}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug mt-1">
          {activity.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] text-gray-400">{formatTime(activity.createdAt)}</span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600"> - </span>
          <span className="text-[10px] text-gray-400">{timeAgo(activity.createdAt)}</span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(activity._id)}
        title="Remove"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-6 h-6 flex items-center justify-center rounded-md bg-red-100 dark:bg-red-900/40 text-red-500 hover:bg-red-200 dark:hover:bg-red-800 text-xs font-bold flex-shrink-0 self-start mt-0.5"
      >
        No
      </button>
    </div>
  )
}
