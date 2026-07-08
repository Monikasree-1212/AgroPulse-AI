import { useMemo } from 'react'

const TYPE_CONFIG = {
  price:      { icon: '📈', label: 'Price Alert',  borderColor: '#60a5fa' /* blue-400  */ },
  weather:    { icon: '🌧️', label: 'Weather',      borderColor: '#facc15' /* yellow-400*/ },
  mandi:      { icon: '🏪', label: 'Mandi',        borderColor: '#4ade80' /* green-400 */ },
  government: { icon: '🏛️', label: 'Government',   borderColor: '#c084fc' /* purple-400*/ },
  profit:     { icon: '💰', label: 'Profit',       borderColor: '#fb923c' /* orange-400*/ },
}

const PRIORITY_STYLES = {
  low:      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  medium:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationCard({ notification, onRead, onDelete }) {
  const cfg = useMemo(
    () => TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.price,
    [notification.type]
  )
  const priorityStyle = PRIORITY_STYLES[notification.priority] ?? PRIORITY_STYLES.medium

  return (
    <div
      className={`
        group relative flex gap-3 p-4 rounded-xl
        border border-gray-100 dark:border-gray-700
        transition-all duration-200 hover:shadow-md animate-fadeIn
        ${notification.isRead
          ? 'bg-gray-50 dark:bg-gray-800/50'
          : 'bg-white dark:bg-gray-800 shadow-sm'}
      `}
      /* inline style for left accent — avoids Tailwind v4 border shorthand conflict */
      style={{ borderLeftWidth: '4px', borderLeftColor: cfg.borderColor }}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      )}

      {/* Type icon */}
      <span className="text-2xl flex-shrink-0 mt-0.5 leading-none">{cfg.icon}</span>

      {/* Body */}
      <div className="flex-1 min-w-0 pr-6">
        {/* Title + priority */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <p className={`text-sm font-bold leading-snug ${notification.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {notification.title}
          </p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${priorityStyle}`}>
            {(notification.priority ?? 'medium').toUpperCase()}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
          {notification.message}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              {cfg.label}
            </span>
            {notification.commodity && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-semibold">
                {notification.commodity}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 flex-shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Action buttons — always visible on mobile, hover on desktop */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {!notification.isRead && (
          <button
            onClick={() => onRead(notification._id)}
            title="Mark as read"
            className="w-6 h-6 flex items-center justify-center rounded-md bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-xs font-bold"
          >
            ✓
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          title="Delete"
          className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100 dark:bg-red-900/40 text-red-500 hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
