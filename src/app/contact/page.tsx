import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Company</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Contact</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Have a question or want to work together? Reach out.
        </p>
        <div className="glass-card rounded-2xl p-8">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input type="text" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500/50" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500/50" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-emerald-500/50 resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="h-11 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
