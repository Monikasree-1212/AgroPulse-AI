export default function VoiceButton({ listening, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={listening ? 'Stop listening' : 'Start voice assistant'}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50
        ${listening
          ? 'bg-red-500 hover:bg-red-600 scale-110'
          : 'bg-green-600 hover:bg-green-700 hover:scale-105'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Pulse rings when listening */}
      {listening && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" />
          <span className="absolute -inset-2 rounded-full border-2 border-red-400/50 animate-pulse" />
        </>
      )}

      {/* Icon */}
      {listening ? (
        /* Waveform bars */
        <span className="flex items-end gap-0.5 h-6">
          {[1, 2, 3, 4, 3].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-white rounded-full"
              style={{
                height: `${h * 5}px`,
                animation: `wavebar 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
              }}
            />
          ))}
        </span>
      ) : (
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-1 14.93V20H9v2h6v-2h-2v-2.07A7.001 7.001 0 0 0 19 11h-2a5 5 0 0 1-10 0H5a7.001 7.001 0 0 0 6 6.93z" />
        </svg>
      )}
    </button>
  )
}
