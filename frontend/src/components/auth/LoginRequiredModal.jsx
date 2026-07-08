import { useNavigate } from 'react-router-dom'
import { useGuest } from './GuestMode'

export default function LoginRequiredModal({ feature, onClose, redirectTo }) {
  const navigate = useNavigate()
  const { continueAsGuest } = useGuest()

  const goLogin = () => {
    if (redirectTo) sessionStorage.setItem('agropulse_redirect', redirectTo)
    navigate('/login')
    onClose()
  }

  const goRegister = () => {
    if (redirectTo) sessionStorage.setItem('agropulse_redirect', redirectTo)
    navigate('/register')
    onClose()
  }

  const handleGuest = () => {
    continueAsGuest()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slideUp">

        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 flex items-center justify-center text-3xl mb-4 shadow-sm">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Unlock Personalised Features
            </h2>
            {feature && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="font-semibold text-green-600 dark:text-green-400">{feature}</span> requires a free account
              </p>
            )}
          </div>

          {/* Benefits list */}
          <ul className="space-y-2 mb-6">
            {[
              'AI Price Predictions & Forecasts',
              'Profit Simulator & Reports',
              'Voice Assistant',
              'Notification Center',
              'Analytics Dashboard',
              'Farmer Activity History',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={goLogin}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Login →
            </button>
            <button
              onClick={goRegister}
              className="w-full py-3 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 font-bold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            >
              Register Free
            </button>
            <button
              onClick={handleGuest}
              className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-bold transition-colors"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn  { animation: fadeIn  0.2s ease forwards }
        .animate-slideUp { animation: slideUp 0.25s ease forwards }
      `}</style>
    </div>
  )
}
