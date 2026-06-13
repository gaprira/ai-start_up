import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkWrapper } from '@/components/clerk-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { LangProvider } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Startup Generator 9000 - AI-Powered Startup Ideas',
  description: 'Generate complete startup opportunities with market analysis, business models, and launch plans using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>
            <ClerkWrapper>
              {children}
              <Toaster />
            </ClerkWrapper>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
