const getImpacts = (temperature, humidity, rainfall) => {
  const impacts = []

  if (rainfall > 60) {
    impacts.push({
      icon: 'Rain',
      level: 'High Risk',
      levelColor: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall expected. Vegetable prices may increase due to transportation issues.',
    })
  }

  if (temperature > 35) {
    impacts.push({
      icon: 'Heat',
      level: 'Moderate Risk',
      levelColor: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      title: 'High Temperature Warning',
      message: 'High temperature may reduce crop quality and accelerate spoilage in storage.',
    })
  }

  if (humidity > 80) {
    impacts.push({
      icon: 'Humid',
      level: 'Moderate Risk',
      levelColor: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      title: 'High Humidity Warning',
      message: 'High humidity may increase disease risk and fungal growth in stored produce.',
    })
  }

  if (impacts.length === 0) {
    impacts.push({
      icon: 'Yes',
      level: 'Favorable',
      levelColor: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      title: 'Ideal Farming Conditions',
      message: 'Weather conditions are favorable for farming. Good time to harvest and transport produce.',
    })
  }

  return impacts
}

export default function WeatherImpactCard({ temperature, humidity, rainfall }) {
  const impacts = getImpacts(temperature, humidity, rainfall)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">AI Weather Impact</h2>
          <p className="text-xs text-gray-400">Effect on agricultural commodity prices</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {impacts.map((impact, i) => (
          <div key={i} className={`${impact.bg} border rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{impact.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{impact.title}</p>
                  <span className={`text-[10px] font-bold ${impact.levelColor}`}>{impact.level}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{impact.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3">
        {[
          { label: 'Temperature', value: `${temperature} deg C`, bar: Math.min((temperature / 50) * 100, 100), color: 'bg-orange-400' },
          { label: 'Humidity',    value: `${humidity}%`,     bar: humidity,                                 color: 'bg-blue-400'   },
          { label: 'Rainfall',    value: `${rainfall}mm`,    bar: Math.min((rainfall / 100) * 100, 100),    color: 'bg-cyan-400'   },
        ].map(({ label, value, bar, color }) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-semibold">{label}</span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{value}</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${bar}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
