export default function LocationCard({ mandi, isBest, rank }) {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden
      ${isBest
        ? 'border-2 border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900/50'
        : 'border border-gray-100 dark:border-gray-700'}`}
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full
          ${rank === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
          #{rank}
        </span>
      </div>

      {isBest && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span className="bg-emerald-400 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
            Location Nearest
          </span>
          <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
            Best Choice
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mt-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0
          ${isBest ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                   : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'}`}>
          {mandi.name[0]}
        </div>
        <div className="min-w-0 pr-2">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight truncate">{mandi.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{mandi.city}, {mandi.state}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Distance',        value: `${mandi.distance} km`,                  color: 'text-blue-600 dark:text-blue-400'    },
          { label: 'Travel Time',     value: mandi.travelTime,                         color: 'text-cyan-600 dark:text-cyan-400'    },
          { label: 'Market Price',    value: `Rs.${mandi.marketPrice}/kg`,               color: 'text-green-600 dark:text-green-400'  },
          { label: 'Transport Cost',  value: `Rs.${mandi.transportCost.toLocaleString()}`,color: 'text-orange-500 dark:text-orange-400'},
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Expected profit - full width */}
      <div className={`mt-2 rounded-xl px-3 py-2.5 flex items-center justify-between
        ${mandi.expectedProfit >= 0
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'}`}>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Expected Profit</p>
        <p className={`text-sm font-extrabold ${mandi.expectedProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {mandi.expectedProfit >= 0 ? '+' : ''}Rs.{mandi.expectedProfit.toLocaleString()}
        </p>
      </div>
    </div>
  )
}
