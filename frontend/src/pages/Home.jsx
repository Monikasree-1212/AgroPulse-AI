const features = [
  {
    icon: '📈',
    title: 'AI Price Forecasting',
    desc: 'Leverage machine learning models trained on years of mandi data to predict commodity prices with high accuracy up to 30 days in advance.',
  },
  {
    icon: '🏪',
    title: 'Smart Mandi Intelligence',
    desc: 'Compare real-time prices across hundreds of mandis in your region and find the most profitable market for your produce.',
  },
  {
    icon: '💰',
    title: 'Profit Optimization',
    desc: 'Input your yield, transport cost, and storage capacity to receive a personalized selling strategy that maximises your net profit.',
  },
  {
    icon: '🌦️',
    title: 'Weather Impact Analysis',
    desc: 'Understand how upcoming weather patterns will affect crop supply and demand, so you can time your sales perfectly.',
  },
]

const steps = [
  { num: '01', title: 'Select Commodity', desc: 'Choose your crop or commodity from our comprehensive database of 200+ agricultural products.' },
  { num: '02', title: 'Analyze Historical Data', desc: 'Our AI processes years of price trends, seasonal patterns, and market cycles for your commodity.' },
  { num: '03', title: 'AI Predicts Future Prices', desc: 'Advanced forecasting models generate price predictions for multiple mandis over the next 30 days.' },
  { num: '04', title: 'Get Smart Recommendations', desc: 'Receive actionable insights on where, when, and how much to sell for maximum profitability.' },
]

const benefits = [
  { icon: '🎯', title: 'Better Selling Decisions', desc: 'Data-driven recommendations eliminate guesswork and emotional selling decisions.' },
  { icon: '📈', title: 'Higher Profits', desc: 'Farmers using AgroPulse AI report an average 23% increase in net income per season.' },
  { icon: '🔎', title: 'Market Transparency', desc: 'Full visibility into price movements, demand trends, and competitor activity across all mandis.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Continuously learning models adapt to new market conditions and improve forecast accuracy over time.' },
]

import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">Farming AgroPulse AI</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-green-600 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-green-600 transition-colors">Benefits</a>
            <button onClick={() => navigate('/commodity')} className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">Get Started</button>
          </div>
        </div>
      </nav>

      {/* -- HERO -- */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-green-200 opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-lime-300 opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
             Powered by Artificial Intelligence
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Agro<span className="text-green-600">Pulse</span>🤖</h1>

          <p className="text-xl sm:text-2xl font-semibold text-green-700 mb-4">
            Smart Agricultural Market Intelligence Platform
          </p>

          <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed mb-10">
            Stop selling at the wrong price, at the wrong mandi, at the wrong time.
            AgroPulse AI empowers farmers with real-time market data, AI price forecasts,
            and personalised profit strategies - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" id="get-started">
            <button
              onClick={() => navigate('/commodity')}
              className="bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
            </button>
            <a
              href="#how-it-works"
              className="border-2 border-green-600 text-green-700 text-lg font-semibold px-8 py-4 rounded-full hover:bg-green-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Markets
            </a>
          </div>

          {/* stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { val: '200+', label: 'Commodities' },
              { val: '500+', label: 'Mandis Tracked' },
              { val: '23%', label: 'Avg. Profit Boost' },
              { val: '10L+', label: 'Farmers Served' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-bold text-green-600">{val}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FEATURES -- */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-600 font-semibold uppercase tracking-widest text-sm">What We Offer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Powerful Features for Smarter Farming</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Everything you need to make confident, profitable market decisions - backed by AI.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-green-200 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- HOW IT WORKS -- */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-600 font-semibold uppercase tracking-widest text-sm">The Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">How AgroPulse AI Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From commodity selection to actionable selling recommendations in four simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* connector line (desktop only) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-green-200" />

            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4 shadow-md">
                  {num}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- BENEFITS -- */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-green-600 font-semibold uppercase tracking-widest text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Benefits That Make a Real Difference</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">AgroPulse AI is built for farmers, by people who understand agriculture and technology.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- CTA BANNER -- */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Maximise Your Farm's Profits?</h2>
          <p className="text-green-100 text-lg mb-8">Join over 10 lakh farmers already making smarter selling decisions with AgroPulse AI.</p>
          <button
            onClick={() => navigate('/commodity')}
            className="inline-block bg-white text-green-700 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Start for Free {'->'}
          </button>
        </div>
      </section>

      {/* -- FOOTER -- */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">Farming</span>
              <span className="text-lg font-bold text-white">AgroPulse AI</span>
            </div>
            <p className="text-sm">Smart Agricultural Market Intelligence Platform</p>
            <p className="text-sm">(c) {new Date().getFullYear()} AgroPulse AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
