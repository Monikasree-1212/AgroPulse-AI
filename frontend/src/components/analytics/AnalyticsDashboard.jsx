import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import AnalyticsCard from './AnalyticsCard'
import UsageChart from './UsageChart'
import CommodityInsightsChart from './CommodityInsightsChart'
import PerformanceChart from './PerformanceChart'

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1" />
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>
  )
}

function SkeletonChart() {
  return <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-72 animate-pulse" />
}

function InsightItem({ text, index }) {
  const icons = ['💡', '📊', '🎯', '🌤️', '🧮', '📈', '🏆', '🎙️']
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150 animate-fadeIn">
      <span className="text-lg flex-shrink-0">{icons[index % icons.length]}</span>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{text}</p>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/analytics/dashboard')
      setData(res.data)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const kpis = data ? [
    { icon: '🤖', label: 'AI Predictions',       value: data.totalPredictions,       sub: 'Total predictions run',        color: '#3b82f6', badge: 'AI'       },
    { icon: '🌤️', label: 'Weather Checks',        value: data.totalWeatherChecks,     sub: 'Weather module uses',          color: '#f59e0b', badge: 'Live'     },
    { icon: '🧮', label: 'Profit Simulations',    value: data.totalProfitSimulations, sub: 'Simulator runs',               color: '#8b5cf6', badge: 'Profit'   },
    { icon: '🏪', label: 'Mandi Searches',        value: data.totalMandiSearches,     sub: 'Best mandi lookups',           color: '#f97316', badge: 'Market'   },
    { icon: '🎙️', label: 'Voice Queries',         value: data.totalVoiceQueries,      sub: 'Voice assistant uses',         color: '#06b6d4', badge: 'Voice'    },
    { icon: '🔔', label: 'Notifications',         value: data.totalNotifications,     sub: 'Total alerts generated',       color: '#ec4899', badge: 'Alerts'   },
    { icon: '🎯', label: 'Prediction Accuracy',   value: data.averagePredictionAccuracy, sub: 'Average model accuracy',    color: '#16a34a', suffix: '%', badge: 'Avg' },
    { icon: '📈', label: 'Weekly Growth',         value: Math.abs(data.weeklyGrowth), sub: data.weeklyGrowth >= 0 ? 'Usage increase this week' : 'Usage decrease this week', color: data.weeklyGrowth >= 0 ? '#16a34a' : '#ef4444', suffix: '%', badge: data.weeklyGrowth >= 0 ? '↑' : '↓' },
  ] : []

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl">⚠️</span>
          <p className="text-sm font-bold text-red-500">Unable to load analytics.</p>
          <p className="text-xs text-gray-400">Make sure the backend server is running.</p>
          <button
            onClick={() => { setLoading(true); setError(false); fetchData() }}
            className="mt-1 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && data.totalActivities === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className="text-5xl">📊</span>
          <p className="text-base font-bold text-gray-500 dark:text-gray-400">No analytics available yet.</p>
          <p className="text-sm text-gray-400 text-center">
            Start using AgroPulse AI features to generate insights.
          </p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(k => (
              <AnalyticsCard key={k.label} {...k} />
            ))}
          </div>

          {/* Highlight row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-5 text-white shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Favourite Commodity</p>
              <p className="text-2xl font-extrabold">{data.favoriteCommodity || '—'}</p>
              <p className="text-xs text-white/70 mt-1">Most searched by you</p>
            </div>
            <div className="bg-gradient-to-br from-violet-600 to-purple-500 rounded-2xl p-5 text-white shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Highest Profit Commodity</p>
              <p className="text-2xl font-extrabold">{data.highestProfitCommodity || '—'}</p>
              <p className="text-xs text-white/70 mt-1">Best ROI in simulations</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-5 text-white shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Total Activities</p>
              <p className="text-2xl font-extrabold">{data.totalActivities}</p>
              <p className="text-xs text-white/70 mt-1">All-time platform actions</p>
            </div>
          </div>

          {/* Feature Usage Bar Chart */}
          <UsageChart data={data.featureUsage} />

          {/* Commodity Pie + Avg Prices Bar */}
          <CommodityInsightsChart
            usageData={data.commodityUsage}
            avgPrices={data.avgPrices}
          />

          {/* Daily Activity Area + Profit Trend Line */}
          <PerformanceChart
            dailyActivity={data.dailyActivity}
            profitTrend={data.profitTrend}
          />

          {/* AI Insights Panel */}
          {data.insights?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Insights</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Personalised observations from your usage</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.insights.map((text, i) => (
                  <InsightItem key={i} text={text} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
