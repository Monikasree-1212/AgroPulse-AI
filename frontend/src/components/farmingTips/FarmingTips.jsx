import { useState, useEffect, useCallback, useMemo } from 'react'
import api from '../../services/api'
import TipCard from './TipCard'
import SeasonSelector, { getCurrentSeason } from './SeasonSelector'
import CategoryFilter from './CategoryFilter'

const COMMODITIES = ['All', 'Onion', 'Potato', 'Pulses', 'Maize']
const PRIORITIES  = ['All', 'high', 'medium', 'low']

const PRIORITY_LABEL = { high: 'High High', medium: 'Medium Medium', low: 'Low Low' }

function SkeletonTip() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="flex gap-1.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
          </div>
        </div>
      </div>
      <div className="space-y-1.5 pl-[52px]">
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  )
}

function StatBadge({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-base font-extrabold" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}

export default function FarmingTips() {
  const storedCommodity = localStorage.getItem('commodity') || 'Onion'

  const [tips,          setTips]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(false)
  const [commodity,     setCommodity]     = useState(storedCommodity)
  const [season,        setSeason]        = useState('All')
  const [category,      setCategory]      = useState('All')
  const [priority,      setPriority]      = useState('All')

  const fetchTips = useCallback(async (com) => {
    setLoading(true)
    setError(false)
    try {
      const params = {}
      if (com && com !== 'All') params.commodity = com
      const res  = await api.get('/api/farming-tips', { params })
      setTips(Array.isArray(res.data) ? res.data : [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTips(commodity)
  }, [commodity, fetchTips])

  const handleCommodityChange = (c) => {
    setCommodity(c)
    setCategory('All')
    setSeason('All')
    setPriority('All')
  }

  // Client-side filtering for season / category / priority
  const filtered = useMemo(() => {
    return tips.filter(t => {
      if (season   !== 'All' && t.season   !== season   && t.season !== 'All') return false
      if (category !== 'All' && t.category !== category)                        return false
      if (priority !== 'All' && t.priority !== priority)                        return false
      return true
    })
  }, [tips, season, category, priority])

  // Category counts for filter badges (from filtered-by-season-and-priority only)
  const categoryCounts = useMemo(() => {
    const map = {}
    tips
      .filter(t => {
        if (season   !== 'All' && t.season   !== season   && t.season !== 'All') return false
        if (priority !== 'All' && t.priority !== priority)                        return false
        return true
      })
      .forEach(t => { map[t.category] = (map[t.category] ?? 0) + 1 })
    return map
  }, [tips, season, priority])

  // Stats
  const highCount   = useMemo(() => filtered.filter(t => t.priority === 'high').length,   [filtered])
  const medCount    = useMemo(() => filtered.filter(t => t.priority === 'medium').length,  [filtered])
  const currentSeason = getCurrentSeason()

  return (
    <div className="space-y-6">

      {/* Commodity Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Select Commodity</p>
            <div className="flex flex-wrap gap-2">
              {COMMODITIES.map(c => (
                <button
                  key={c}
                  onClick={() => handleCommodityChange(c)}
                  className={`
                    text-sm font-semibold px-4 py-1.5 rounded-full border transition-all duration-150
                    ${commodity === c
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400'}
                  `}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Priority</p>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`
                    text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-all duration-150
                    ${priority === p
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'}
                  `}
                >
                  {p === 'All' ? 'All' : PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Season Selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Season</p>
        <SeasonSelector active={season} onChange={setSeason} />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Category</p>
        <CategoryFilter active={category} onChange={setCategory} counts={categoryCounts} />
      </div>

      {/* Stats Row */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBadge icon="List" label="Total Tips"     value={filtered.length} color="#16a34a" />
          <StatBadge icon="High" label="High Priority"  value={highCount}       color="#ef4444" />
          <StatBadge icon="Medium" label="Medium Priority" value={medCount}       color="#f59e0b" />
          <StatBadge icon="Crop" label="Current Season"  value={currentSeason}  color="#8b5cf6" />
        </div>
      )}

      {/* Tips Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonTip key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl">Warning</span>
          <p className="text-sm font-bold text-red-500">Unable to load farming tips.</p>
          <p className="text-xs text-gray-400">Make sure the backend server is running.</p>
          <button
            onClick={() => fetchTips(commodity)}
            className="mt-1 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl"></span>
          <p className="text-base font-bold text-gray-500 dark:text-gray-400">No recommendations available.</p>
          <p className="text-sm text-gray-400 text-center">
            Try changing the season, category, or commodity filter.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tip, i) => (
            <TipCard key={tip._id ?? `ctx-${i}`} tip={tip} />
          ))}
        </div>
      )}
    </div>
  )
}
