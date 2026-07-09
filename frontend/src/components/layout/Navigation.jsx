import { useNavigate } from 'react-router-dom'
import { useGuest } from '../auth/GuestMode'
import useTranslation from '../../hooks/useTranslation'

export default function Navigation() {
  const navigate = useNavigate()
  const { logout } = useGuest()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-lg font-extrabold text-white flex items-center gap-2">
          Farming <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">AgroPulse AI</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-white/70 hover:text-green-300 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
