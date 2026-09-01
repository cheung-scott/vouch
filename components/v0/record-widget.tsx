'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

// Motion constants per spec
const EASE = [0.22, 1, 0.36, 1] as const // easeOutQuart
const DURATION = {
  text: 0.5,
  reveal: 0.7,
  morph: 0.8,
  bgFlip: 0.3,
  microPop: 0.25,
}

interface RecordWidgetProps {
  className?: string
}

// Per-bar animation speeds for the waveform. Fixed rather than random:
// Math.random() during render re-rolled every bar on every re-render, and is
// an impure render call. The bars only need to look unsynchronised.
const BAR_DURATIONS = [
  0.72, 0.94, 0.61, 0.86, 0.68, 0.99, 0.75, 0.63, 0.91, 0.70, 0.83, 0.66,
]

export function RecordWidget({ className = '' }: RecordWidgetProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [amount, setAmount] = useState('400')
  const [counterparty, setCounterparty] = useState('Marcus')
  const [deadline, setDeadline] = useState('Fri 24 May')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 5) {
            setIsRecording(false)
            setIsComplete(true)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleMicClick = () => {
    if (isComplete) {
      setIsComplete(false)
      setRecordingTime(0)
      return
    }
    if (isRecording) {
      setIsRecording(false)
      setIsComplete(true)
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      setIsComplete(false)
    }
  }

  return (
    <div className={`glass-dark rounded-[18px] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-6 h-px bg-white/48" />
        <span 
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/48"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          Try it
        </span>
        <span className="text-[11px] font-mono text-white/48 mx-1">·</span>
        <span 
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/48"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          10 seconds
        </span>
      </div>

      {/* Mic Button */}
      <div className="flex flex-col items-center mb-6">
        <motion.button
          onClick={handleMicClick}
          className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors duration-200 ${
            isRecording 
              ? 'bg-[#d9351c] animate-recording-pulse' 
              : isComplete 
                ? 'bg-[#2f7d57]' 
                : 'bg-[#635bff] animate-pulse-glow'
          }`}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          transition={{ duration: DURATION.microPop, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.svg
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: DURATION.microPop, ease: EASE }}
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: DURATION.microPop, ease: EASE }}
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Status text */}
        <div className="mt-4 text-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.p
                key="complete"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.microPop, ease: EASE }}
                className="text-[13px] text-[#2f7d57] font-medium"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Captured: &quot;{amount} for iPhone by Friday&quot;
              </motion.p>
            ) : isRecording ? (
              <motion.p
                key="recording"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.microPop, ease: EASE }}
                className="text-[13px] text-[#d9351c] font-medium"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Recording... {recordingTime.toFixed(1)}s
              </motion.p>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: DURATION.microPop, ease: EASE }}
                className="text-[11px] uppercase tracking-[0.08em] text-white/48"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                Tap mic · Speak the deal
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform visualization */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 32 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex items-end justify-center gap-[3px] mt-4"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-[#d9351c] rounded-full origin-bottom"
                  animate={{
                    scaleY: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: BAR_DURATIONS[i],
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: 'easeInOut',
                  }}
                  style={{ height: 24 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        <div className="relative">
          <label 
            className="absolute left-4 top-3 text-[11px] uppercase tracking-[0.08em] text-white/48"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Amount
          </label>
          <div className="flex items-center pt-7 pb-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-lg">
            <span className="text-white/48 mr-1">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-white text-[16px] font-medium w-full outline-none placeholder:text-white/32"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            />
          </div>
        </div>

        <div className="relative">
          <label 
            className="absolute left-4 top-3 text-[11px] uppercase tracking-[0.08em] text-white/48"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Counterparty
          </label>
          <input
            type="text"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            className="w-full pt-7 pb-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-[16px] font-medium outline-none placeholder:text-white/32 focus:border-[#635bff]/50 transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          />
        </div>

        <div className="relative">
          <label 
            className="absolute left-4 top-3 text-[11px] uppercase tracking-[0.08em] text-white/48"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Deadline
          </label>
          <input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full pt-7 pb-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-[16px] font-medium outline-none placeholder:text-white/32 focus:border-[#635bff]/50 transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          />
        </div>
      </div>
    </div>
  )
}
