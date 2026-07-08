import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className="font-bold" style={{ color: payload[0]?.payload?.color ?? '#16a34a' }}>
        {payload[0]?.value} uses
      </p>
    </div>
  )
}

export default function UsageChart({ data }) {
  if (!data?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Feature Usage</h3>
        <p className="text-xs text-gray-400 mt-0.5">Total uses per module</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="Uses" radius={[5, 5, 0, 0]} animationDuration={800}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? '#16a34a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
