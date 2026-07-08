import { useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer, BarChart, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, Bar, ReferenceLine,
} from 'recharts'
import RevenueCard from './RevenueCard'
import RecommendationCard from './RecommendationCard'

const COMMODITIES = ['Onion', 'Potato', 'Pulses', 'Maize', 'Coconut']

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
}

function Field({ label, name, value, onChange, type = 'number', isSelect }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          {COMMODITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min="0"
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        />
      )}
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

const DEFAULT_FORM = {
  commodity: 'Onion',
  quantity: 1000,
  currentPrice: 28,
  predictedPrice: 34,
  storageCost: 2,
  transportCost: 1,
  daysToHold: 7,
}

export default function ProfitSimulator() {
  const [form,    setForm]    = useState(DEFAULT_FORM)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === 'commodity' ? value : Number(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/profit/simulate', form)
      setResult(data)
      // Auto-create notification for HOLD/SELL recommendation
      try {
        await axios.post('/api/notifications', {
          title: data.recommendation === 'HOLD'
            ? `Hold ${form.commodity} for Higher Profit 💰`
            : `Sell ${form.commodity} Today 📦`,
          message: data.recommendation === 'HOLD'
            ? `Profit Simulator recommends HOLD. Expected gain: ₹${data.profitDifference.toLocaleString()} (ROI: +${data.roi}%) after ${form.daysToHold} days.`
            : `Profit Simulator recommends SELL TODAY. Holding may result in ₹${Math.abs(data.profitDifference).toLocaleString()} loss (ROI: ${data.roi}%).`,
          type: 'profit',
          commodity: form.commodity,
          priority: Math.abs(data.roi) > 10 ? 'high' : 'medium',
        })
      } catch (_) {}
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to calculate profit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const chartData = result ? [
    { name: 'Current Revenue',   value: result.currentRevenue   },
    { name: 'Future Revenue',    value: result.futureRevenue    },
    { name: 'Storage Expense',   value: result.storageExpense   },
    { name: 'Transport Expense', value: result.transportExpense },
    { name: 'Net Future Profit', value: result.netFutureProfit  },
  ] : []

  const kpis = result ? [
    {
      icon: '💰', label: 'Current Revenue',   value: `₹${result.currentRevenue.toLocaleString()}`,
      sub: `${result.quantity} kg × ₹${form.currentPrice}`,
      gradient: 'from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30',
      border: 'border-green-200 dark:border-green-800', accent: 'text-green-700 dark:text-green-400', badge: 'Today',
    },
    {
      icon: '📈', label: 'Future Revenue',    value: `₹${result.futureRevenue.toLocaleString()}`,
      sub: `${result.quantity} kg × ₹${form.predictedPrice}`,
      gradient: 'from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/30',
      border: 'border-blue-200 dark:border-blue-800', accent: 'text-blue-700 dark:text-blue-400', badge: 'Projected',
    },
    {
      icon: '🏭', label: 'Storage Expense',   value: `₹${result.storageExpense.toLocaleString()}`,
      sub: `${result.quantity} kg × ₹${form.storageCost}`,
      gradient: 'from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/30',
      border: 'border-orange-200 dark:border-orange-800', accent: 'text-orange-600 dark:text-orange-400', badge: 'Cost',
    },
    {
      icon: '🚛', label: 'Transport Expense', value: `₹${result.transportExpense.toLocaleString()}`,
      sub: `${result.quantity} kg × ₹${form.transportCost}`,
      gradient: 'from-rose-50 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/30',
      border: 'border-rose-200 dark:border-rose-800', accent: 'text-rose-600 dark:text-rose-400', badge: 'Cost',
    },
    {
      icon: '🎯', label: 'Net Future Profit', value: `₹${result.netFutureProfit.toLocaleString()}`,
      sub: 'After all deductions',
      gradient: 'from-violet-50 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30',
      border: 'border-violet-200 dark:border-violet-800', accent: 'text-violet-700 dark:text-violet-400', badge: 'Net',
    },
    {
      icon: result.profitDifference >= 0 ? '🚀' : '📉',
      label: 'Profit Difference',
      value: `${result.profitDifference >= 0 ? '+' : ''}₹${result.profitDifference.toLocaleString()}`,
      sub: 'vs selling today',
      gradient: result.profitDifference >= 0
        ? 'from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/30'
        : 'from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/30',
      border: result.profitDifference >= 0 ? 'border-amber-200 dark:border-amber-800' : 'border-red-200 dark:border-red-800',
      accent: result.profitDifference >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400',
      badge: result.profitDifference >= 0 ? 'Gain' : 'Loss',
    },
  ] : []

  return (
    <div className="space-y-6">

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Simulation Parameters</h3>
            <p className="text-xs text-gray-400 mt-0.5">Enter your crop details to calculate profit</p>
          </div>
          <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
            AI Powered
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Commodity"       name="commodity"      value={form.commodity}      onChange={handleChange} isSelect />
            <Field label="Quantity (kg)"   name="quantity"       value={form.quantity}       onChange={handleChange} />
            <Field label="Current Price ₹" name="currentPrice"   value={form.currentPrice}   onChange={handleChange} />
            <Field label="Predicted Price ₹" name="predictedPrice" value={form.predictedPrice} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Storage Cost ₹/kg"   name="storageCost"   value={form.storageCost}   onChange={handleChange} />
            <Field label="Transport Cost ₹/kg" name="transportCost" value={form.transportCost} onChange={handleChange} />
            <Field label="Days to Hold"         name="daysToHold"    value={form.daysToHold}    onChange={handleChange} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Calculating...</>
            ) : (
              <><span>🧮</span> Calculate Profit</>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 space-y-3 shadow-sm">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kpis.map((kpi) => <RevenueCard key={kpi.label} {...kpi} />)}
          </div>

          {/* AI Recommendation */}
          <RecommendationCard result={result} />

          {/* Break-even + ROI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Break-even Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl">⚖️</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Break-even Indicator</h3>
                  <p className="text-xs text-gray-400">Minimum price to cover all costs</p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                ₹{result.breakEvenPrice}/kg
              </p>
              <p className="text-xs text-gray-400 mb-3">
                You need to sell above this price after {result.daysToHold} days to make a profit.
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${form.predictedPrice >= result.breakEvenPrice ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min((form.predictedPrice / result.breakEvenPrice) * 100, 100)}%` }}
                />
              </div>
              <p className={`text-xs font-semibold mt-1.5 ${form.predictedPrice >= result.breakEvenPrice ? 'text-green-500' : 'text-red-500'}`}>
                {form.predictedPrice >= result.breakEvenPrice
                  ? `✓ Predicted price ₹${form.predictedPrice} exceeds break-even`
                  : `✗ Predicted price ₹${form.predictedPrice} is below break-even`}
              </p>
            </div>

            {/* ROI Card */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${result.roi >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${result.roi >= 0 ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                  📊
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Return on Investment</h3>
                  <p className="text-xs text-gray-400">Profit % vs current revenue</p>
                </div>
              </div>
              <p className={`text-4xl font-extrabold mb-1 ${result.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.roi >= 0 ? '+' : ''}{result.roi}%
              </p>
              <p className="text-xs text-gray-400 mb-3">
                {result.roi >= 0
                  ? `Holding for ${result.daysToHold} days yields a ${result.roi}% return.`
                  : `Holding for ${result.daysToHold} days results in a ${Math.abs(result.roi)}% loss.`}
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${result.roi >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.abs(result.roi), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Profit Comparison Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profit Comparison Chart</h3>
                <p className="text-sm text-gray-400 mt-0.5">Revenue · Expenses · Net Profit</p>
              </div>
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400 px-3 py-1 rounded-full border border-violet-100 dark:border-violet-800">
                {result.commodity}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={result.currentRevenue} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Current', fill: '#f59e0b', fontSize: 10 }} />
                <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]}
                  fill="#16a34a"
                  label={false}
                  isAnimationActive
                  animationDuration={800}
                  // per-bar colour via Cell would need import; use uniform green — matches design system
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  )
}
