'use client'

import { motion } from 'motion/react'

const easeOutQuart = [0.25, 1, 0.5, 1] as const

export function WaveformDecoration({ className = '' }: { className?: string }) {
  const barCount = 10
  const barHeights = [40, 70, 55, 90, 45, 80, 60, 100, 50, 35]
  
  return (
    <div className={`flex items-end gap-[5px] ${className}`}>
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          className="w-[8px] rounded-full origin-bottom"
          style={{
            height: 110,
            background: `linear-gradient(to top, #635bff, #a78bfa)`,
          }}
          animate={{
            scaleY: [height / 100, (height + 30) / 100, height / 100],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function TrustBadge({ 
  color, 
  label 
}: { 
  color: string
  label: string 
}) {
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04]"
    >
      <div 
        className="w-[6px] h-[6px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span 
        className="text-[11px] uppercase tracking-[0.06em] text-white/72"
        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        {label}
      </span>
    </div>
  )
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Radial gradients */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 25% 35%, rgba(99,91,255,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 75% 75%, rgba(217,53,28,0.10) 0%, transparent 55%)
          `,
        }}
      />
      
      {/* Layer 2: Warm veil */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(99,91,255,0.18) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 80%, #000 100%)
          `,
        }}
      />
      
      {/* Layer 3: Grid lines */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 85%)',
        }}
      />
      
      {/* Layer 4: Purple blob */}
      <div 
        className="absolute w-[640px] h-[640px] rounded-full z-[2] animate-float"
        style={{
          background: 'rgba(99, 91, 255, 0.45)',
          filter: 'blur(90px)',
          top: '10%',
          left: '20%',
          willChange: 'transform',
        }}
      />
      
      {/* Layer 5: Red blob */}
      <div 
        className="absolute w-[540px] h-[540px] rounded-full z-[2] animate-float-delayed"
        style={{
          background: 'rgba(217, 53, 28, 0.18)',
          filter: 'blur(90px)',
          top: '40%',
          right: '10%',
          willChange: 'transform',
        }}
      />
      
      {/* Layer 6: Decorative API code text */}
      <div 
        className="absolute inset-0 z-[2] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      >
        <pre
          className="absolute top-[15%] left-[5%] text-[11px] leading-relaxed text-white/[0.045] whitespace-pre select-none"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
{`const stripe = require('stripe');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 40000,
  currency: 'gbp',
  capture_method: 'manual',
  metadata: {
    vouch_deal_id: 'deal_2xK9mN',
    counterparty: 'marcus@email.com'
  }
});

// ElevenLabs ConvAI
const session = await convai.createSession({
  voice: 'vera',
  language: 'en',
  mode: 'agreement_capture'
});`}
        </pre>
        <pre
          className="absolute top-[25%] right-[8%] text-[11px] leading-relaxed text-white/[0.045] whitespace-pre select-none"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
{`await convai.transcribe({
  audio: recordingBuffer,
  model: 'scribe_v2',
  realtime: true
});

stripe.issuing.cards.update(card.id, {
  status: 'inactive',
  spending_controls: {
    spending_limits: [{
      amount: 0,
      interval: 'all_time'
    }]
  }
});`}
        </pre>
      </div>
    </div>
  )
}
