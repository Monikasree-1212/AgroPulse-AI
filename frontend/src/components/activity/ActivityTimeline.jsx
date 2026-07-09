import { useState, useEffect, useCallback, useMemo } from 'react'
import api from '../../services/api'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts'
import ActivityCard from './ActivityCard'
import ActivityFilters from './ActivityFilters'

const TYPE_META = {
  price:      { icon: '💲',   label: 'Price Check',   color: '#16a34a' },
  prediction: { icon: '🔮', label: 'AI Prediction',  color: '#3b82f6' },
  weather:    { icon: '🌦️', label: 'Weather',        color: '#f59e0b' },
  profit:     { icon: '💰', label: 'Profit Sim',     color: '#8b5cf6' },
  mandi:      { icon: '🏪', label: 'Mandi Search',   color: '#f97316' },
  voice:      { icon: '🎤', label: 'Voice AI',       color: '#06b6d4' },
  government: { icon: '🏛️', label: 'Gov. Schemes',   color: '#ec4899' },
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-extrabold mb-0.5" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color ?? p.fill }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function groupByDay(activities) {
  const map = {}
  activities.forEach(a => {
    const day = new Date(a.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    map[day] = (map[day] ?? 0) + 1
  })
  return Object.entries(map).slice(-7).map(([day, count]) => ({ day, count }))
}

function groupByType(activities) {
  const map = {}
  activities.forEach(a => {
    map[a.activityType] = (map[a.activityType] ?? 0) + 1
  })
  return Object.entries(map).map(([type, value]) => ({
    name:  TYPE_META[type]?.label ?? type,
    value,
    color: TYPE_META[type]?.color ?? '#9ca3af',
  }))
}

function isToday(date) {
  const d = new Date(date)
  const n = new Date()
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
}

function isThisWeek(date) {
  return Date.now() - new Date(date) < 7 * 24 * 60 * 60 * 1000
}

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(false)
  const [filter,     setFilter]     = useState('all')

  const fetchActivities = useCallback(async () => {
    try {
      const res  = await api.get('/api/activities')
      const data = Array.isArray(res.data) ? res.data : []
      setActivities(data)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
    const id = setInterval(fetchActivities, 30000)
    return () => clearInterval(id)
  }, [fetchActivities])

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/api/activities/${id}`)
      setActivities(prev => prev.filter(a => a._id !== id))
    } catch (_) {}
  }, [])

  const handleClearAll = useCallback(async () => {
    try {
      await api.delete('/api/activities')
      setActivities([])
    } catch (_) {}
  }, [])

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchActivities()
  }, [fetchActivities])

  // Counts per type (from all activities, not filtered)
  const counts = useMemo(() => {
    const map = {}
    activities.forEach(a => { map[a.activityType] = (map[a.activityType] ?? 0) + 1 })
    return map
  }, [activities])

  const filtered = useMemo(() =>
    filter === 'all' ? activities : activities.filter(a => a.activityType === filter),
    [activities, filter]
  )

  // Stats
  const todayCount   = useMemo(() => activities.filter(a => isToday(a.createdAt)).length, [activities])
  const weekCount    = useMemo(() => activities.filter(a => isThisWeek(a.createdAt)).length, [activities])
  const predCount    = useMemo(() => activities.filter(a => a.activityType === 'prediction').length, [activities])
  const mostUsed     = useMemo(() => {
    if (!activities.length) return '-'
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? (TYPE_META[top[0]]?.label ?? top[0]) : '-'
  }, [counts, activities])

  const dailyData  = useMemo(() => groupByDay(activities), [activities])
  const typeData   = useMemo(() => groupByType(activities), [activities])

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="Calendar" label="Today's Activities" value={todayCount}  sub="Actions today"          color="#16a34a" />
        <StatCard icon="Calendar" label="This Week"          value={weekCount}   sub="Last 7 days"            color="#3b82f6" />
        <StatCard icon="Top" label="Most Used Module"   value={mostUsed}    sub="By activity count"      color="#f59e0b" />
        <StatCard icon="AI" label="AI Predictions"     value={predCount}   sub="Total predictions used" color="#8b5cf6" />
      </div>

      {/* Charts */}
      {!loading && !error && activities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Daily Activity Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Daily Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Actions per day (last 7 days)</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Activities" fill="#16a34a" radius={[4, 4, 0, 0]} animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feature Usage Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Most Used Features</h3>
              <p className="text-xs text-gray-400 mt-0.5">Activity breakdown by module</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={600}
                >
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters + Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Activity Timeline</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Loading...' : `${filtered.length} activit${filtered.length !== 1 ? 'ies' : 'y'}`}
            </p>
          </div>
          {!loading && !error && activities.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          <ActivityFilters active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-3 max-h-[520px] overflow-y-auto scrollbar-hide">

          {loading && [...Array(5)].map((_, i) => <SkeletonCard key={i} />)}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="text-5xl">Warning</span>
              <p className="text-sm font-bold text-red-500">Unable to load activity history.</p>
              <p className="text-xs text-gray-400">Make sure the backend server is running.</p>
              <button
                onClick={handleRetry}
                className="mt-1 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="text-5xl"></span>
              <p className="text-base font-bold text-gray-500 dark:text-gray-400">No activity yet.</p>
              <p className="text-sm text-gray-400">
                Your actions on AgroPulse AI will be recorded here automatically.
              </p>
            </div>
          )}

          {!loading && !error && filtered.map(a => (
            <ActivityCard key={a._id} activity={a} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  )
}
