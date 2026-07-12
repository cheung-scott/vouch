'use client'

import { motion, useReducedMotion } from 'motion/react'
import { HeroBackground } from './hero-decorations'

// Motion constants per spec
const EASE = [0.22, 1, 0.36, 1] as const // easeOutQuart
const DURATION = {
  text: 0.5,
  reveal: 0.7,
  morph: 0.8,
  bgFlip: 0.3,
  microPop: 0.25,
  wordmarkScaleIn: 1.5, // Closing showstopper: slow scale-in
}

export function ClosingPlate() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <section 
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Reuse hero background for consistency */}
      <HeroBackground />
      
      {/* Additional radial glow behind wordmark */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,91,255,0.25) 0%, transparent 60%)',
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          className="font-semibold mb-6"
          style={{ 
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            color: 'var(--white)',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            willChange: 'transform, opacity',
          }}
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.wordmarkScaleIn, ease: EASE }}
        >
          Trust the handshake.
          <br />
          <em className="gradient-text-dark">Hold the money.</em>
        </motion.h2>
        
        {/* Subheadline */}
        <motion.p
          className="mb-10 max-w-lg mx-auto"
          style={{ 
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '18px',
            color: 'var(--white-dim)',
            lineHeight: 1.6,
          }}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.reveal, delay: 0.15, ease: EASE }}
        >
          2.9% per deal. No subscriptions. Built on Stripe + ElevenLabs.
        </motion.p>
        
        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.reveal, delay: 0.25, ease: EASE }}
        >
          <motion.button
            className="px-8 py-3.5 rounded-full font-medium text-white transition-all"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '15px',
              backgroundColor: 'var(--stripe-purple)',
              boxShadow: '0 0 32px rgba(99, 91, 255, 0.35)',
            }}
            whileHover={shouldReduceMotion ? {} : { 
              boxShadow: '0 0 48px rgba(99, 91, 255, 0.5)',
              scale: 1.02,
            }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: DURATION.bgFlip, ease: EASE }}
          >
            Start your first deal
            <span className="ml-2">→</span>
          </motion.button>
          
          <motion.button
            className="px-8 py-3.5 rounded-full font-medium transition-all"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '15px',
              color: 'var(--white-dim)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-dark-med)',
            }}
            whileHover={shouldReduceMotion ? {} : { 
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.25)',
            }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: DURATION.bgFlip, ease: EASE }}
          >
            See the demo
          </motion.button>
        </motion.div>
        
        {/* Powered by */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.14em]"
          style={{ 
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: 'var(--white-mute)',
          }}
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.text, delay: 0.4, ease: EASE }}
        >
          Vouch · Powered by Stripe + ElevenLabs
        </motion.p>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer 
      className="py-8 px-6"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span 
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{ 
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: 'var(--ink-muted)',
            }}
          >
            Vouch · Voice-confirmed payments on Stripe + ElevenLabs
          </span>
          
          <a 
            href="https://hacks.elevenlabs.io/hackathons/8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-stripe-purple"
            style={{ 
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: 'var(--ink-muted)',
            }}
          >
            Submitted to ElevenHacks 2026 Hack #9: Stripe · MIT
          </a>
        </div>
      </div>
    </footer>
  )
}
