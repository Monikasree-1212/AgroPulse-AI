import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start     = performance.now()
    const startVal  = 0
    const animate   = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startVal + (target - startVal) * eased))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function AnalyticsCard({ icon, label, value, sub, color, suffix = '', badge }) {
  const isNumeric = typeof value === 'number'
  const displayed = useCountUp(isNumeric ? value : 0)

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
          {badge && (
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {badge}
            </span>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${color}18` }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold mb-0.5" style={{ color }}>
        {isNumeric ? `${displayed}${suffix}` : value}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
  )
}
