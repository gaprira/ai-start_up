'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sparkles, Loader2, ArrowLeft, Lightbulb, Code, Briefcase, DollarSign, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLang()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({ interests: '', skills: '', industry: '', budget: '', audience: '' })

  const fields = [
    { key: 'interests', label: t.gen_interests, icon: Lightbulb, placeholder: t.gen_interests_hint, hint: t.gen_interests_hint },
    { key: 'skills', label: t.gen_skills, icon: Code, placeholder: t.gen_skills_hint, hint: t.gen_skills_hint },
    { key: 'industry', label: t.gen_industry, icon: Briefcase, placeholder: t.gen_industry_hint, hint: t.gen_industry_hint },
    { key: 'budget', label: t.gen_budget, icon: DollarSign, placeholder: t.gen_budget_hint, hint: t.gen_budget_hint, type: 'input' },
    { key: 'audience', label: t.gen_audience, icon: Users, placeholder: t.gen_audience_hint, hint: t.gen_audience_hint },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate ideas')
      }
      const data = await response.json()
      localStorage.setItem('lastIdeas', JSON.stringify(data.ideas))
      toast({ title: 'Ideas Generated!', description: 'Your startup ideas are ready.' })
      router.push(`/dashboard/generate/results?id=${data.id}`)
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed.', variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t.gen_back}
      </Link>
      <div className="mb-8">
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Generator</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.gen_title}</h1>
        <p className="text-muted-foreground">{t.gen_desc}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <field.icon className="h-4 w-4 text-emerald-400" />
              <Label htmlFor={field.key} className="text-sm font-semibold">{field.label}</Label>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{field.hint}</p>
            {field.type === 'input' ? (
              <Input id={field.key} placeholder={field.placeholder} value={(formData as any)[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-11" required />
            ) : (
              <Textarea id={field.key} placeholder={field.placeholder} value={(formData as any)[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl min-h-[80px] resize-none" required />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full h-14 btn-gradient text-white text-base font-semibold rounded-2xl group" disabled={isGenerating}>
          {isGenerating ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t.gen_loading}</>) : (<><Sparkles className="mr-2 h-5 w-5" />{t.gen_btn}</>)}
        </Button>
      </form>
    </div>
  )
}
