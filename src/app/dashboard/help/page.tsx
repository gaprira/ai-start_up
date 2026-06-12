'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle, Mail, MessageSquare } from 'lucide-react'

const faqs = [
  { q: 'How does the AI generate startup ideas?', a: 'Our AI system uses multiple specialized agents to analyze your inputs and generate comprehensive startup opportunities. It considers market trends, competition, monetization potential, and your unique skills and interests.' },
  { q: 'How accurate are the market size estimates?', a: 'Market analysis is based on industry data and AI-powered estimation. While we strive for accuracy, these are estimates and should be validated with additional research.' },
  { q: 'Can I export my ideas as PDF?', a: 'PDF export is available for Founder plan subscribers. You can export complete startup reports with all analysis, scores, and recommendations.' },
  { q: 'How many ideas can I generate?', a: 'Free users can generate 3 ideas. Pro users get unlimited generations. Founder users get unlimited generations plus additional features.' },
  { q: 'How do I cancel my subscription?', a: 'You can manage your subscription through the billing portal. Go to Settings > Billing to access subscription management.' },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Support</p>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-sm">Frequently Asked Questions</h3>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
              <AccordionTrigger className="text-sm font-medium py-4">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Mail className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Email Support</h3>
          <p className="text-xs text-muted-foreground mb-4">Get help within 24 hours.</p>
          <Button variant="outline" className="w-full h-11 rounded-xl border-white/10">Contact Support</Button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Community</h3>
          <p className="text-xs text-muted-foreground mb-4">Join our community for tips.</p>
          <Button variant="outline" className="w-full h-11 rounded-xl border-white/10">Join Discord</Button>
        </div>
      </div>
    </div>
  )
}
