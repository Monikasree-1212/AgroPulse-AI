import { useNavigate } from 'react-router-dom'
import useTranslation from '../hooks/useTranslation'

const commodities = [
  { name: 'Onion', emoji: 'O', accent: 'text-rose-300' },
  { name: 'Potato', emoji: 'P', accent: 'text-amber-300' },
  { name: 'Pulses', emoji: 'Pu', accent: 'text-lime-300' },
  { name: 'Maize', emoji: 'M', accent: 'text-yellow-300' },
  { name: 'Coconut', emoji: 'C', accent: 'text-teal-300' },
]

export default function Commodity() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleSelect(name) {
    localStorage.setItem('commodity', name)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-farmland relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-500/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none animate-float-slow" />
      <nav className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="glass-nav rounded-2xl px-5 h-14 flex items-center justify-between shadow-2xl">
            <a href="/" className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
            </a>
            <span className="text-sm text-white/60 hidden sm:block font-medium">{t('commodity.stepLabel')}</span>
          </div>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-slideUp">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">{t('commodity.step1Badge')}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-2xl">
            {t('commodity.title')} <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">{t('commodity.titleHighlight')}</span>
          </h1>
          <p className="text-white/60 text-lg max-w-md mx-auto">{t('commodity.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {commodities.map(({ name, emoji, accent }) => (
            <button key={name} onClick={() => handleSelect(name)} className="group glass-card rounded-2xl p-6 text-left hover:bg-white/15 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-xl font-extrabold ${accent} flex-shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}>{emoji}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">{name}</h2>
                  <p className="text-white/55 text-sm leading-relaxed">{t(`commodity.descs.${name}`)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">{t('commodity.aiForecast')}</span>
                <span className="text-xs font-semibold text-green-300 bg-green-500/15 border border-green-400/25 px-2.5 py-1 rounded-full">{t('commodity.selectArrow')}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-white/40 mt-10">{t('commodity.comingSoon')}</p>
      </div>
    </div>
  )
}

