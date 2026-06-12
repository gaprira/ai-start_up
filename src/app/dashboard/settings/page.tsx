'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, CreditCard, Trash2, FlaskConical, Check, Loader2, Code2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const plans = [
  { name: 'Free', planKey: 'FREE', price: 0, features: ['3 startup generations', 'Basic idea overview', 'Simple scoring'] },
  { name: 'Pro', planKey: 'PRO', price: 19, features: ['Unlimited generations', 'Competitor analysis', 'Startup reports', 'Market analysis'], popular: true },
  { name: 'Founder', planKey: 'FOUNDER', price: 49, features: ['Everything in Pro', 'Launch plans', 'Branding kit', 'PDF exports', 'Startup scoring', 'Validation plans'] },
]

export default function SettingsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState('FREE')
  const [loading, setLoading] = useState<string | null>(null)
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('devMode')
    if (saved === 'true') setDevMode(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('devMode', String(devMode))
  }, [devMode])

  useEffect(() => {
    const localPlan = localStorage.getItem('currentPlan')
    if (localPlan) {
      setCurrentPlan(localPlan)
      return
    }
    fetch('/api/test/current-plan')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { if (data.plan) { setCurrentPlan(data.plan); localStorage.setItem('currentPlan', data.plan) } })
      .catch(() => {})
  }, [])

  const handleSwitchPlan = async (planKey: string) => {
    setLoading(planKey)
    const isTester = localStorage.getItem('testerMode') === 'true'
    try {
      const response = await fetch('/api/test/switch-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isTester ? { 'x-tester-mode': 'true' } : {}),
        },
        body: JSON.stringify({ plan: planKey }),
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      setCurrentPlan(data.plan)
      localStorage.setItem('currentPlan', data.plan)
      toast({ title: 'Plan updated!', description: `Switched to ${planKey} plan.` })
    } catch {
      setCurrentPlan(planKey)
      localStorage.setItem('currentPlan', planKey)
      toast({ title: 'Plan updated!', description: `Switched to ${planKey} plan.` })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">Settings</p>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <User className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Profile</h3>
            <p className="text-xs text-muted-foreground">Your account information</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">Name</Label>
            <Input id="name" defaultValue={user?.firstName || ''} readOnly className="bg-white/5 border-white/10 rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
            <Input id="email" defaultValue={user?.emailAddresses?.[0]?.emailAddress || ''} readOnly className="bg-white/5 border-white/10 rounded-xl h-11" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Plan:</span>
          <Badge variant="secondary">{currentPlan}</Badge>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Subscription</h3>
            <p className="text-xs text-muted-foreground">You are on the {currentPlan} plan</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.planKey}
              onClick={() => handleSwitchPlan(plan.planKey)}
              disabled={loading === plan.planKey || currentPlan === plan.planKey}
              className={`relative rounded-xl p-4 text-left transition-all ${
                currentPlan === plan.planKey
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px] px-1.5 py-0">Popular</Badge>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{plan.name}</span>
                {currentPlan === plan.planKey && <Check className="h-4 w-4 text-emerald-400" />}
              </div>
              <p className="text-lg font-bold mb-2">{plan.price === 0 ? 'Free' : `$${plan.price}`}<span className="text-xs text-muted-foreground">/mo</span></p>
              <ul className="space-y-1">
                {plan.features.slice(0, 2).map((f, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {loading === plan.planKey && <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Developer Mode</h3>
              <p className="text-xs text-muted-foreground">Test different plan configurations</p>
            </div>
          </div>
          <button
            onClick={() => setDevMode(!devMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${devMode ? 'bg-emerald-500' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${devMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {devMode && (
          <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <p className="text-xs text-muted-foreground mb-3">Subscription does not affect functionality. Switch freely for testing.</p>
            <div className="flex gap-2">
              {plans.map((plan) => (
                <Button
                  key={plan.planKey}
                  variant={currentPlan === plan.planKey ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-lg text-xs ${currentPlan === plan.planKey ? 'btn-gradient text-white' : 'border-white/10'}`}
                  onClick={() => handleSwitchPlan(plan.planKey)}
                  disabled={loading === plan.planKey}
                >
                  {plan.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-red-400">Danger Zone</h3>
            <p className="text-xs text-muted-foreground">Irreversible actions</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Delete your account and all associated data. This cannot be undone.</p>
        <Button variant="destructive" className="h-11 px-6 rounded-xl font-semibold">Delete Account</Button>
      </div>
    </div>
  )
}
