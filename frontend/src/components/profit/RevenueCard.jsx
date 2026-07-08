export default function RevenueCard({ icon, label, value, sub, gradient, border, accent, badge }) {
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
          {badge && (
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {badge}
            </span>
          )}
        </div>
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      <p className={`text-2xl font-extrabold ${accent} mb-1`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  )
}
