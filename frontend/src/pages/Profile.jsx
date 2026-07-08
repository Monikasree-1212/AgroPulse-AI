import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useGuest } from '../components/auth/GuestMode'
import ProfileHeader      from '../components/profile/ProfileHeader'
import PersonalInfoCard   from '../components/profile/PersonalInfoCard'
import FarmInformationCard from '../components/profile/FarmInformationCard'
import PreferenceCard     from '../components/profile/PreferenceCard'
import ProfileStats       from '../components/profile/ProfileStats'
import useTranslation     from '../hooks/useTranslation'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']
const CROPS  = ['Onion','Potato','Pulses','Maize','Wheat','Rice','Tomato','Cotton','Sugarcane','Soybean','Groundnut','Mustard','Turmeric','Chilli','Garlic','Coconut']
const LANGS  = ['English','Hindi','Marathi','Telugu','Tamil','Kannada','Gujarati','Bengali','Punjabi','Odia']

function InputField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-3 rounded-xl glass-input text-sm transition-all"
const selectCls = "w-full px-4 py-3 rounded-xl glass-input text-sm transition-all [&>option]:bg-gray-900 [&>option]:text-white"

export default function Profile() {
  const navigate = useNavigate()
  const { user: ctxUser, updateUser, logout } = useGuest()
  const { t, setLanguage } = useTranslation()

  const [profile,  setProfile]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [form,     setForm]     = useState({})

  const token = localStorage.getItem('agropulse_token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setProfile(r.data); setForm(r.data) })
      .catch(() => { logout(); navigate('/login') })
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (k === 'preferredLanguage') setLanguage(v)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await axios.put('/api/profile', {
        name:              form.name,
        state:             form.state,
        district:          form.district,
        village:           form.village,
        primaryCrop:       form.primaryCrop,
        farmSize:          form.farmSize,
        preferredLanguage: form.preferredLanguage,
        profileImage:      form.profileImage,
      }, { headers: { Authorization: `Bearer ${token}` } })

      const updated = { ...res.data, stats: profile?.stats }
      setProfile(updated)
      setForm(updated)
      updateUser(res.data)
      setEditing(false)
      setSuccess(t('profile.successUpdate'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || t('profile.errorUpdate'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-farmland flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-farmland transition-colors duration-300">
      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-lg font-extrabold text-white flex items-center gap-2">
            ðŸŒ¾ <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors"
            >{t('profile.backDashboard')}</button>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >{t('profile.logout')}</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Page label */}
        <div>
          <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">{t('profile.account')}</p>
          <h1 className="text-3xl font-extrabold text-white">
            {t('profile.myProfile')} <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">{t('profile.myProfileHighlight')}</span>
          </h1>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 text-sm rounded-xl px-4 py-3 animate-fadeIn">
            âœ… {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-sm rounded-xl px-4 py-3">
            âš ï¸ {error}
          </div>
        )}

        {/* Profile Header */}
        <ProfileHeader user={profile} onEdit={() => setEditing(true)} />

        {/* Stats */}
        <ProfileStats stats={profile?.stats} />

        {/* Info grid */}
        {!editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <PersonalInfoCard    user={profile} />
            <FarmInformationCard user={profile} />
          </div>
        )}

        {/* Preferences */}
        {!editing && (
          <PreferenceCard user={profile} onEdit={() => setEditing(true)} />
        )}

        {/* Edit Form */}
        {editing && (
          <form
            onSubmit={handleSave}
            className="glass-card rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <span className="text-xl">âœï¸</span>
              <h3 className="text-sm font-bold text-white">{t('profile.editProfile')}</h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Personal */}
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{t('profile.personal')}</p>
              <InputField label={t('profile.fullName')}>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={e => set('name', e.target.value)}
                  className={inputCls}
                  placeholder={t('profile.fullNamePlaceholder')}
                />
              </InputField>

              <InputField label={t('profile.profileImageUrl')}>
                <input
                  type="url"
                  value={form.profileImage || ''}
                  onChange={e => set('profileImage', e.target.value)}
                  className={inputCls}
                  placeholder={t('profile.profileImagePlaceholder')}
                />
              </InputField>

              {/* Farm */}
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest pt-2">{t('profile.farmDetails')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={t('profile.primaryCrop')}>
                  <select value={form.primaryCrop || 'Onion'} onChange={e => set('primaryCrop', e.target.value)} className={selectCls}>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </InputField>
                <InputField label={t('profile.farmSize')}>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.farmSize || ''}
                    onChange={e => set('farmSize', e.target.value)}
                    className={inputCls}
                    placeholder={t('profile.farmSizePlaceholder')}
                  />
                </InputField>
              </div>

              {/* Location */}
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest pt-2">{t('profile.location')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={t('profile.state')}>
                  <select value={form.state || ''} onChange={e => set('state', e.target.value)} className={selectCls}>
                    <option value="">{t('profile.selectState')}</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputField>
                <InputField label={t('profile.district')}>
                  <input
                    type="text"
                    value={form.district || ''}
                    onChange={e => set('district', e.target.value)}
                    className={inputCls}
                    placeholder={t('profile.districtPlaceholder')}
                  />
                </InputField>
              </div>
              <InputField label={t('profile.village')}>
                <input
                  type="text"
                  value={form.village || ''}
                  onChange={e => set('village', e.target.value)}
                  className={inputCls}
                  placeholder={t('profile.villagePlaceholder')}
                />
              </InputField>

              {/* Preferences */}
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest pt-2">{t('profile.preferences')}</p>
              <InputField label={t('profile.preferredLanguage')}>
                <select value={form.preferredLanguage || 'English'} onChange={e => set('preferredLanguage', e.target.value)} className={selectCls}>
                  {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputField>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm(profile); setError('') }}
                  className="flex-1 py-3 btn-outline-premium font-bold rounded-xl"
                >{t('profile.cancel')}</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 btn-premium text-white font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t('profile.saving')}</>
                    : t('profile.saveChanges')}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Quick Actions */}
        {!editing && (
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <span className="text-xl">âš¡</span>
              <h3 className="text-sm font-bold text-white">{t('profile.quickActions')}</h3>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: 'âœï¸', label: t('profile.actions.editProfile'),   action: () => setEditing(true) },
                { icon: 'ðŸŒ¾', label: t('profile.actions.changeCrop'),    action: () => navigate('/commodity') },
                { icon: 'ðŸ“Š', label: t('profile.actions.viewDashboard'), action: () => navigate('/dashboard') },
                { icon: 'ðŸšª', label: t('profile.actions.logout'),         action: handleLogout, danger: true },
              ].map(({ icon, label, action, danger }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    danger
                      ? 'border-red-400/30 hover:bg-red-500/20 text-red-300'
                      : 'border-white/15 hover:bg-white/15 hover:border-green-400/30 text-white/80'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-bold text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="glass-card rounded-2xl shadow-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-3">{t('profile.session')}</h3>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-bold rounded-xl border border-red-400/30 transition-all duration-200"
          >
            {t('profile.logoutBtn')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards }
      `}</style>
    </div>
  )
}






