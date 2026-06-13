import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Company</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Insights on startups, AI, and entrepreneurship.
        </p>
        <div className="space-y-6">
          {[
            { title: 'How AI is Changing Startup Validation', date: 'Jun 2025', desc: 'Traditional validation takes months. AI-powered validation takes minutes.' },
            { title: 'The $100 Startup: Validating Ideas on a Budget', date: 'May 2025', desc: 'You don\'t need $50K to validate a startup idea. Here\'s how.' },
            { title: 'Why Most Startups Fail at Idea Stage', date: 'Apr 2025', desc: 'The #1 reason isn\'t lack of funding — it\'s building the wrong thing.' },
          ].map((post, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 cursor-pointer">
              <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground">{post.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
