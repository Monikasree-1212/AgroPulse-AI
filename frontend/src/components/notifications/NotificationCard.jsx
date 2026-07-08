import { useMemo } from 'react'

const TYPE_CONFIG = {
  price:      { icon: 'Price',      label: 'Price Alert',  borderColor: '#60a5fa' },
  weather:    { icon: 'Weather',    label: 'Weather',      borderColor: '#facc15' },
  mandi:      { icon: 'Mandi',      label: 'Mandi',        borderColor: '#4ade80' },
  government: { icon: 'Government', label: 'Government',   borderColor: '#c084fc' },
  profit:     { icon: 'Profit',     label: 'Profit',       borderColor: '#fb923c' },
}

const PRIORITY_STYLES = {
  low:      'bg-white/10 text-white/50',
  medium:   'bg-blue-500/20 text-blue-300',
  high:     'bg-yellow-500/20 text-yellow-300',
  critical: 'bg-red-500/20 text-red-300',
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
        border border-white/10
        transition-all duration-200 hover:bg-white/8 animate-fadeIn
        ${notification.isRead ? 'opacity-60' : 'opacity-100'}
      `}
      style={{
        background: notification.isRead
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(255,255,255,0.07)',
        borderLeftWidth: '3px',
        borderLeftColor: cfg.borderColor,
      }}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      )}

      {/* Type icon */}
      <span className="text-xs font-bold flex-shrink-0 mt-0.5 leading-none bg-white/10 px-1.5 py-0.5 rounded">{cfg.icon}</span>

      {/* Body */}
      <div className="flex-1 min-w-0 pr-7">
        {/* Title + priority badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <p className={`text-sm font-bold leading-snug ${notification.isRead ? 'text-white/50' : 'text-white'}`}>
            {notification.title}
          </p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${priorityStyle}`}>
            {(notification.priority ?? 'medium').toUpperCase()}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-white/50 leading-relaxed mb-2">
          {notification.message}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wide">
              {cfg.label}
            </span>
            {notification.commodity && (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-semibold border border-green-500/20">
                {notification.commodity}
              </span>
            )}
          </div>
          <span className="text-[10px] text-white/25 flex-shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Action buttons  appear on hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {!notification.isRead && (
          <button
            onClick={() => onRead(notification._id)}
            title="Mark as read"
            className="w-6 h-6 flex items-center justify-center rounded-md bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors text-xs"
          >
            
          </button>
        )}
        <button
          onClick={() => onDelete(notification._id)}
          title="Delete"
          className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors text-xs"
        >
          
        </button>
      </div>
    </div>
  )
}
