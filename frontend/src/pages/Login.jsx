import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { useGuest } from '../components/auth/GuestMode'
import useTranslation from '../hooks/useTranslation'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useGuest()
  const { t } = useTranslation()
  const from      = sessionStorage.getItem('agropulse_redirect')
    || location.state?.from?.pathname
    || '/dashboard'

  const [form,    setForm]    = useState({ phone: '', password: '', remember: false })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  const validate = () => {
    if (!/^\d{10}$/.test(form.phone))  return t('login.errorPhone')
    if (form.password.length < 6)      return t('login.errorPassword')
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/login', { phone: form.phone, password: form.password })
      login(res.data.token, res.data.user)
      sessionStorage.removeItem('agropulse_redirect')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('login.errorFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-farmland flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-500/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none animate-float-slow" />

      <div className="relative w-full max-w-md animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-white drop-shadow-xl">
            ðŸŒ¾ <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
          </Link>
          <p className="text-white/60 text-sm mt-1">{t('tagline')}</p>
        </div>

        <div className="glass-card rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white">{t('login.welcomeBack')}</h1>
            <p className="text-sm text-white/60 mt-1">{t('login.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-sm rounded-xl px-4 py-3 backdrop-blur-sm">
              <span>âš ï¸</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder={t('login.phonePlaceholder')}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="glass-input w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 text-sm transition-colors"
                >
                  {showPwd ? 'ðŸ™ˆ' : 'ðŸ‘ï¸'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => set('remember', e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500"
              />
              <span className="text-sm text-white/60">{t('login.rememberMe')}</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3.5 text-white font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t('login.loggingIn')}</>
              ) : t('login.loginBtn')}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-6">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          <Link to="/" className="hover:text-green-400 transition-colors">{t('login.backToHome')}</Link>
        </p>
      </div>
    </div>
  )
}



