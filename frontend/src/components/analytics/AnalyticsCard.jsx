import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start    = performance.now()
    const animate  = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round((target) * eased))
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
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl"
      style={{
        padding: '28px',
        gap: '18px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 28px 72px rgba(0,0,0,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)'
      }}
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
          className="flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ width: 64, height: 64, borderRadius: '9999px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', lineHeight: 1 }}
        >
          {icon}
        </div>
      </div>

      {/* Main value */}
      <p
        className="font-extrabold"
        style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1, letterSpacing: '-0.5px', color }}
      >
        {isNumeric ? `${displayed}${suffix}` : value}
      </p>

      {/* Description */}
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.4, marginTop: '-4px' }}>
        {sub}
      </p>
    </div>
  )
}
