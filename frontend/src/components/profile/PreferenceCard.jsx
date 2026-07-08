export default function PreferenceCard({ user, onEdit }) {
  const prefs = [
    { icon: '🗣️', label: 'Preferred Language', value: user?.preferredLanguage },
    { icon: '🧅', label: 'Primary Crop',        value: user?.primaryCrop },
    { icon: '📍', label: 'Location',            value: [user?.district, user?.state].filter(Boolean).join(', ') || null },
    { icon: '📐', label: 'Farm Size',           value: user?.farmSize > 0 ? `${user.farmSize} acres` : null },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Preferences</h3>
            <p className="text-xs text-gray-400 mt-0.5">Personalisation settings</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline"
        >
          Edit →
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prefs.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5">{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
