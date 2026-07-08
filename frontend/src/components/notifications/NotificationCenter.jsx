import { useEffect, useRef, useMemo } from 'react'
import NotificationCard from './NotificationCard'

const FILTERS = ['all', 'price', 'weather', 'mandi', 'government', 'profit']

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-1" />
      </div>
    </div>
  )
}

export default function NotificationCenter({
  open, onClose,
  notifications, loading, error,
  activeFilter, onFilterChange,
  onRead, onDelete, onClearAll, onRetry,
}) {
  const drawerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose()
    }
    // slight delay so the open-click itself doesn't immediately close
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler)
    }
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const unread = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Notifications"
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[420px] z-[70]
          bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              🔔 Notifications
              {unread > 0 && (
                <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Loading…' : `${notifications.length} total alert${notifications.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!loading && !error && notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-1.5 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto flex-shrink-0 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`
                flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all duration-150
                ${activeFilter === f
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* Loading skeletons */}
          {loading && [...Array(4)].map((_, i) => <SkeletonCard key={i} />)}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <span className="text-5xl">⚠️</span>
              <p className="text-sm font-bold text-red-500">Unable to load notifications.</p>
              <p className="text-xs text-gray-400">Make sure the backend server is running.</p>
              <button
                onClick={onRetry}
                className="mt-1 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <span className="text-6xl">🔕</span>
              <p className="text-base font-bold text-gray-500 dark:text-gray-400">No notifications yet.</p>
              <p className="text-sm text-gray-400">
                Alerts will appear here automatically as AI monitors your crops.
              </p>
            </div>
          )}

          {/* Notification list */}
          {!loading && !error && notifications.map(n => (
            <NotificationCard
              key={n._id}
              notification={n}
              onRead={onRead}
              onDelete={onDelete}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <p className="text-[10px] text-gray-400 text-center">
            Auto-refreshes every 30 seconds · Powered by AgroPulse AI
          </p>
        </div>
      </div>
    </>
  )
}
