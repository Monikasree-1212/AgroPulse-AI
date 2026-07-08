import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import axios from 'axios'
import NotificationCenter from './NotificationCenter'

export default function NotificationBell() {
  const [open,          setOpen]          = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(false)
  const [activeFilter,  setActiveFilter]  = useState('all')
  const [ringing,       setRinging]       = useState(false)

  // useRef — never stale, never triggers re-render
  const prevUnreadRef   = useRef(0)
  const activeFilterRef = useRef('all')

  // Keep ref in sync with state
  useEffect(() => { activeFilterRef.current = activeFilter }, [activeFilter])

  const fetchNotifications = useCallback(async (filterOverride) => {
    const filter = filterOverride ?? activeFilterRef.current
    try {
      const params = filter !== 'all' ? { type: filter } : {}
      const res  = await axios.get('/api/notifications', { params })
      const data = Array.isArray(res.data) ? res.data : []

      const newUnread = data.filter(n => !n.isRead).length
      if (newUnread > prevUnreadRef.current) {
        setRinging(true)
        setTimeout(() => setRinging(false), 800)
      }
      prevUnreadRef.current = newUnread

      setNotifications(data)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, []) // stable — no deps that change

  // Initial fetch + 30s polling
  useEffect(() => {
    fetchNotifications()
    const id = setInterval(fetchNotifications, 30000)
    return () => clearInterval(id)
  }, [fetchNotifications])

  const handleFilterChange = useCallback((f) => {
    setActiveFilter(f)
    setLoading(true)
    setError(false)
    fetchNotifications(f)
  }, [fetchNotifications])

  const handleRead = useCallback(async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
      prevUnreadRef.current = Math.max(0, prevUnreadRef.current - 1)
    } catch (_) {}
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`)
      setNotifications(prev => {
        const removed = prev.find(n => n._id === id)
        if (removed && !removed.isRead) prevUnreadRef.current = Math.max(0, prevUnreadRef.current - 1)
        return prev.filter(n => n._id !== id)
      })
    } catch (_) {}
  }, [])

  const handleClearAll = useCallback(async () => {
    try {
      await axios.delete('/api/notifications')
      setNotifications([])
      prevUnreadRef.current = 0
    } catch (_) {}
  }, [])

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200"
        aria-label="Open notifications"
      >
        <span
          style={{ display: 'inline-block' }}
          className={ringing ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}
        >
          🔔
        </span>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-extrabold rounded-full px-1 shadow-sm animate-pulse select-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        loading={loading}
        error={error}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onRead={handleRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
        onRetry={handleRetry}
      />
    </>
  )
}
