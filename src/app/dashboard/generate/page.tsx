'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2, ArrowLeft, ArrowRight, Lightbulb, Code, Briefcase, DollarSign, Users, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'

const quickOptions: Record<string, Array<{ label: string; value: string }>> = {
  interests: [
    { label: 'AI / Machine Learning', value: 'AI, machine learning, deep learning' },
    { label: 'Web3 / Crypto', value: 'web3, cryptocurrency, blockchain, DeFi' },
    { label: 'Health & Fitness', value: 'health, fitness, wellness, nutrition' },
    { label: 'Education', value: 'education, online learning, tutoring' },
    { label: 'Gaming', value: 'gaming, game development, esports' },
    { label: 'Finance', value: 'fintech, personal finance, investing' },
    { label: 'Sustainability', value: 'sustainability, green tech, climate' },
    { label: 'E-commerce', value: 'e-commerce, retail, marketplace' },
    { label: 'Social & Community', value: 'social networks, community building, dating' },
    { label: 'Creative & Design', value: 'creative tools, graphic design, video editing' },
  ],
  skills: [
    { label: 'Programming', value: 'programming, software development, coding' },
    { label: 'Marketing', value: 'digital marketing, SEO, growth hacking, advertising' },
    { label: 'Design / UX', value: 'UI/UX design, graphic design, Figma, prototyping' },
    { label: 'Data Science', value: 'data analysis, data science, analytics, statistics' },
    { label: 'Sales', value: 'sales, B2B, negotiations, client management' },
    { label: 'Content Creation', value: 'content writing, copywriting, blogging, video' },
    { label: 'Management', value: 'project management, team leadership, operations' },
    { label: 'Finance', value: 'financial modeling, accounting, budgeting' },
    { label: 'No-Code / Low-Code', value: 'no-code tools, Bubble, Webflow, Zapier' },
    { label: 'AI / Prompting', value: 'AI prompting, ChatGPT, automation, AI tools' },
  ],
  industry: [
    { label: 'SaaS / B2B', value: 'SaaS, B2B software, enterprise tools' },
    { label: 'Healthcare', value: 'healthcare, medical, telemedicine, pharma' },
    { label: 'FinTech', value: 'fintech, banking, payments, insurance' },
    { label: 'EdTech', value: 'edtech, online education, LMS, training' },
    { label: 'E-commerce', value: 'e-commerce, D2C, marketplace, retail' },
    { label: 'Real Estate', value: 'real estate, PropTech, construction' },
    { label: 'Logistics', value: 'logistics, supply chain, delivery, transportation' },
    { label: 'Media & Entertainment', value: 'media, entertainment, streaming, content' },
    { label: 'Agriculture', value: 'agriculture, AgriTech, farming, food production' },
    { label: 'Cybersecurity', value: 'cybersecurity, data protection, privacy, compliance' },
  ],
  budget: [
    { label: '$0 (Bootstrapped)', value: '$0 — bootstrapped, no external funding' },
    { label: '$1K - $5K', value: '$1,000 - $5,000' },
    { label: '$5K - $20K', value: '$5,000 - $20,000' },
    { label: '$20K - $100K', value: '$20,000 - $100,000' },
    { label: '$100K+', value: '$100,000+ with investors' },
  ],
  audience: [
    { label: 'Individuals / B2C', value: 'individual consumers, B2C, end users' },
    { label: 'Small Business', value: 'small businesses, SMBs, startups, solopreneurs' },
    { label: 'Enterprise', value: 'enterprise companies, large organizations, B2B' },
    { label: 'Developers', value: 'developers, engineers, technical teams' },
    { label: 'Students', value: 'students, university, learning, academic' },
    { label: 'Freelancers', value: 'freelancers, creators, independent workers' },
    { label: 'Healthcare', value: 'doctors, clinics, healthcare professionals' },
    { label: 'Everyone', value: 'mass market, general audience, universal' },
  ],
}

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLang()
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({ interests: '', skills: '', industry: '', budget: '', audience: '' })

  const fields = [
    { key: 'interests', label: t.gen_interests, icon: Lightbulb, placeholder: t.gen_interests_hint, hint: t.gen_interests_hint },
    { key: 'skills', label: t.gen_skills, icon: Code, placeholder: t.gen_skills_hint, hint: t.gen_skills_hint },
    { key: 'industry', label: t.gen_industry, icon: Briefcase, placeholder: t.gen_industry_hint, hint: t.gen_industry_hint },
    { key: 'budget', label: t.gen_budget, icon: DollarSign, placeholder: t.gen_budget_hint, hint: t.gen_budget_hint },
    { key: 'audience', label: t.gen_audience, icon: Users, placeholder: t.gen_audience_hint, hint: t.gen_audience_hint },
  ]

  const currentField = fields[step]
  const currentValue = (formData as any)[currentField.key]
  const options = quickOptions[currentField.key] || []
  const progress = ((step + 1) / fields.length) * 100

  const toggleOption = (value: string) => {
    const current = currentValue || ''
    const parts = current.split(',').map((s: string) => s.trim()).filter(Boolean)
    const idx = parts.indexOf(value)
    if (idx >= 0) {
      parts.splice(idx, 1)
    } else {
      parts.push(value)
    }
    setFormData({ ...formData, [currentField.key]: parts.join(', ') })
  }

  const isOptionSelected = (value: string) => {
    const current = currentValue || ''
    return current.split(',').map((s: string) => s.trim()).includes(value)
  }

  const handleSubmit = async () => {
    setIsGenerating(true)
    try {
      const isTester = localStorage.getItem('testerMode') === 'true'
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isTester ? { 'x-tester-mode': 'true' } : {}),
        },
        body: JSON.stringify({ ...formData, lang: t.gen_btn.includes('генерировать') ? 'ru' : 'en' }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate ideas')
      }
      const data = await response.json()
      localStorage.setItem('lastIdeas', JSON.stringify(data.ideas))
      if (data.id) {
        localStorage.setItem(`gen_${data.id}`, JSON.stringify(data.ideas))
      }
      const gen = {
        id: data.id,
        interests: formData.interests,
        createdAt: new Date().toISOString(),
        scores: (data.ideas || []).map((i: any) => ({ name: i.name, score: i.totalScore })),
      }
      const gens = JSON.parse(localStorage.getItem('generations') || '[]')
      gens.unshift(gen)
      localStorage.setItem('generations', JSON.stringify(gens.slice(0, 20)))
      toast({ title: t.gen_toast_success, description: t.gen_toast_success_desc })
      router.push(`/dashboard/generate/results?id=${data.id}`)
    } catch (error) {
      toast({ title: t.gen_toast_error, description: error instanceof Error ? error.message : t.gen_toast_error_desc, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto min-h-[80vh] flex flex-col">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t.gen_back}
      </Link>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">{step + 1} / {fields.length}</span>
          <span className="text-xs text-emerald-400 font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <currentField.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{currentField.label}</h2>
              <p className="text-xs text-muted-foreground">{currentField.hint}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5 mb-5">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
                  isOptionSelected(opt.value)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground'
                }`}
              >
                {isOptionSelected(opt.value) && <Check className="h-3.5 w-3.5" />}
                {opt.label}
              </button>
            ))}
          </div>

          <Input
            placeholder={currentField.placeholder}
            value={currentValue}
            onChange={(e) => setFormData({ ...formData, [currentField.key]: e.target.value })}
            className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12 text-sm"
          />
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.gen_back_btn}
            </Button>
          )}
          <Button
            type="button"
            className={`h-12 rounded-xl font-semibold ${step === fields.length - 1 ? 'flex-1 btn-gradient text-white' : 'flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
            onClick={() => {
              if (step === fields.length - 1) {
                handleSubmit()
              } else {
                setStep(step + 1)
              }
            }}
            disabled={isGenerating || !currentValue}
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.gen_loading}</>
            ) : step === fields.length - 1 ? (
              <><Sparkles className="mr-2 h-4 w-4" />{t.gen_btn}</>
            ) : (
              <>{t.gen_next_btn} <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
