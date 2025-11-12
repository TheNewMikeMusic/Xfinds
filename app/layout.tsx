import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => ({ default: mod.Toaster })), {
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware will handle locale routing
  // This layout is just for the root and not-found pages
  const messages = await getMessages()

  return (
    <html lang="en" className="dark">
      <body 
        className={`${spaceGrotesk.variable} ${plexMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  )
}

