const CATEGORIES = [
  "All Categories", "Income Support", "Crop Insurance", "Credit & Finance",
  "Soil & Fertilizer", "Market Access", "Horticulture", "Organic Farming",
  "Infrastructure", "Irrigation", "Food Security",
]

const STATES = [
  "All States", "All India", "Maharashtra", "Uttar Pradesh", "Punjab",
  "Haryana", "Madhya Pradesh", "Rajasthan", "Karnataka", "Tamil Nadu",
  "Andhra Pradesh", "Telangana", "Gujarat", "Bihar", "West Bengal",
]

export default function SearchBar({ query, state, category, onQuery, onState, onCategory }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search schemes by title, category..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={state}
          onChange={(e) => onState(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
