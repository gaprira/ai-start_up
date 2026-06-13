import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Company</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Careers</h1>
        <p className="text-lg text-muted-foreground mb-12">
          We&apos;re hiring! Join us in building the future of entrepreneurship.
        </p>
        <div className="space-y-4">
          {[
            { title: 'Full-Stack Engineer', type: 'Remote', desc: 'Build and scale our platform with Next.js, TypeScript, and AI.' },
            { title: 'AI/ML Engineer', type: 'Remote', desc: 'Improve our AI generation pipeline and prompt engineering.' },
            { title: 'Designer', type: 'Remote', desc: 'Craft beautiful, intuitive experiences for our users.' },
          ].map((job, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.desc}</p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">{job.type}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
