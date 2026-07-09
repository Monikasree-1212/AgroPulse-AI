import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTranslation from '../hooks/useTranslation'

function Blob({ className }) {
  return <div className={`absolute rounded-full pointer-events-none animate-pulse-glow ${className}`} />
}

const TESTIMONIALS = [
  { name: 'Ramesh Patil', state: 'Maharashtra', crop: 'Onion', text: 'AgroPulse AI helped me sell at the right time and earn more than last season.', avatar: 'R' },
  { name: 'Sunita Devi', state: 'Uttar Pradesh', crop: 'Potato', text: 'The mandi recommendation helped me find a better price close to home.', avatar: 'S' },
  { name: 'Kiran Reddy', state: 'Telangana', crop: 'Maize', text: 'The profit simulator helped me plan my season with confidence.', avatar: 'K' },
  { name: 'Gurpreet Singh', state: 'Punjab', crop: 'Wheat', text: 'Government schemes were easier to discover and compare.', avatar: 'G' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const features = [
    { icon: '🤖', title: t('landing.features.aiPricePrediction'), desc: t('landing.features.aiPricePredictionDesc'), color: '#3b82f6' },
    { icon: '🌦️', title: t('landing.features.weatherIntelligence'), desc: t('landing.features.weatherIntelligenceDesc'), color: '#f59e0b' },
    { icon: '🏪', title: t('landing.features.smartMandiFinder'), desc: t('landing.features.smartMandiFinderDesc'), color: '#16a34a' },
    { icon: '💰', title: t('landing.features.profitSimulator'), desc: t('landing.features.profitSimulatorDesc'), color: '#8b5cf6' },
    { icon: '🏛️', title: t('landing.features.governmentSchemes'), desc: t('landing.features.governmentSchemesDesc'), color: '#f97316' },
    { icon: '🎤', title: t('landing.features.voiceAssistant'), desc: t('landing.features.voiceAssistantDesc'), color: '#06b6d4' },
    { icon: '📈', title: t('landing.features.smartAnalytics'), desc: t('landing.features.smartAnalyticsDesc'), color: '#ec4899' },
    { icon: '🎯', title: t('landing.features.reportsExport'), desc: t('landing.features.reportsExportDesc'), color: '#10b981' },
  ]

  const steps = [
    { num: '01', title: t('landing.steps.registerFree'), desc: t('landing.steps.registerFreeDesc') },
    { num: '02', title: t('landing.steps.selectCrop'), desc: t('landing.steps.selectCropDesc') },
    { num: '03', title: t('landing.steps.aiAnalyses'), desc: t('landing.steps.aiAnalysesDesc') },
    { num: '04', title: t('landing.steps.maximiseProfit'), desc: t('landing.steps.maximiseProfitDesc') },
  ]

  const faqs = [
    { q: t('landing.faqs.q1'), a: t('landing.faqs.a1') },
    { q: t('landing.faqs.q2'), a: t('landing.faqs.a2') },
    { q: t('landing.faqs.q3'), a: t('landing.faqs.a3') },
    { q: t('landing.faqs.q4'), a: t('landing.faqs.a4') },
    { q: t('landing.faqs.q5'), a: t('landing.faqs.a5') },
  ]

  const stats = [
    { val: '200+', label: t('landing.stats.commodities') },
    { val: '500+', label: t('landing.stats.mandisTracked') },
    { val: '91%', label: t('landing.stats.aiAccuracy') },
    { val: '10L+', label: t('landing.stats.farmersServed') },
  ]

  useEffect(() => {
    const stored = localStorage.getItem('agropulse_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('agropulse_token')
    localStorage.removeItem('agropulse_user')
    setUser(null)
  }

  const handleGetStarted = () => {
    const token = localStorage.getItem('agropulse_token')
    navigate(token ? '/dashboard' : '/register')
  }

  const navLinks = [
    ['#features', t('nav.features')],
    ['#how-it-works', t('nav.howItWorks')],
    ['#testimonials', t('nav.testimonials')],
    ['#faq', t('nav.faq')],
  ]

  return (
    <div className="min-h-screen font-sans text-white transition-colors duration-300 bg-gray-950">
      <nav className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-nav rounded-2xl px-5 h-14 flex items-center justify-between shadow-2xl">
            <Link to="/" className="text-lg font-extrabold text-white flex items-center gap-2 drop-shadow">
              <span className="text-green-300">AgroPulse</span> <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">🤖</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/75">
              {navLinks.map(([href, label]) => <a key={href} href={href} className="hover:text-green-300 transition-colors duration-200">{label}</a>)}
            </div>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-semibold text-green-300 hover:text-green-200 transition-colors">{t('nav.dashboard')}</Link>
                  <Link to="/profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-all border border-white/20">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow">{user.name?.[0]?.toUpperCase()}</span>
                    {user.name?.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">{t('nav.login')}</Link>
                  <Link to="/register" className="btn-premium text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">{t('nav.registerFree')}</Link>
                </>
              )}
            </div>
            <button onClick={() => setMenuOpen(p => !p)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden mt-2 glass-card rounded-2xl px-5 py-4 space-y-3 shadow-2xl">
              {navLinks.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-white/80 hover:text-green-300 py-1 transition-colors">{label}</a>)}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-green-300">{t('nav.dashboard')}</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-white/80">{t('nav.profile')}</Link>
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-sm font-medium text-red-400 text-left">{t('nav.logout')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-white/80">{t('nav.login')}</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-green-300">{t('nav.registerFree')}</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-screen bg-farmland flex items-center overflow-hidden">
        <Blob className="w-[600px] h-[600px] -top-40 -right-40 bg-green-500/20 blur-[120px]" />
        <Blob className="w-[400px] h-[400px] bottom-0 -left-20 bg-emerald-400/15 blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/80 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center w-full">
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow">{t('poweredByAI')}</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 drop-shadow-2xl">
            {t('landing.heroTitle')}<br />
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent animate-gradient">{t('landing.heroTitleHighlight')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/75 text-lg leading-relaxed mb-3">{t('landing.heroSubtitle')}</p>
          <p className="max-w-xl mx-auto text-white/55 text-base mb-10">{t('landing.heroDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGetStarted} className="btn-premium text-white text-lg font-bold px-8 py-4 rounded-full shadow-2xl">{t('landing.getStartedFree')}</button>
            <Link to="/login" className="btn-outline-premium text-lg font-bold px-8 py-4 rounded-full">{t('landing.loginArrow')}</Link>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ val, label }) => (
              <div key={label} className="glass-card rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">{val}</p>
                <p className="text-xs text-white/60 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 bg-gray-950 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-400 font-bold uppercase tracking-widest text-xs">{t('landing.whatWeOffer')}</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">{t('landing.featuresTitle')}</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">{t('landing.featuresDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc, color }) => (
              <div key={title} className="group glass-card-dark rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 overflow-hidden relative cursor-default">
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-15 pointer-events-none blur-xl" style={{ backgroundColor: color }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[36px] mb-4 group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: `${color}22` }}>{icon}</div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #030f06, #051a0a, #030f06)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-400 font-bold uppercase tracking-widest text-xs">{t('landing.theProcess')}</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">{t('landing.stepsTitle')}</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">{t('landing.stepsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative glass-card rounded-2xl p-6 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 text-center">
                <span className="text-xs font-bold text-green-400 tracking-widest">{num}</span>
                <h3 className="text-sm font-bold text-white mt-1 mb-2">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative py-24 bg-gray-950 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-400 font-bold uppercase tracking-widest text-xs">{t('landing.farmerStories')}</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">{t('landing.testimonialsTitle')}</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">{t('landing.testimonialsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map(({ name, state, crop, text, avatar }) => (
              <div key={name} className="glass-card-dark rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-lg">{avatar}</div>
                  <div><p className="text-sm font-bold text-white">{name}</p><p className="text-xs text-white/50">{crop} - {state}</p></div>
                </div>
                <p className="text-white/60 text-xs leading-relaxed italic">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #030f06, #051a0a)' }}>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><span className="text-green-400 font-bold uppercase tracking-widest text-xs">{t('nav.faq')}</span></div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={q} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/10 transition-colors">
                  <span className="text-sm font-semibold text-white pr-4">{q}</span>
                  <span className={`text-green-400 text-lg font-bold flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4"><p className="text-sm text-white/60 leading-relaxed">{a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/80 via-emerald-700/80 to-green-800/80 animate-gradient" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-xl">{t('landing.ctaTitle')}</h2>
          <p className="text-white/80 text-lg mb-8">{t('landing.ctaDesc')}</p>
          <button onClick={handleGetStarted} className="bg-white text-green-800 font-extrabold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-200">{t('landing.startForFree')}</button>
        </div>
      </section>

      <footer className="bg-black/80 backdrop-blur border-t border-white/10 text-white/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2"><div className="text-lg font-extrabold text-white mb-3">{t('appName')}</div><p className="text-sm leading-relaxed max-w-xs">{t('landing.footer.platformDesc')}</p></div>
            <div><p className="text-xs font-bold text-white uppercase tracking-widest mb-3">{t('landing.footer.platform')}</p>{navLinks.map(([href, label]) => <a key={href} href={href} className="block hover:text-green-400 transition-colors text-sm mb-2">{label}</a>)}</div>
            <div><p className="text-xs font-bold text-white uppercase tracking-widest mb-3">{t('landing.footer.account')}</p><Link to="/register" className="block hover:text-green-400 transition-colors text-sm mb-2">{t('landing.footer.registerFree')}</Link><Link to="/login" className="block hover:text-green-400 transition-colors text-sm mb-2">{t('nav.login')}</Link>{user && <Link to="/profile" className="block hover:text-green-400 transition-colors text-sm mb-2">{t('landing.footer.myProfile')}</Link>}</div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"><p>(c) {new Date().getFullYear()} AgroPulse AI. {t('landing.footer.rights')}</p><p>{t('tagline')}</p></div>
        </div>
      </footer>
    </div>
  )
}

