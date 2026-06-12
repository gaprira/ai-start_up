import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Pricing } from '@/components/pricing-preview'
import { Footer } from '@/components/footer'
import { ParallaxBackground } from '@/components/parallax-bg'

export default function Home() {
  return (
    <main className="min-h-screen relative bg-transparent">
      <ParallaxBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Footer />
      </div>
    </main>
  )
}
