import { useEffect, useRef, useState } from 'react'

function CountUp({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!target) return
    const duration = 1200
    const start    = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target])

  return <>{val}{suffix}</>
}

export default function ProfileStats({ stats }) {
  if (!stats) return null

  const cards = [
    { icon: '🤖', label: 'AI Predictions',       value: stats.totalPredictions,       suffix: '',  color: 'from-blue-500 to-cyan-500' },
    { icon: '💰', label: 'Profit Simulations',    value: stats.totalProfitSimulations, suffix: '',  color: 'from-violet-500 to-purple-500' },
    { icon: '🌦️', label: 'Weather Checks',        value: stats.totalWeatherChecks,     suffix: '',  color: 'from-amber-500 to-orange-500' },
    { icon: '🏪', label: 'Mandi Searches',        value: stats.totalMandiSearches,     suffix: '',  color: 'from-rose-500 to-pink-500' },
    { icon: '⭐', label: 'Favourite Commodity',   value: null, text: stats.favoriteCommodity,       color: 'from-green-500 to-emerald-500' },
    { icon: '🎯', label: 'Prediction Accuracy',   value: stats.averagePredictionAccuracy, suffix: '%', color: 'from-teal-500 to-green-500' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <span className="text-[36px]">📈</span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Your Statistics</h3>
          <p className="text-xs text-gray-400 mt-0.5">All-time platform usage</p>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(({ icon, label, value, suffix, text, color }) => (
          <div
            key={label}
            className={`group relative bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
            <span className="text-[36px] block mb-2">{icon}</span>
            <p className="text-xl font-extrabold leading-none">
              {text ?? <CountUp target={value ?? 0} suffix={suffix} />}
            </p>
            <p className="text-white/80 text-xs font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
