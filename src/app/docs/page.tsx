import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Zap, Shield, CreditCard } from 'lucide-react'

const docs = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Learn how to use Startup Generator 9000 to create your first startup idea.',
    content: 'Sign up for an account, complete your profile, and start generating ideas. The AI will analyze your inputs and generate comprehensive startup opportunities.',
  },
  {
    icon: Code,
    title: 'API Documentation',
    description: 'Integrate our AI generation capabilities into your own applications.',
    content: 'Our REST API allows you to generate startup ideas programmatically. Use the /api/generate endpoint with your API key.',
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'How we protect your data and ensure privacy.',
    content: 'All data is encrypted at rest and in transit. We use industry-standard security practices and never share your data with third parties.',
  },
  {
    icon: CreditCard,
    title: 'Billing & Plans',
    description: 'Understanding our pricing tiers and features.',
    content: 'We offer Free, Pro ($19/mo), and Founder ($49/mo) plans. Each tier unlocks additional features and capabilities.',
  },
]

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about using Startup Generator 9000.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {docs.map((doc, index) => (
              <Card key={index} className="border-white/10 bg-white/5">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <doc.icon className="h-6 w-6 text-emerald-500" />
                    <CardTitle>{doc.title}</CardTitle>
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{doc.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
