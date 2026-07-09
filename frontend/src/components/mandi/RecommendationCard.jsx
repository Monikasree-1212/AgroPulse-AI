export default function RecommendationCard({ best, commodity }) {
  if (!best) return null
  return (
    <div className="relative rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-600 dark:to-amber-600">
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
          Top
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-xl font-extrabold text-white">AI Mandi Recommendation</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Best Profit</span>
            {best.distance && (
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                Location {best.distance} km away
              </span>
            )}
          </div>
          {best.isFallback && (
            <p className="text-white/80 text-xs font-semibold mb-2 bg-white/10 rounded-lg px-3 py-1.5 inline-block">
              Warning {best.fallbackMessage}
            </p>
          )}
          <p className="text-white/90 text-base leading-relaxed">
            Based on today's prices, selling{' '}
            <span className="font-extrabold text-white">{commodity}</span> at{' '}
            <span className="font-extrabold text-white">{best.marketName}</span> ({best.district}, {best.state}) gives the highest expected profit of{' '}
            <span className="font-extrabold text-white">Rs.{best.expectedProfit}/kg</span> after a transport cost of Rs.{best.transportCost}/kg
            {best.distance ? ` over ${best.distance} km` : ''}.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/20 rounded-2xl px-6 py-4 text-center min-w-[100px]">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Best Profit</p>
          <p className="text-white text-3xl font-extrabold">Rs.{best.expectedProfit}</p>
          <p className="text-white/70 text-xs mt-0.5">per kg</p>
        </div>
      </div>
    </div>
  )
}
