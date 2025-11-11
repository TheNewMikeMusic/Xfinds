import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import type { Metadata } from 'next'
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import '../globals.css'
import dynamic from 'next/dynamic'
import { PageTransition } from '@/components/shared/page-transition'

const Toaster = dynamic(() => import('@/components/ui/toaster').then((mod) => ({ default: mod.Toaster })), {
  ssr: false,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Xfinds - Product Search & Agent Comparison',
  description: 'Modern product search and agent comparison platform',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`${spaceGrotesk.variable} ${plexMono.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <PageTransition>{children}</PageTransition>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  )
}
