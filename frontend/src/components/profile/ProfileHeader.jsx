import { useNavigate } from 'react-router-dom'

const CROP_EMOJI = { Onion: '', Potato: '', Pulses: 'Farming', Maize: '', Wheat: 'Farming', Rice: '', Tomato: '', Cotton: '', Sugarcane: '', Soybean: '', Groundnut: '', Mustard: '', Turmeric: 'Medium', Chilli: '', Garlic: '' }

export default function ProfileHeader({ user, onEdit }) {
  const navigate = useNavigate()
  const initial  = user?.name?.[0]?.toUpperCase() || '?'
  const joined   = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'
  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'First session'

  return (
    <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl overflow-hidden shadow-xl">
      {/* decorative circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl font-extrabold text-white shadow-lg">
                {initial}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
              <span className="text-[10px]">Yes</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">{user?.name}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white capitalize">{user?.role || 'farmer'}</span>
            </div>
            <p className="text-white/80 text-sm mb-3">+91 {user?.phone}</p>
            <div className="flex flex-wrap gap-3">
              {user?.primaryCrop && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
                  {CROP_EMOJI[user.primaryCrop] || 'Crop'} {user.primaryCrop}
                </span>
              )}
              {(user?.state || user?.district) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
                  Location {[user.district, user.state].filter(Boolean).join(', ')}
                </span>
              )}
              {user?.preferredLanguage && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
                   {user.preferredLanguage}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white text-green-700 text-sm font-extrabold rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Edit Edit Profile
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-all duration-200"
            >
              {'<-'} Dashboard
            </button>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap gap-4 sm:gap-8">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Member Since</p>
            <p className="text-white font-bold text-sm mt-0.5">{joined}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Last Login</p>
            <p className="text-white font-bold text-sm mt-0.5">{lastLogin}</p>
          </div>
          {user?.farmSize > 0 && (
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Farm Size</p>
              <p className="text-white font-bold text-sm mt-0.5">{user.farmSize} acres</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
