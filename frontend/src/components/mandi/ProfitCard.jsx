import {
  ResponsiveContainer, BarChart, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, Bar,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: Rs.{p.value}/kg
        </p>
      ))}
    </div>
  )
}

export default function ProfitCard({ mandis }) {
  const chartData = mandis.map((m) => ({
    name:          m.name.split(' ')[0],
    'Market Price':    m.price,
    'Transport Cost':  m.transportCost,
    'Expected Profit': m.profit,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profit Comparison Chart</h2>
          <p className="text-sm text-gray-400 mt-0.5">Market Price  -  Transport Cost  -  Expected Profit</p>
        </div>
        <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800">
          Top 5 Mandis
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          <Bar dataKey="Market Price"    fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Transport Cost"  fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expected Profit" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
