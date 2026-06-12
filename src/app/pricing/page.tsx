import { Navbar } from '@/components/navbar'
import { Pricing } from '@/components/pricing-preview'
import { Footer } from '@/components/footer'

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <Footer />
    </main>
  )
}
