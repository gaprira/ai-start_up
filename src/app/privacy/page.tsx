import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly: your name, email address, startup preferences, and generated content. We also collect usage data to improve our service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, personalize your experience, and communicate with you about updates and features.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@startupgenerator9000.com.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
