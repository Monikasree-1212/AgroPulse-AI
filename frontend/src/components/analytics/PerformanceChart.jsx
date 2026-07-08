import {
  ResponsiveContainer, AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'

function AreaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className="font-bold text-blue-600">{payload[0]?.value} activities</p>
    </div>
  )
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const roi = payload[0]?.value
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Simulation #{label}</p>
      <p className={`font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        ROI: {roi >= 0 ? '+' : ''}{roi}%
      </p>
    </div>
  )
}

export default function PerformanceChart({ dailyActivity, profitTrend }) {
  const hasDaily  = dailyActivity?.some(d => d.count > 0)
  const hasProfit = profitTrend?.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Activity Area Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Daily Activity Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Platform usage over the last 7 days</p>
        </div>
        {hasDaily ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyActivity} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<AreaTooltip />} />
              <Area
                type="monotone" dataKey="count" name="Activities"
                stroke="#3b82f6" strokeWidth={2.5}
                fill="url(#actGrad)"
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
            No activity data yet
          </div>
        )}
      </div>

      {/* Profit ROI Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profit Simulation Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">ROI % across recent simulations</p>
        </div>
        {hasProfit ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={profitTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="index" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} label={{ value: 'Simulation #', position: 'insideBottom', offset: -2, fontSize: 9, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<LineTooltip />} />
              <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="4 4" />
              <Line
                type="monotone" dataKey="roi" name="ROI"
                stroke="#16a34a" strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return <circle key={cx} cx={cx} cy={cy} r={4} fill={payload.roi >= 0 ? '#16a34a' : '#ef4444'} strokeWidth={0} />
                }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
            Run Profit Simulator to see trends
          </div>
        )}
      </div>
    </div>
  )
}
