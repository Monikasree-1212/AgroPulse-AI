import { useState, useRef, useEffect, useCallback } from 'react'
import api from '../../services/api'
import VoiceButton from './VoiceButton'
import VoiceResponse from './VoiceResponse'
import { useGuest } from '../auth/GuestMode'

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function VoiceAssistant() {
  const { user } = useGuest()
  const preferredLanguage = user?.preferredLanguage || 'English'
  const langMap = {
    'English': 'en-IN',
    'Tamil': 'ta-IN',
    'Hindi': 'hi-IN',
    'Telugu': 'te-IN',
    'Kannada': 'kn-IN',
    'Malayalam': 'ml-IN'
  }
  const locale = langMap[preferredLanguage] || 'en-IN'

  const [open,       setOpen]       = useState(false)
  const [listening,  setListening]  = useState(false)
  const [processing, setProcessing] = useState(false)
  const [speaking,   setSpeaking]   = useState(false)
  const [muted,      setMuted]      = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history,    setHistory]    = useState([])
  const [error,      setError]      = useState('')

  const recognitionRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const synthRef       = useRef(window.speechSynthesis)
  const bottomRef      = useRef(null)

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const speak = useCallback((text) => {
    if (muted || !synthRef.current) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang  = locale
    utt.rate  = 0.90
    utt.pitch = 1
    utt.onstart = () => setSpeaking(true)
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    synthRef.current.speak(utt)
  }, [muted, locale])

  const addMessage = useCallback((type, text) => {
    setHistory((h) => [...h, { type, text, time: now(), id: Date.now() + Math.random() }])
  }, [])

  const sendQuery = useCallback(async (text) => {
    if (!text.trim()) return
    setError('')
    addMessage('user', text)
    setProcessing(true)
    try {
      const mappedHistory = history.map(h => ({ role: h.type, content: h.text }))
      const { data } = await api.post('/api/voice/query', { 
        text,
        history: mappedHistory,
        language: preferredLanguage
      })
      addMessage(data.type, data.reply)
      speak(data.reply)
    } catch {
      const msg = 'Sorry, I could not process your request. Please try again.'
      addMessage('help', msg)
      speak(msg)
      setError(msg)
    } finally {
      setProcessing(false)
      setTranscript('')
    }
  }, [addMessage, speak, history, preferredLanguage])

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    if (recognitionRef.current) recognitionRef.current.abort()
    
    // Stop speaking when mic is clicked again
    synthRef.current?.cancel()
    setSpeaking(false)

    const rec = new SpeechRecognitionAPI()
    rec.lang          = locale
    rec.continuous    = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onstart  = () => { setListening(true); setTranscript(''); setError('') }
    rec.onend    = () => {
      setListening(false)
      clearTimeout(silenceTimerRef.current)
    }
    rec.onerror  = (e) => {
      setListening(false)
      clearTimeout(silenceTimerRef.current)
      if (e.error !== 'no-speech') setError(`Microphone error: ${e.error}`)
    }
    rec.onresult = (e) => {
      const interim = Array.from(e.results).map((r) => r[0].transcript).join('')
      setTranscript(interim)
      
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        rec.stop()
        if (interim.trim()) {
          sendQuery(interim)
        }
      }, 3500)
    }

    recognitionRef.current = rec
    rec.start()
  }, [sendQuery, locale])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    clearTimeout(silenceTimerRef.current)
    setListening(false)
    synthRef.current?.cancel()
    setSpeaking(false)
  }, [])

  const handleMicClick = () => {
    if (listening) stopListening()
    else startListening()
  }

  const handleReplay = (text) => speak(text)

  const handleClear = () => {
    setHistory([])
    setTranscript('')
    setError('')
    synthRef.current?.cancel()
    setSpeaking(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
  }

  /* Greet on first open */
  useEffect(() => {
    if (open && history.length === 0) {
      const greeting = 'Hello! I am AgroPulse AI Voice Assistant. Ask me about crop prices, weather, mandis, government schemes, or profit calculations.'
      addMessage('help', greeting)
      speak(greeting)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Wavebar keyframe - injected once */}
      <style>{`
        @keyframes wavebar { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
      `}</style>

      {/* Floating container - bottom right */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
        onKeyDown={handleKeyDown}
      >

        {/* Chat panel */}
        {open && (
          <div className="w-[340px] sm:w-[380px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
               style={{ maxHeight: '520px' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">Farming</span>
                <div>
                  <p className="text-white font-extrabold text-sm leading-tight">AgroPulse Voice AI</p>
                  <p className="text-white/70 text-[10px]">
                    {listening ? 'Listening...' : processing ? 'AI Thinking...' : speaking ? 'Speaking...' : 'Ready'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xs transition-colors"
                  title={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? 'Mute' : 'Audio'}
                </button>
                <button
                  onClick={handleClear}
                  aria-label="Clear history"
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xs transition-colors"
                  title="Clear history"
                >

                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close voice assistant"
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm transition-colors"
                >
                  No
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {history.map((msg) => (
                <VoiceResponse key={msg.id} message={msg} onReplay={handleReplay} />
              ))}

              {/* Live transcript */}
              {listening && transcript && (
                <div className="flex gap-3 animate-fadeIn flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[36px] flex-shrink-0">🌾</div>
                  <div className="flex-1 max-w-[85%] flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Listening...</span>
                    <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 italic">
                      {transcript}
                    </div>
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              {processing && (
                <div className="flex gap-3 animate-fadeIn">
                  <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center text-[36px] flex-shrink-0">🤖</div>
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl rounded-tl-sm">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && !processing && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2 animate-fadeIn">
                  <span className="text-sm">Warning</span>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Footer hint */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              <p className="text-[10px] text-gray-400 text-center">
                {SpeechRecognitionAPI
                  ? 'Tap the mic and ask about prices, weather, mandis, or schemes'
                  : 'Warning Speech recognition not supported - use Chrome or Edge'}
              </p>
            </div>
          </div>
        )}

        {/* Floating mic button */}
        <div className="flex items-center gap-3">
          {!open && (
            <span className="bg-gray-900/80 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur pointer-events-none">
              Voice AI
            </span>
          )}
          <VoiceButton
            listening={listening}
            disabled={processing}
            onClick={open ? handleMicClick : () => setOpen(true)}
          />
        </div>
      </div>
    </>
  )
}
