'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function UserSidebar() {
  const params = useParams()
  const pathname = usePathname()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('dashboard')

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t('overview'),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/dashboard/profile`,
      label: t('profile'),
      icon: User,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t('settings'),
      icon: Settings,
    },
  ]

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600/20 text-blue-300'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

