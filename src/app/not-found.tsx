import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl sm:text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button className="btn-gradient text-white h-11 px-6 rounded-xl">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
