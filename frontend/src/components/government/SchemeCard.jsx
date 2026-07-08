const CATEGORY_COLORS = {
  "Income Support":   "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  "Crop Insurance":   "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Credit & Finance": "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  "Soil & Fertilizer":"bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Market Access":    "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  "Horticulture":     "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  "Organic Farming":  "bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800",
  "Infrastructure":   "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "Irrigation":       "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  "Food Security":    "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
}

const DEFAULT_COLOR = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"

export default function SchemeCard({ scheme }) {
  const badgeColor = CATEGORY_COLORS[scheme.category] ?? DEFAULT_COLOR

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Header strip */}
      <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400" />

      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Title + badges */}
        <div className="flex flex-wrap items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm leading-snug">{scheme.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {scheme.category}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
            📍 {scheme.state}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
          {scheme.description}
        </p>

        {/* Eligibility */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-0.5">Eligibility</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{scheme.eligibility}</p>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide mb-0.5">Benefits</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{scheme.benefits}</p>
        </div>

        {/* Official link */}
        <a
          href={scheme.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          🌐 Official Website
        </a>
      </div>
    </div>
  )
}
