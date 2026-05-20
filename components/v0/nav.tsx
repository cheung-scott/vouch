'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

const easeOutQuart = [0.25, 1, 0.5, 1] as const

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Pulsing dot logo mark */}
          <div className="relative w-7 h-7 rounded-full bg-[#635bff] flex items-center justify-center">
            <div className="w-[10px] h-[10px] rounded-full bg-white animate-breathing" />
          </div>
          {/* Wordmark */}
          <span 
            className="text-[24px] font-semibold text-white"
            style={{ fontFamily: 'var(--font-fraunces), serif' }}
          >
            Vouch
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="text-[14px] text-white/48 hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="text-[14px] text-white/48 hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Pricing
          </Link>
          <Link
            href="/#trust"
            className="text-[14px] text-white/48 hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Trust
          </Link>
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{
            boxShadow: '0 0 20px 4px rgba(99, 91, 255, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: easeOutQuart }}
          className="rounded-full"
        >
          <Link
            href="/new"
            className="inline-block rounded-full bg-[#635bff] px-5 py-2.5 text-[14px] font-medium text-white"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Start a deal
          </Link>
        </motion.div>
      </div>
    </nav>
  )
}
