import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false, // Disable automatic locale detection to always use defaultLocale
})

export const config = {
  // Match only internationalized pathnames
  // Exclude: api routes, Next.js internals, static files (images, icons, etc.)
  matcher: [
    '/',
    '/(zh|en)/:path*',
    '/((?!api|_next|_vercel|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|json|txt|xml|woff|woff2|ttf|eot)).*)'
  ]
}

