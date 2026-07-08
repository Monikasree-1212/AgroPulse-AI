const ICONS = {
  Clear:        '☀️',
  Clouds:       '☁️',
  Rain:         '🌧️',
  Drizzle:      '🌦️',
  Thunderstorm: '⛈️',
  Snow:         '❄️',
  Mist:         '🌫️',
  Fog:          '🌫️',
  Haze:         '🌫️',
}

const COLORS = {
  Clear:        'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border-amber-200 dark:border-amber-800',
  Clouds:       'from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/40 border-slate-200 dark:border-slate-700',
  Rain:         'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800',
  Drizzle:      'from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20 border-sky-200 dark:border-sky-800',
  Thunderstorm: 'from-gray-100 to-slate-100 dark:from-gray-800/60 dark:to-slate-800/50 border-gray-300 dark:border-gray-700',
  Snow:         'from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800',
}

export default function ForecastCard({ day, temperature, condition, humidity, rainfall }) {
  const icon   = ICONS[condition]  || '🌤️'
  const colors = COLORS[condition] || COLORS.Clouds

  return (
    <div className={`bg-gradient-to-br ${colors} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[90px]`}>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{day}</p>
      <span className="text-3xl leading-none">{icon}</span>
      <p className="text-lg font-extrabold text-gray-800 dark:text-white">{temperature}°C</p>
      <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 text-center">{condition}</p>
      <div className="flex gap-2 mt-1">
        <span className="text-[10px] text-blue-500 font-semibold">💧{humidity}%</span>
        {rainfall > 0 && <span className="text-[10px] text-cyan-500 font-semibold">🌧{rainfall}mm</span>}
      </div>
    </div>
  )
}
