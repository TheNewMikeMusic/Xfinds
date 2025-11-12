'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { UserSidebar } from '@/components/dashboard/user-sidebar'
import { EmailVerificationBanner } from '@/components/dashboard/email-verification-banner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('common')
  const [user, setUser] = useState<{ email: string; emailVerified?: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push(`/${locale}/auth/login`)
        } else {
          setUser(data.user)
        }
      })
      .catch(() => {
        router.push(`/${locale}/auth/login`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router, locale])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex flex-1 gap-6 px-4 py-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <UserSidebar />
        </aside>
        <div className="flex-1">
          <EmailVerificationBanner />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

