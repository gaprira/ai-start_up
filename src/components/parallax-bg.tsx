'use client'

import { useEffect, useRef } from 'react'

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const layers = containerRef.current.querySelectorAll<HTMLElement>('[data-speed]')

    const handleScroll = () => {
      const scrollY = window.scrollY
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed || '0')
        layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: 'hsl(240 10% 3.9%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsla(160, 84%, 39%, 0.06), transparent)' }} />

      <div
        data-speed="0.02"
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      <div
        data-speed="-0.06"
        className="absolute rounded-full"
        style={{
          width: '900px', height: '900px',
          left: '-200px', top: '-300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)',
          filter: 'blur(70px)',
        }}
      />

      <div
        data-speed="-0.04"
        className="absolute rounded-full"
        style={{
          width: '700px', height: '700px',
          right: '-200px', top: '30%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <div
        data-speed="-0.1"
        className="absolute rounded-full"
        style={{
          width: '500px', height: '500px',
          left: '10%', top: '65%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />

      {[
        { top: '8%', left: '12%', size: 6, color: 'rgba(16,185,129,0.5)', speed: '-0.2', delay: '0s' },
        { top: '18%', left: '78%', size: 4, color: 'rgba(20,184,166,0.4)', speed: '-0.15', delay: '1s' },
        { top: '32%', left: '8%', size: 3, color: 'rgba(34,211,238,0.35)', speed: '-0.25', delay: '2s' },
        { top: '48%', left: '88%', size: 5, color: 'rgba(52,211,153,0.35)', speed: '-0.18', delay: '0.5s' },
        { top: '62%', left: '22%', size: 4, color: 'rgba(16,185,129,0.4)', speed: '-0.22', delay: '1.5s' },
        { top: '78%', left: '72%', size: 3, color: 'rgba(20,184,166,0.35)', speed: '-0.12', delay: '2.5s' },
        { top: '88%', left: '42%', size: 5, color: 'rgba(34,211,238,0.3)', speed: '-0.2', delay: '3s' },
      ].map((p, i) => (
        <div
          key={i}
          data-speed={p.speed}
          className="absolute rounded-full animate-float"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            top: p.top, left: p.left,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDelay: p.delay,
          }}
        />
      ))}

      <div data-speed="0.015" className="absolute left-0 right-0 h-px" style={{ top: '15%', opacity: 0.15, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)' }} />
      <div data-speed="0.025" className="absolute left-0 right-0 h-px" style={{ top: '50%', opacity: 0.1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.3), transparent)' }} />
      <div data-speed="0.018" className="absolute left-0 right-0 h-px" style={{ top: '80%', opacity: 0.08, background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent)' }} />
    </div>
  )
}
