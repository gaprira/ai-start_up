import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Product</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Features</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Everything you need to go from idea to launch.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'AI Idea Generation', desc: 'Generate multiple startup ideas tailored to your unique skills, interests, and market conditions.' },
            { title: 'Market Analysis', desc: 'TAM/SAM/SOM estimates, competitor analysis, and market gap identification.' },
            { title: 'Business Models', desc: 'Complete pricing strategies, subscription tiers, and revenue projections.' },
            { title: 'MVP Planning', desc: 'Core features, tech stack recommendations, and development timelines.' },
            { title: 'Validation Plans', desc: 'Find your first 10 customers with outreach templates and landing page copy.' },
            { title: 'Branding Kit', desc: 'Brand names, taglines, domain suggestions, and logo generation prompts.' },
            { title: 'PDF Reports', desc: 'Export complete startup reports with all analysis and recommendations.' },
            { title: 'Opportunity Scoring', desc: 'AI-scored ideas ranked by market size, pain level, competition, and monetization.' },
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
