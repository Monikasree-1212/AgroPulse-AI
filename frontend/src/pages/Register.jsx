import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useGuest } from '../components/auth/GuestMode'
import useTranslation from '../hooks/useTranslation'
import { stateDistricts, STATES } from '../data/stateDistricts'
const CROPS = ['Onion', 'Potato', 'Pulses', 'Maize', 'Wheat', 'Rice', 'Tomato', 'Cotton', 'Sugarcane', 'Soybean', 'Groundnut', 'Mustard', 'Turmeric', 'Chilli', 'Garlic', 'Coconut']
const LANGS = ['English', 'Hindi', 'Marathi', 'Telugu', 'Tamil', 'Kannada', 'Gujarati', 'Bengali', 'Punjabi', 'Odia']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useGuest()
  const { t, languageName, setLanguage } = useTranslation()

  const [form, setForm] = useState({
    name: '', phone: '', password: '', confirmPassword: '',
    state: '', district: '', primaryCrop: 'Onion', preferredLanguage: languageName,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [step, setStep] = useState(1)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (k === 'preferredLanguage') setLanguage(v, { sync: false })
    setError('')
  }

  const validateStep1 = () => {
    if (!form.name.trim()) return t('register.errorName')
    if (!/^\d{10}$/.test(form.phone)) return t('register.errorPhone')
    if (form.password.length < 6) return t('register.errorPassword')
    if (form.password !== form.confirmPassword) return t('register.errorPasswordMatch')
    return ''
  }

  const validateStep2 = () => {
    if (!form.state) return t('register.errorState') || 'Please select a state'
    if (!form.district) return t('register.errorDistrict') || 'Please select a district'
    return ''
  }

  const handleNext = (e) => {
    e.preventDefault()
    const err = validateStep1()
    if (err) { setError(err); return }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const step2Err = validateStep2()
    if (step2Err) { setError(step2Err); return }

    setLoading(true)
    setError('')
    try {
      const { confirmPassword: _, ...payload } = form
      const res = await api.post('/api/auth/register', payload)
      login(res.data.token, res.data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('register.errorFailed'))
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const districts = form.state ? (stateDistricts[form.state] || []) : [];

  return (
    <div className="min-h-screen bg-farmland flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-500/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none animate-float-slow" />

      <div className="relative w-full max-w-md animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-white drop-shadow-xl">
            Farming <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
          </Link>
          <p className="text-white/60 text-sm mt-1">{t('register.subtitle')}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 px-1">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-900/50'
                  : 'bg-white/10 text-white/40 border border-white/20'
                }`}>
                {step > s ? 'Yes' : s}
              </div>
              <span className={`text-xs font-medium transition-colors ${step >= s ? 'text-green-300' : 'text-white/40'}`}>
                {s === 1 ? t('register.step1Label') : t('register.step2Label')}
              </span>
              {s < 2 && <div className={`flex-1 h-px rounded transition-all duration-300 ${step > s ? 'bg-green-500' : 'bg-white/15'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white">
              {step === 1 ? t('register.createAccount') : t('register.farmProfile')}
            </h1>
            <p className="text-sm text-white/60 mt-1">
              {step === 1 ? t('register.step1Desc') : t('register.step2Desc')}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-sm rounded-xl px-4 py-3">
              <span>Warning</span> {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5" noValidate>
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.fullName')}</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder={t('register.fullNamePlaceholder')}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm transition-all" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.phoneNumber')}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold">+91</span>
                  <input type="tel" inputMode="numeric" maxLength={10} value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder={t('register.phonePlaceholder')}
                    className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm transition-all" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.password')}</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)} placeholder={t('register.passwordPlaceholder')}
                    className="glass-input w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all" required />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 text-sm transition-colors">
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.confirmPassword')}</label>
                <input type={showPwd ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)} placeholder={t('register.confirmPasswordPlaceholder')}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm transition-all" required />
              </div>

              <button type="submit" className="btn-premium w-full py-3.5 text-white font-bold rounded-xl">
                {t('register.continueBtn')}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.state')}</label>
                  <select
                    value={form.state}
                    onChange={e => {
                      set('state', e.target.value)
                      set('district', '') // Reset district on state change
                    }}
                    className="glass-input w-full px-3 py-3 rounded-xl text-sm transition-all text-white bg-transparent outline-none">
                    <option value="" className="bg-gray-900">{t('register.selectState')}</option>
                    {STATES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.district')}</label>
                  <select
                    value={form.district}
                    onChange={e => set('district', e.target.value)}
                    disabled={!form.state}
                    className="glass-input w-full px-3 py-3 rounded-xl text-sm transition-all text-white bg-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                    {/* Placeholder shown only when no state is selected or no district selected */}
                    {!form.state ? (
                      <option value="" className="bg-gray-900">Select a state first</option>
                    ) : (
                      <option value="" className="bg-gray-900">Select District</option>)}
                    {districts.map((district) => (
                      <option key={district} value={district} className="bg-gray-900">
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.primaryCrop')}</label>
                <select value={form.primaryCrop} onChange={e => set('primaryCrop', e.target.value)}
                  className="glass-input w-full px-3 py-3 rounded-xl text-sm transition-all">
                  {CROPS.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{t('register.preferredLanguage')}</label>
                <select value={form.preferredLanguage} onChange={e => set('preferredLanguage', e.target.value)}
                  className="glass-input w-full px-3 py-3 rounded-xl text-sm transition-all">
                  {LANGS.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                </select>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3.5 btn-outline-premium font-bold rounded-xl">
                  {t('register.backBtn')}
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 btn-premium text-white font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t('register.creating')}</>
                    : t('register.createAccountBtn')}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-white/50 mt-6">
            {t('register.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-green-400 font-semibold hover:text-green-300 transition-colors">{t('register.loginHere')}</Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          <Link to="/" className="hover:text-green-400 transition-colors">{t('register.backToHome')}</Link>
        </p>
      </div>
    </div>
  )
}
