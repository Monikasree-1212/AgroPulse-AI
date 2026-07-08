import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4']

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-bold" style={{ color: payload[0].payload.fill ?? '#16a34a' }}>
        {payload[0].name}: {payload[0].value} searches
      </p>
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className="font-bold text-green-600">Avg: Rs.{payload[0]?.value}/kg</p>
    </div>
  )
}

export default function CommodityInsightsChart({ usageData, avgPrices }) {
  const hasPie = usageData?.length > 0
  const hasBar = avgPrices?.length > 0

  if (!hasPie && !hasBar) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Commodity Usage Pie */}
      {hasPie && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Commodity Usage</h3>
            <p className="text-xs text-gray-400 mt-0.5">Search frequency by commodity</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={usageData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                animationDuration={700}
              >
                {usageData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Average Market Prices Bar */}
      {hasBar && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Average Market Prices</h3>
            <p className="text-xs text-gray-400 mt-0.5">7-day average price per commodity</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avgPrices} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="commodity" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="avgPrice" name="Avg Price" fill="#16a34a" radius={[5, 5, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
