import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By using Startup Generator 9000, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Use of Service</h2>
            <p>You may use our service for lawful purposes only. You are responsible for maintaining the confidentiality of your account.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Intellectual Property</h2>
            <p>Generated content is yours to use. Our platform, design, and code are owned by Startup Generator 9000.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Limitation of Liability</h2>
            <p>We are not liable for any business decisions made based on AI-generated content. Always validate ideas with real-world research.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
