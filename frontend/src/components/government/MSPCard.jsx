const COMMODITY_ICONS = {
  Wheat: 'Farming', Paddy: 'Farming', Cotton: '', Maize: '',
  Soybean: '', Groundnut: '', Sunflower: '', Mustard: '',
  'Tur (Arhar)': '', Moong: '', Urad: '', 'Gram (Chana)': '',
  Jowar: 'Farming', Bajra: 'Farming', Ragi: 'Farming', Onion: '',
  Potato: '', Tomato: '',
}

export default function MSPCard({ commodity, msp }) {
  const icon = COMMODITY_ICONS[commodity] ?? 'Crop'
  const isMarketDriven = typeof msp === 'string'

  return (
    <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20 pointer-events-none" />
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-tight">{commodity}</p>
      </div>
      <p className={`text-xl font-extrabold mb-1 ${isMarketDriven ? 'text-blue-600 dark:text-blue-400' : 'text-green-700 dark:text-green-400'}`}>
        {isMarketDriven ? msp : `Rs.${msp}`}
      </p>
      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isMarketDriven ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'}`}>
        {isMarketDriven ? 'Market Price' : 'MSP / Quintal'}
      </span>
    </div>
  )
}
