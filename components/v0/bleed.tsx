'use client'

export function Bleed() {
  return (
    <div
      aria-hidden="true"
      className="h-24"
      style={{
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 25%, var(--cream) 100%)',
      }}
    />
  )
}

export function BleedToBlack() {
  return (
    <div
      aria-hidden="true"
      className="h-24"
      style={{
        background: 'linear-gradient(180deg, var(--cream) 0%, #0a0a0a 75%, #000 100%)',
      }}
    />
  )
}
