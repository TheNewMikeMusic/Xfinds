'use client'

import Link from 'next/link'
import { Search, ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false)
  const [hasNewCartItem, setHasNewCartItem] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('nav')
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const previousCartCount = useRef(cartItemCount)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    if (cartItemCount > previousCartCount.current) {
      setHasNewCartItem(true)
      timeout = setTimeout(() => setHasNewCartItem(false), 1500)
    }
    previousCartCount.current = cartItemCount
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [cartItemCount])

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    setUser(null)
    router.push(`/${locale}`)
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b border-white/5 transition-all duration-500',
        mounted && scrolled
          ? 'bg-[#050916]/90 shadow-[0_20px_60px_rgba(5,8,19,0.85)] backdrop-blur-3xl'
          : 'bg-transparent backdrop-blur-xl'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="focus-ring flex items-center space-x-2 rounded-full px-3 py-1 transition-transform duration-500 hover:scale-105"
        >
          <div className="font-hacker text-sm uppercase tracking-[0.6em] text-sky-200">
            Xfinds
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden max-w-md flex-1 px-4 md:flex">
          <div
            className={cn(
              'group relative w-full rounded-full border border-white/5 bg-white/5 transition-all duration-300',
              'focus-within:border-lime-300/80 focus-within:shadow-[0_0_50px_rgba(94,243,140,0.35)]',
              isDesktopSearchFocused && 'border-lime-200/80 shadow-[0_0_50px_rgba(94,243,140,0.35)]'
            )}
          >
            <Input
              type="text"
              aria-label={t('searchPlaceholder')}
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onFocus={() => setIsDesktopSearchFocused(true)}
              onBlur={() => setIsDesktopSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-none bg-transparent pl-12 pr-4 py-2 font-mono text-base text-[#e6fff0] placeholder:text-slate-500 focus-visible:ring-0"
            />
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-lime-200"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile Search */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden focus-ring" aria-label={t('searchPlaceholder')}>
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="glass border-white/10 bg-[#01060a]/95 backdrop-blur-3xl motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top"
            >
              <form onSubmit={handleSearch} className="mt-6 space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  {t('searchPlaceholder')}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    aria-label={t('searchPlaceholder')}
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border-white/10 bg-white/5 pl-12 pr-4 py-3 font-mono text-base text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-lime-300/40"
                  />
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </form>
            </SheetContent>
          </Sheet>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative focus-ring" aria-live="polite">
            <Link href={`/${locale}/cart`}>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{t('cart')}</span>
              {cartItemCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-cyan-400 text-[11px] font-semibold text-gray-900 shadow-[0_8px_18px_rgba(94,243,140,0.35)]',
                    hasNewCartItem && 'badge-pulse'
                  )}
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="focus-ring">
                <User className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('userMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10 bg-[#0b1024]/95 backdrop-blur-2xl">
              {user ? (
                <>
                  <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('logout')}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/login`}>{t('login')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/register`}>{t('register')}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
