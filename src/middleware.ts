import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const publicPaths = createRouteMatcher([
  '/',
  '/pricing',
  '/docs',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (publicPaths(req)) {
    return
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
