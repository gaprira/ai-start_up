export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const TRENDING_STARTUPS = [
  {
    name: 'LegalMind AI',
    pitch: 'AI-ассистент для мгновенного анализа и упрощения юридических документов',
    score: 92,
    tags: ['AI', 'LegalTech', 'B2B'],
    trend: '+340% спрос',
  },
  {
    name: 'EcoTrack',
    pitch: 'Платформа для отслеживания углеродного следа компаний с автоматическим отчётом',
    score: 89,
    tags: ['ClimateTech', 'ESG', 'SaaS'],
    trend: '+280% инвестиций',
  },
  {
    name: 'MediConnect',
    pitch: 'Телемедицинская платформа с AI-диагностикой для сельских регионов',
    score: 87,
    tags: ['HealthTech', 'AI', 'Telemedicine'],
    trend: '+210% пользователей',
  },
  {
    name: 'FinGuard',
    pitch: 'Система обнаружения финансовых мошенничеств в реальном времени',
    score: 86,
    tags: ['FinTech', 'Security', 'AI'],
    trend: '+190% спрос',
  },
  {
    name: 'EduSpark',
    pitch: 'Персонализированная AI-платформа обучения с адаптивными курсами',
    score: 85,
    tags: ['EdTech', 'AI', 'B2C'],
    trend: '+250% рост',
  },
  {
    name: 'AgriBot',
    pitch: 'Дроны и AI для мониторинга и оптимизации сельского хозяйства',
    score: 84,
    tags: ['AgriTech', 'AI', 'IoT'],
    trend: '+170% инвестиций',
  },
  {
    name: 'CodeAssist',
    pitch: 'AI-ревью кода с автоматическим исправлением ошибок и улучшением производительности',
    score: 83,
    tags: ['DevTools', 'AI', 'B2B'],
    trend: '+320% пользователей',
  },
  {
    name: 'GreenLogistics',
    pitch: 'Оптимизация логистики с минимизацией углеродного следа доставки',
    score: 81,
    tags: ['Logistics', 'GreenTech', 'SaaS'],
    trend: '+160% спрос',
  },
]

export async function GET() {
  return NextResponse.json({ startups: TRENDING_STARTUPS })
}
