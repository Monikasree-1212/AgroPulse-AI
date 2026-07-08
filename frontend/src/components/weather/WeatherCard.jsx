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

const GRADIENTS = {
  Clear:        'from-amber-400 to-orange-300',
  Clouds:       'from-slate-400 to-gray-300',
  Rain:         'from-blue-600 to-cyan-500',
  Drizzle:      'from-blue-400 to-sky-300',
  Thunderstorm: 'from-gray-700 to-slate-600',
  Snow:         'from-sky-200 to-blue-100',
  Mist:         'from-gray-400 to-slate-300',
  Fog:          'from-gray-400 to-slate-300',
  Haze:         'from-yellow-300 to-amber-200',
}

function RainAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-white/30 rounded-full animate-bounce"
          style={{
            left: `${8 + i * 7.5}%`,
            top: `${Math.random() * 40}%`,
            height: `${10 + Math.random() * 14}px`,
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

function SunAnimation() {
  return (
    <div className="absolute -top-8 -right-8 pointer-events-none">
      <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse" />
      <div className="absolute inset-4 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
    </div>
  )
}

function CloudAnimation() {
  return (
    <div className="absolute top-4 right-4 pointer-events-none opacity-30">
      <div className="w-20 h-8 bg-white rounded-full animate-pulse" />
      <div className="absolute -top-3 left-4 w-12 h-10 bg-white rounded-full" />
    </div>
  )
}

function WindAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 bg-white/20 rounded-full"
          style={{
            width: `${30 + i * 15}%`,
            top: `${20 + i * 18}%`,
            left: '-10%',
            animation: `slideRight ${1.2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }}
        />
      ))}
    </div>
  )
}

const StatBadge = ({ icon, label, value }) => (
  <div className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-2 min-w-[72px]">
    <span className="text-lg">{icon}</span>
    <span className="text-white text-sm font-bold mt-0.5">{value}</span>
    <span className="text-white/70 text-[10px] font-medium">{label}</span>
  </div>
)

export default function WeatherCard({ data }) {
  const condition = data.condition || 'Clear'
  const icon      = ICONS[condition]      || '🌤️'
  const gradient  = GRADIENTS[condition]  || 'from-sky-400 to-blue-300'

  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg overflow-hidden`}>
      {condition === 'Rain'         && <RainAnimation />}
      {condition === 'Drizzle'      && <RainAnimation />}
      {condition === 'Thunderstorm' && <RainAnimation />}
      {condition === 'Clear'        && <SunAnimation />}
      {condition === 'Clouds'       && <CloudAnimation />}
      {(condition === 'Mist' || condition === 'Fog' || condition === 'Haze') && <WindAnimation />}

      <style>{`
        @keyframes slideRight {
          0%   { transform: translateX(0);    opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">Live Weather</p>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
          <h2 className="text-white text-2xl font-extrabold">{data.city}</h2>
          <p className="text-white/80 text-sm capitalize mt-0.5">{data.description}</p>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-6xl font-extrabold text-white leading-none">{data.temperature}°</span>
            <span className="text-white/70 text-lg font-semibold mb-1">C</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-7xl leading-none drop-shadow-lg">{icon}</span>
          <span className="text-white/80 text-sm font-semibold">{condition}</span>
        </div>
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <StatBadge icon="💧" label="Humidity"   value={`${data.humidity}%`} />
        <StatBadge icon="🌧️" label="Rainfall"   value={`${data.rainfall}mm`} />
        <StatBadge icon="💨" label="Wind"        value={`${data.windSpeed}km/h`} />
      </div>
    </div>
  )
}
