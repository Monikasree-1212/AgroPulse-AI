export default function RecommendationCard({ result }) {
  const hold = result.recommendation === 'HOLD'
  const roiPositive = result.roi >= 0

  return (
    <div className={`relative rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden
      ${hold ? 'bg-gradient-to-r from-green-600 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
          {hold ? '📦' : '💸'}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-xl font-extrabold text-white">AI Profit Recommendation</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {result.commodity} · {result.quantity} kg
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {result.daysToHold} days
            </span>
          </div>
          <p className="text-white/90 text-base leading-relaxed">
            {hold ? (
              <>
                <span className="font-extrabold text-white">HOLD for {result.daysToHold} days.</span>{' '}
                Expected profit increase of{' '}
                <span className="font-extrabold text-white">₹{result.profitDifference.toLocaleString()}</span>.{' '}
                Net future profit is{' '}
                <span className="font-extrabold text-white">₹{result.netFutureProfit.toLocaleString()}</span> after all expenses.
              </>
            ) : (
              <>
                <span className="font-extrabold text-white">SELL TODAY.</span>{' '}
                Holding will result in a loss of{' '}
                <span className="font-extrabold text-white">₹{Math.abs(result.profitDifference).toLocaleString()}</span>.{' '}
                Current revenue of{' '}
                <span className="font-extrabold text-white">₹{result.currentRevenue.toLocaleString()}</span> is your best option.
              </>
            )}
          </p>
          <p className="text-white/70 text-sm mt-2">
            Break-even price: <span className="font-bold text-white">₹{result.breakEvenPrice}/kg</span>
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white/20 rounded-2xl px-5 py-3 text-center min-w-[90px]">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">ROI</p>
            <p className="text-white text-2xl font-extrabold">{roiPositive ? '+' : ''}{result.roi}%</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-5 py-3 text-center min-w-[90px]">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Verdict</p>
            <p className="text-white text-sm font-extrabold">{result.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
