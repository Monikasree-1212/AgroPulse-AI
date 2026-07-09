const TYPE_META = {
  price:      { icon: '💲',   label: 'Price',      color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/30',  border: 'border-green-200 dark:border-green-800' },
  prediction: { icon: '🔮', label: 'Prediction', color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/30',    border: 'border-blue-200 dark:border-blue-800'   },
  weather:    { icon: '🌦️', label: 'Weather',    color: 'text-cyan-600 dark:text-cyan-400',    bg: 'bg-cyan-50 dark:bg-cyan-900/30',    border: 'border-cyan-200 dark:border-cyan-800'   },
  mandi:      { icon: '🏪', label: 'Mandi',      color: 'text-yellow-600 dark:text-yellow-400',bg: 'bg-yellow-50 dark:bg-yellow-900/30',border: 'border-yellow-200 dark:border-yellow-800'},
  government: { icon: '🏛️', label: 'Schemes',    color: 'text-violet-600 dark:text-violet-400',bg: 'bg-violet-50 dark:bg-violet-900/30',border: 'border-violet-200 dark:border-violet-800'},
  profit:     { icon: '?', label: 'Profit',     color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-900/30',  border: 'border-amber-200 dark:border-amber-800' },
  help:       { icon: '🤖', label: 'Help',       color: 'text-gray-600 dark:text-gray-400',    bg: 'bg-gray-50 dark:bg-gray-800',       border: 'border-gray-200 dark:border-gray-700'   },
  user:       { icon: 'Farming', label: 'You',       color: 'text-gray-700 dark:text-gray-300',    bg: 'bg-white dark:bg-gray-800',         border: 'border-gray-200 dark:border-gray-700'   },
}

export default function VoiceResponse({ message, onReplay }) {
  const meta = TYPE_META[message.type] ?? TYPE_META.help
  const isUser = message.type === 'user'

  return (
    <div className={`flex gap-3 animate-fadeIn ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-sm border ${meta.border} ${meta.bg}`}>
        {meta.icon}
      </div>

      {/* Bubble */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
          <span className="text-[10px] text-gray-400">{message.time}</span>
        </div>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border shadow-sm ${meta.bg} ${meta.border}
          ${isUser ? 'rounded-tr-sm text-gray-700 dark:text-gray-300' : 'rounded-tl-sm text-gray-800 dark:text-gray-200'}`}>
          {message.text}
        </div>
        {!isUser && onReplay && (
          <button
            onClick={() => onReplay(message.text)}
            aria-label="Replay this response"
            className="text-[10px] font-semibold text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 mt-0.5"
          >
            Audio Replay
          </button>
        )}
      </div>
    </div>
  )
}
