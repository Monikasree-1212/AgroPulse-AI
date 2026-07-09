const formatTimeAgo = (date) => {
  if (!date) return 'Updated just now';
  const ts = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now - ts) / 60000);
  
  if (diffInMinutes < 1) return 'Updated just now';
  if (diffInMinutes < 60) return `Updated ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const isToday = now.toDateString() === ts.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === ts.toDateString();
  
  const timeStr = ts.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(ts);
};

export default function MandiCard({ mandi, isBest }) {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden
      ${isBest
        ? 'border-2 border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-200 dark:ring-yellow-900/50'
        : 'border border-gray-100 dark:border-gray-700'}`}
    >
      {isBest && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
            ⭐ Best Choice
          </span>
          <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
            🏆 Highest Profit
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0
          ${isBest ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'}`}>
          {mandi.marketName[0]}
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight truncate">{mandi.marketName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{mandi.district}, {mandi.state}</p>
          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
            {mandi.commodity}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Market Price',    value: `₹${mandi.marketPrice}/kg`,          color: 'text-green-600 dark:text-green-400' },
          { label: 'Distance',        value: `${mandi.distance} km`,         color: 'text-blue-600 dark:text-blue-400'  },
          { label: 'Transport Cost',  value: `₹${mandi.transportCost}/kg`,   color: 'text-orange-500 dark:text-orange-400' },
          { label: 'Expected Profit', value: `₹${mandi.expectedProfit}/kg`,          color: isBest ? 'text-yellow-600 dark:text-yellow-400 font-extrabold' : 'text-violet-600 dark:text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-semibold">{formatTimeAgo(mandi.lastUpdated)}</span>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">AgroPulse AI Engine</span>
      </div>
    </div>
  )
}
