import { useEffect, useRef, useMemo } from 'react'
import { AlertTriangle, BellOff, X } from 'lucide-react'
import NotificationCard from './NotificationCard'

const FILTERS = ['all', 'price', 'weather', 'mandi', 'government', 'profit']

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-2 bg-white/10 rounded w-1/3 mt-1" />
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
  const popupRef = useRef(null)

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose()
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler)
    }
  }, [open, onClose])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const unread = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])

  return (
    <>
      {/* Soft backdrop  does not lock scroll, just dims */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-[60]
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Dropdown popup  absolute to the relative wrapper in NotificationBell */}
      <div
        ref={popupRef}
        role="dialog"
        aria-label="Notifications"
        className={`
          absolute right-0 top-[calc(100%+10px)] z-[70]
          w-[440px] max-w-[calc(100vw-24px)]
          max-h-[80vh]
          flex flex-col
          overflow-hidden
          rounded-2xl
          border border-white/15
          shadow-2xl
          transition-all duration-300 ease-out
          origin-top-right
          ${open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
        style={{
          background: 'rgba(10, 20, 15, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >

        {/*  Header (sticky)  */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0"
          style={{ background: 'rgba(10, 20, 15, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              Notifications
              {unread > 0 && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  {unread} new
                </span>
              )}
            </h2>
            <p className="text-[11px] text-white/40 mt-0.5">
              {loading
                ? 'Loading'
                : `${notifications.length} total alert${notifications.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!loading && !error && notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg hover:bg-red-500/15 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all text-sm font-bold"
              aria-label="Close notifications"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/*  Filter tabs (sticky below header)  */}
        <div
          className="sticky top-[65px] z-10 flex gap-1.5 px-4 py-2.5 border-b border-white/10 overflow-x-auto flex-shrink-0 scrollbar-hide"
          style={{ background: 'rgba(10, 20, 15, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`
                flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full capitalize transition-all duration-150
                ${activeFilter === f
                  ? 'bg-green-500 text-white shadow-sm shadow-green-900/50'
                  : 'bg-white/8 text-white/55 hover:bg-white/15 hover:text-white border border-white/10'}
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/*  Notification list (scrollable)  */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-3 space-y-3 scrollbar-thin-green">

          {/* Loading skeletons */}
          {loading && [...Array(5)].map((_, i) => <SkeletonCard key={i} />)}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <AlertTriangle size={20} className="text-red-400" />
              <p className="text-sm font-bold text-red-400">Unable to load notifications.</p>
              <p className="text-xs text-white/40">Make sure the backend server is running.</p>
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
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <BellOff size={40} className="text-white/30" />
              <p className="text-sm font-bold text-white/50">No notifications yet.</p>
              <p className="text-xs text-white/30 max-w-[260px] leading-relaxed">
                Alerts will appear here automatically as AI monitors your crops.
              </p>
            </div>
          )}

          {/* Notification cards */}
          {!loading && !error && notifications.map(n => (
            <NotificationCard
              key={n._id}
              notification={n}
              onRead={onRead}
              onDelete={onDelete}
            />
          ))}
        </div>

        {/*  Footer  */}
        <div
          className="flex-shrink-0 px-5 py-2.5 border-t border-white/10 text-center"
          style={{ background: 'rgba(10, 20, 15, 0.92)' }}
        >
          <p className="text-[10px] text-white/25">
            Auto-refreshes every 30 s  Powered by AgroPulse AI
          </p>
        </div>
      </div>
    </>
  )
}
