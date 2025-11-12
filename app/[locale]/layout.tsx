import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import type { Metadata } from 'next'
import '../globals.css'
import { PageTransition } from '@/components/shared/page-transition'

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
    <NextIntlClientProvider messages={messages}>
      <PageTransition>{children}</PageTransition>
    </NextIntlClientProvider>
  )
}
