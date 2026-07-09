import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
  ReferenceLine,
} from 'recharts'
import commodities from '../data/commodities.json'
import WeatherCard from '../components/weather/WeatherCard'
import ForecastCard from '../components/weather/ForecastCard'
import WeatherImpactCard from '../components/weather/WeatherImpactCard'
import MandiCard from '../components/mandi/MandiCard'
import RecommendationCard from '../components/mandi/RecommendationCard'
import ProfitCard from '../components/mandi/ProfitCard'
import ProfitSimulator from '../components/profit/ProfitSimulator'
import GovernmentSchemes from '../components/government/GovernmentSchemes'
import VoiceAssistant from '../components/voice/VoiceAssistant'
import NotificationBell from '../components/notifications/NotificationBell'
import ActivityTimeline from '../components/activity/ActivityTimeline'
import FarmingTips from '../components/farmingTips/FarmingTips'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import ReportsCenter from '../components/reports/ReportsCenter'
import { useGuest } from '../components/auth/GuestMode'
import LoginRequiredModal from '../components/auth/LoginRequiredModal'
import useTranslation from '../hooks/useTranslation'

/* Locked Section */
function LockedSection({ label, onUnlock, t }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      onClick={onUnlock}
    >
      <div className="pointer-events-none blur-sm opacity-50 select-none">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
          </div>
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-2xl group-hover:bg-white/70 dark:group-hover:bg-gray-900/70 transition-all duration-200">
        <span className="text-4xl">Locked</span>
        <p className="text-base font-extrabold text-gray-900 dark:text-white">{t('dashboard.locked.loginRequired')}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.locked.unlockFeatures')}</p>
        <div className="flex gap-2 mt-1">
          <button className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-colors shadow">
            Login
          </button>
          <button className="px-5 py-2 border-2 border-green-600 text-green-700 dark:text-green-400 text-sm font-bold rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

/* Skeleton */
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-9 w-36" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

/* Circular Confidence Meter */
function ConfidenceMeter({ value }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="rotate-[-90deg]" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="#16a34a" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <span className="absolute text-lg font-extrabold text-green-600 dark:text-green-400">{value}%</span>
    </div>
  )
}

/* Custom Chart Tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: Rs.{p.value}/kg
        </p>
      ))}
    </div>
  )
}

/* KPI Card */
function KpiCard({ icon, label, value, sub, gradient, border, accent, badge }) {
  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7"
      style={{
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        gap: '18px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 28px 72px rgba(0,0,0,0.35)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', lineHeight: 1 }}>
            {label}
          </p>
          {badge && (
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', display: 'inline-block', width: 'fit-content' }}>
              {badge}
            </span>
          )}
        </div>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 64, height: 64, borderRadius: '9999px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', fontSize: '28px', lineHeight: 1 }}
        >
          {icon}
        </div>
      </div>

      {/* Main value */}
      <p
        className={`font-extrabold ${accent}`}
        style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1, letterSpacing: '-0.5px' }}
      >
        {value}
      </p>

      {/* Description */}
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.4, marginTop: '-4px' }}>
        {sub}
      </p>
    </div>
  )
}

/* Main Dashboard */
export default function Dashboard() {
  const navigate  = useNavigate()
  const { t } = useTranslation()
  const commodity = localStorage.getItem('commodity') || 'Onion'
  const { isLoggedIn, isGuest, user, logout } = useGuest()

  const [modal, setModal] = useState({ open: false, feature: '', redirectTo: '' })
  const openModal = (feature, redirectTo = '/dashboard') => setModal({ open: true, feature, redirectTo })
  const closeModal = () => setModal({ open: false, feature: '', redirectTo: '' })

  const [chartData,      setChartData]  = useState([])
  const [predictedPrice, setPredicted]  = useState(0)
  const [confidence,     setConfidence] = useState(91)
  const [loading,        setLoading]    = useState(true)
  const [error,          setError]      = useState(null)
  const [weather,        setWeather]     = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError,   setWeatherError]   = useState(false)
  const [mandiRecs,      setMandiRecs]      = useState([])
  const [mandiLoading,   setMandiLoading]   = useState(true)
  const [mandiError,     setMandiError]     = useState(false)
  const [userCoords,     setUserCoords]     = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(false)

    const fetchPrices = api.get(`/api/commodities/${commodity}`)
      .then((r) => setChartData(r.data.prices))
      .catch(() => setChartData([]))

    const fetchPrediction = api.get(`/api/predict/${commodity}/8`)
      .then((r) => {
        setPredicted(r.data.predictedPrice)
        setConfidence(r.data.confidence)
      })
      .catch((err) => {
        console.error('[Dashboard] Prediction fetch failed:', err)
        const msg = err.response?.data?.message || err.message || t('dashboard.errors.aiEngine')
        setError(msg)
      })

    Promise.all([fetchPrices, fetchPrediction]).finally(() => setLoading(false))

    setWeatherLoading(true)
    setWeatherError(false)
    api.get('/api/weather/Delhi')
      .then((r) => setWeather(r.data))
      .catch(() => setWeatherError(true))
      .finally(() => setWeatherLoading(false))

    setMandiLoading(true)
    setMandiError(false)

    // Try to get user coordinates - from state (already acquired) or browser geolocation
    const fetchMandis = (coords) => {
      const url = coords
        ? `/api/mandis/recommend/${commodity}?lat=${coords.lat}&lon=${coords.lon}`
        : `/api/mandis/recommend/${commodity}`
      api.get(url)
        .then((r) => setMandiRecs(r.data))
        .catch(() => setMandiError(true))
        .finally(() => setMandiLoading(false))
    }

    if (userCoords) {
      fetchMandis(userCoords)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
          setUserCoords(coords)
          fetchMandis(coords)
        },
        () => fetchMandis(null),  // permission denied - fall back to profit sort
        { timeout: 5000 }
      )
    } else {
      fetchMandis(null)
    }
  }, [commodity])

  const mandis       = (commodities[commodity] ?? commodities['Onion']).mandis
  const currentPrice = chartData.length ? chartData[chartData.length - 1].price : 0
  const priceRising  = predictedPrice > currentPrice
  const estGain      = currentPrice
    ? (((predictedPrice - currentPrice) / currentPrice) * 100).toFixed(1)
    : '0.0'

  /* Build unified chart: historical + predicted point + future projection */
  const fullChart = chartData.length
    ? [
        ...chartData.map((d) => ({ day: d.day, actual: d.price })),
        { day: 'Next', predicted: predictedPrice },
        { day: 'Proj+1', projected: +(predictedPrice * 1.02).toFixed(2) },
        { day: 'Proj+2', projected: +(predictedPrice * 1.04).toFixed(2) },
      ]
    : []

  const kpis = [
    {
      icon: 'Price', label: t('dashboard.kpi.currentPrice'),
      value: `Rs.${currentPrice}/kg`, sub: t('dashboard.kpi.liveMandi'),
      gradient: 'from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30',
      border: 'border-green-200 dark:border-green-800',
      accent: 'text-green-700 dark:text-green-400',
      badge: t('dashboard.kpi.live'),
    },
    {
      icon: 'Predict', label: t('dashboard.kpi.predictedPrice'),
      value: `Rs.${predictedPrice}/kg`, sub: t('dashboard.kpi.forecastDays'),
      gradient: 'from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'text-blue-700 dark:text-blue-400',
      badge: t('dashboard.kpi.aiForecast'),
    },
    {
      icon: 'Target', label: t('dashboard.kpi.confidence'),
      value: `${confidence}%`, sub: t('dashboard.kpi.modelAccuracy'),
      gradient: 'from-violet-50 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30',
      border: 'border-violet-200 dark:border-violet-800',
      accent: 'text-violet-700 dark:text-violet-400',
      badge: t('dashboard.kpi.high'),
    },
    {
      icon: priceRising ? '' : '',
      label: t('dashboard.kpi.expectedProfit'),
      value: `${priceRising ? '+' : ''}${estGain}%`,
      sub: t('dashboard.kpi.vsCurrentPrice'),
      gradient: priceRising
        ? 'from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/30'
        : 'from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/30',
      border: priceRising
        ? 'border-amber-200 dark:border-amber-800'
        : 'border-red-200 dark:border-red-800',
      accent: priceRising
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400',
      badge: priceRising ? t('dashboard.kpi.profit') : t('dashboard.kpi.lossRisk'),
    },
  ]

  return (
    <div className="min-h-screen bg-farmland transition-colors duration-300">
      {/* Login Required Modal */}
      {modal.open && (
        <LoginRequiredModal
          feature={modal.feature}
          redirectTo={modal.redirectTo}
          onClose={closeModal}
        />
      )}

      {/* Voice Assistant - logged-in only */}
      {isLoggedIn && <VoiceAssistant />}

      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-lg font-extrabold text-white flex items-center gap-2">
            Farming <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Data
            </span>

            {isLoggedIn ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => openModal('Analytics Dashboard')}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Analytics
                </button>
                <button
                  onClick={() => openModal('Reports & Export')}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Reports
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-sm font-extrabold flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  title={t('nav.profile')}
                >
                  {user?.name?.[0]?.toUpperCase() || 'User'}
                </button>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors hidden sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Home
                </button>
                <button
                  onClick={() => document.getElementById('weather-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Weather
                </button>
                <button
                  onClick={() => navigate('/commodity')}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Prices
                </button>
                <button
                  onClick={() => document.getElementById('govt-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors hidden sm:block"
                >
                  Gov Schemes
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-premium text-white text-xs font-bold px-3 py-1.5 rounded-full shadow"
                >
                  Register Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Guest Banner */}
        {isGuest && (
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 p-5 sm:p-6 shadow-lg">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">Farming</span>
                  <h2 className="text-lg font-extrabold text-white">{t('dashboard.guest.welcome')}</h2>
                </div>
                <p className="text-white/80 text-sm">
                  {t('dashboard.guest.desc')}
                  Login to unlock <span className="font-bold text-white">{t('dashboard.guest.features')}</span> {t('dashboard.guest.and')} <span className="font-bold text-white">{t('dashboard.guest.activityHistory')}</span>.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 bg-white text-green-700 font-extrabold text-sm rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-xl transition-all duration-200"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">{t('dashboard.aiDashboard')}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
              {commodity} <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">{t('dashboard.priceIntelligence')}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full shadow ${priceRising ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>
              {priceRising ? t('dashboard.upwardTrend') : t('dashboard.downwardTrend')}
            </span>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Skeleton className="h-5 w-48 mb-6" />
                <Skeleton className="h-56 w-full" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <Skeleton className="h-5 w-36 mb-2" />
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <span className="text-6xl">Warning</span>
            <p className="text-xl font-bold text-red-500">Unable to connect to AI Engine.</p>
            <p className="text-sm text-white/60 max-w-md text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] items-stretch">
              {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
            </div>

            {/* Chart + Confidence + Mandi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Prediction History Chart */}
              <div className="lg:col-span-2 glass-card rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Prediction History Chart</h2>
                    <p className="text-sm text-white/50 mt-0.5">Actual  -  Predicted  -  Future Projection</p>
                  </div>
                  <span className="text-xs font-semibold text-green-300 bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-full">
                    AI Powered
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={fullChart} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                    <ReferenceLine x="Next" stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Forecast', fill: '#f59e0b', fontSize: 10 }} />
                    <Line type="monotone" dataKey="actual"    name="Actual"     stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} activeDot={{ r: 6 }} connectNulls />
                    <Line type="monotone" dataKey="predicted" name="Predicted"  stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 7 }} connectNulls />
                    <Line type="monotone" dataKey="projected" name="Projection" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Right column: Confidence + Mandi */}
              <div className="flex flex-col gap-6">

                {/* Confidence Meter */}
                <div className="glass-card rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center gap-3">
                  <h2 className="text-base font-bold text-white self-start">Confidence Meter</h2>
                  <ConfidenceMeter value={confidence} />
                  <p className="text-sm text-white/60">AI model prediction accuracy</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

                {/* Mandi Prices */}
                <div className="glass-card rounded-2xl shadow-2xl p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-white">Top Mandi Prices</h2>
                    <p className="text-xs text-white/50 mt-0.5">Current rates  -  {commodity}</p>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    {mandis.map(({ name, basePrice, trend, up }) => (
                      <div
                        key={name}
                        className="flex items-center justify-between bg-white/8 hover:bg-white/15 border border-transparent hover:border-green-400/30 rounded-xl px-4 py-3 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center text-green-300 font-bold text-sm">
                            {name[0]}
                          </div>
                          <span className="font-semibold text-white text-sm">{name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white text-sm">Rs.{basePrice}/kg</p>
                          <p className={`text-xs font-semibold ${up ? 'text-green-500' : 'text-red-500'}`}>
                            {up ? 'Up' : 'Down'} {trend}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Prediction Section - locked for guests */}
            {!isLoggedIn && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">AI Engine</p>
                  <h2 className="text-2xl font-extrabold text-white">
                    AI <span className="text-blue-300">Price Prediction</span>
                  </h2>
                </div>
                <LockedSection label={t('dashboard.sections.aiPricePredictionHighlight')} onUnlock={() => openModal(t('dashboard.sections.aiPricePredictionHighlight'))} t={t} />
              </div>
            )}

            {/* AI Recommendation Card */}
            <div className={`relative rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden ${priceRising ? 'bg-gradient-to-r from-green-600 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
              <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
                  AI
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl font-extrabold text-white">AI Recommendation</h2>
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {confidence}% Confidence
                    </span>
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {priceRising ? t('dashboard.upwardTrend') : t('dashboard.downwardTrend')}
                    </span>
                  </div>
                  <p className="text-white/90 text-base leading-relaxed">
                    {priceRising ? (
                      <>
                        <span className="font-bold text-white">Hold your stock.</span> Prices are expected to increase from{' '}
                        <span className="font-bold text-white">Rs.{currentPrice}</span> to{' '}
                        <span className="font-bold text-white">Rs.{predictedPrice}/kg</span>. Wait for the optimal selling window.
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-white">Sell today for maximum profit.</span> Prices are projected to fall from{' '}
                        <span className="font-bold text-white">Rs.{currentPrice}</span> to{' '}
                        <span className="font-bold text-white">Rs.{predictedPrice}/kg</span>. Act now to avoid losses.
                      </>
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <div className="bg-white/20 rounded-2xl px-6 py-4 text-center min-w-[100px]">
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Est. Gain</p>
                    <p className="text-white text-3xl font-extrabold">{priceRising ? '+' : ''}{estGain}%</p>
                  </div>
                  <button
                    onClick={() => navigate('/commodity')}
                    className="text-xs font-semibold text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Change Commodity {'->'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Center Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Alerts {'&'} Updates</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Notification <span className="text-amber-300">Center</span>
                </h2>
              </div>
              {isLoggedIn ? (
                <div className="glass-card rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <span className="text-3xl">Notifications</span>
                  <div>
                    <p className="font-bold text-white text-sm">Notifications are active</p>
                    <p className="text-xs text-white/50 mt-0.5">{t('dashboard.sections.notificationsDesc')}</p>
                  </div>
                </div>
              ) : (
                <LockedSection label={t('dashboard.sections.notificationCenter')} onUnlock={() => openModal(t('dashboard.sections.notificationCenter'))} t={t} />
              )}
            </div>

            {/* Voice Assistant Section - locked for guests */}
            {!isLoggedIn && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">AI Voice</p>
                  <h2 className="text-2xl font-extrabold text-white">
                    Voice <span className="text-cyan-300">Assistant</span>
                  </h2>
                </div>
                <LockedSection label={t('dashboard.sections.voiceAssistant')} onUnlock={() => openModal(t('dashboard.sections.voiceAssistant'))} t={t} />
              </div>
            )}

            {/* AI Farmer Profit Simulator Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">AI Profit Engine</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Farmer Profit <span className="text-green-300">Simulator</span>
                </h2>
              </div>
              {isLoggedIn ? (
                <ProfitSimulator />
              ) : (
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => openModal('Profit Simulator')}
                >
                  <div className="pointer-events-none blur-sm opacity-60 select-none">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
                      </div>
                      <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl w-40" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-2xl group-hover:bg-white/70 dark:group-hover:bg-gray-900/70 transition-all duration-200">
                    <span className="text-4xl">Locked</span>
                    <p className="text-base font-extrabold text-gray-900 dark:text-white">{t('dashboard.locked.loginRequired')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Login to access the Profit Simulator</p>
                    <button className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-colors shadow">
                      Login to Unlock
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Best Mandi Recommendation Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">AI Mandi Engine</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Best Mandi <span className="text-yellow-300">Recommendation</span>
                </h2>
              </div>

              {mandiLoading && (
                <div className="space-y-4">
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-28 w-full" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-72 w-full" />
                </div>
              )}

              {!mandiLoading && mandiError && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-4xl">Market</span>
                  <p className="text-base font-bold text-red-500">Unable to fetch mandi information.</p>
                  <p className="text-sm text-gray-400">{t('dashboard.errors.mandiDesc')}</p>
                  <button
                    onClick={() => {
                      setMandiLoading(true)
                      setMandiError(false)
                      const url = userCoords
                        ? `/api/mandis/recommend/${commodity}?lat=${userCoords.lat}&lon=${userCoords.lon}`
                        : `/api/mandis/recommend/${commodity}`
                      api.get(url)
                        .then((r) => setMandiRecs(r.data))
                        .catch(() => setMandiError(true))
                        .finally(() => setMandiLoading(false))
                    }}
                    className="mt-1 px-5 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-full hover:bg-yellow-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!mandiLoading && !mandiError && mandiRecs.length > 0 && (
                <>
                  <RecommendationCard best={mandiRecs[0]} commodity={commodity} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {mandiRecs.map((m, i) => (
                      <MandiCard key={m._id} mandi={m} isBest={i === 0} />
                    ))}
                  </div>
                  <ProfitCard mandis={mandiRecs} />
                </>
              )}
            </div>

            {/* Government Schemes & MSP Section */}
            <div id="govt-section" className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Policy {'&'} Support</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Government Schemes <span className="text-green-300">{'&'} MSP Portal</span>
                </h2>
              </div>
              <GovernmentSchemes />
            </div>

            {/* Farmer {t('dashboard.guest.activityHistory')} Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Activity Log</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Farmer Activity <span className="text-indigo-300">History</span>
                </h2>
              </div>
              {isLoggedIn ? (
                <ActivityTimeline />
              ) : (
                <LockedSection label={t('dashboard.sections.activityHistory')} onUnlock={() => openModal(t('dashboard.sections.activityHistory'))} t={t} />
              )}
            </div>

            {/* Smart Farming Tips Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">AI Advisory</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Smart Farming Tips <span className="text-emerald-300">{'&'} Seasonal Advisory</span>
                </h2>
              </div>
              <FarmingTips />
            </div>

            {/* Smart Analytics Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Usage Intelligence</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Smart <span className="text-blue-300">Analytics</span>
                </h2>
              </div>
              {isLoggedIn ? (
                <AnalyticsDashboard />
              ) : (
                <LockedSection label={t('dashboard.sections.smartAnalytics')} onUnlock={() => openModal(t('dashboard.sections.smartAnalytics'))} t={t} />
              )}
            </div>

            {/* Reports & Export Center Section */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Data Export</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Reports <span className="text-indigo-300">{'&'} Export Center</span>
                </h2>
              </div>
              {isLoggedIn ? (
                <ReportsCenter />
              ) : (
                <LockedSection label={t('dashboard.sections.reports')} onUnlock={() => openModal(t('dashboard.sections.reports'))} t={t} />
              )}
            </div>

            {/* Weather Section */}
            <div id="weather-section" className="space-y-5">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">Weather Intelligence</p>
                <h2 className="text-2xl font-extrabold text-white">
                  Agricultural <span className="text-blue-300">Weather Insights</span>
                </h2>
              </div>

              {weatherLoading && (
                <div className="space-y-4">
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-36 w-full" />
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-28 w-full" />
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl h-28 w-full" />
                </div>
              )}

              {!weatherLoading && weatherError && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-4xl">Weather</span>
                  <p className="text-base font-bold text-red-500">Weather data unavailable.</p>
                  <p className="text-sm text-gray-400">Check your WEATHER_API_KEY in backend .env</p>
                </div>
              )}

              {!weatherLoading && !weatherError && weather && (
                <>
                  <WeatherCard data={weather} />
                  <ForecastCard forecast={weather.forecast} />
                  <WeatherImpactCard data={weather} />
                </>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  )
}





