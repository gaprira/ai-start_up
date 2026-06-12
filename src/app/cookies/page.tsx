import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Cookies</h2>
            <p>We use cookies for authentication, remembering your preferences, and analytics to improve our service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling cookies may affect some features of our service.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
