const CROP_EMOJI = { Onion: '', Potato: '', Pulses: 'Farming', Maize: '', Wheat: 'Farming', Rice: '', Tomato: '', Cotton: '', Sugarcane: '', Soybean: '', Groundnut: '', Mustard: '', Turmeric: 'Medium', Chilli: '', Garlic: '' }

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function FarmInformationCard({ user }) {
  const cropEmoji = CROP_EMOJI[user?.primaryCrop] || 'Crop'
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <span className="text-xl"></span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Farm Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">Your agricultural profile</p>
        </div>
      </div>
      <div className="px-6 py-2">
        <InfoRow icon={cropEmoji}  label="Primary Crop"  value={user?.primaryCrop} />
        <InfoRow icon=""         label="Farm Size"     value={user?.farmSize > 0 ? `${user.farmSize} acres` : null} />
        <InfoRow icon=""         label="State"         value={user?.state} />
        <InfoRow icon=""         label="District"      value={user?.district} />
        <InfoRow icon=""         label="Village"       value={user?.village} />
      </div>
    </div>
  )
}
