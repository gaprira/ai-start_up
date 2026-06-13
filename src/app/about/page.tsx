import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Company</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">About Us</h1>
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            We believe everyone deserves a shot at building a startup. Our mission is to democratize entrepreneurship by using AI to generate, analyze, and validate startup ideas in minutes.
          </p>
          <p>
            Startup Generator 9000 combines market research, competitor analysis, business modeling, and go-to-market planning into a single AI-powered platform. What used to take weeks of consulting now takes minutes.
          </p>
          <p>
            Built with love by founders who have been through the startup journey ourselves.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
