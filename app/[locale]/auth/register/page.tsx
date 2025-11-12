'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FloatingInput } from '@/components/ui/floating-input'
import { evaluatePasswordStrength } from '@/lib/password-utils'
import { PasswordStrengthMeter } from '@/components/auth/password-strength'
import { AnimatePresence, motion } from 'framer-motion'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('auth.register')
  const validation = useTranslations('auth.validation')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false })
  const [registered, setRegistered] = useState(false)
  const [verificationToken, setVerificationToken] = useState<string | null>(null)

  const passwordStrength = evaluatePasswordStrength(password)

  const emailError =
    touched.email && email && !emailPattern.test(email) ? validation('invalidEmail') : ''
  const passwordError =
    touched.password && password && password.length < 8 ? validation('passwordShort') : ''
  const confirmError =
    touched.confirm && confirmPassword && confirmPassword !== password ? t('passwordMismatch') : ''

  const isFormValid =
    emailPattern.test(email) && password.length >= 8 && confirmPassword === password

  type FloatingState = 'default' | 'error' | 'success'
  const fieldState = (
    error: string,
    hasValue: boolean,
    isTouched: boolean
  ): FloatingState => {
    if (error) return 'error'
    if (hasValue && isTouched) return 'success'
    return 'default'
  }

  const setFieldTouched = (field: 'email' | 'password' | 'confirm') =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldTouched('email')
    setFieldTouched('password')
    setFieldTouched('confirm')

    if (!isFormValid) {
      setFormError(validation('fixErrors'))
      return
    }

    setLoading(true)
    setFormError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Show verification message
        setRegistered(true)
        setVerificationToken(data.user?.verificationToken || null)
        // Still redirect but show message
        setTimeout(() => {
          router.push(`/${locale}/dashboard`)
          router.refresh()
        }, 3000)
      } else {
        setFormError(data.error || t('error'))
      }
    } catch (err) {
      setFormError(t('genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
        <Card className="glass w-full max-w-md border-blue-600/30 bg-gray-900/80">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">{t('title')}</CardTitle>
            <CardDescription className="text-gray-400">{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {registered ? (
              <div className="space-y-4">
                <motion.div
                  className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {t('verificationSent')}
                  </h3>
                  <p className="mb-4 text-sm text-gray-300">{t('checkEmail')}</p>
                  {verificationToken && (
                    <div className="mt-4 rounded-lg bg-gray-800/50 p-3">
                      <p className="mb-2 text-xs text-gray-400">{t('demoMode')}</p>
                      <a
                        href={`/api/auth/verify-email?token=${verificationToken}`}
                        className="break-all text-sm text-blue-300 hover:text-blue-200"
                      >
                        {typeof window !== 'undefined'
                          ? `${window.location.origin}/api/auth/verify-email?token=${verificationToken}`
                          : `/api/auth/verify-email?token=${verificationToken}`}
                      </a>
                    </div>
                  )}
                  <p className="mt-4 text-xs text-gray-400">{t('redirecting')}</p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

              <FloatingInput
                id="email"
                label={t('email')}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setFieldTouched('email')}
                state={fieldState(emailError, Boolean(email), touched.email)}
                error={emailError}
              />

              <div>
                <FloatingInput
                  id="password"
                  label={t('password')}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setFieldTouched('password')}
                  state={fieldState(passwordError, Boolean(password), touched.password)}
                  error={passwordError}
                  hint={!passwordError && password ? validation('passwordHint') : undefined}
                />
                {password && (
                  <PasswordStrengthMeter
                    score={passwordStrength.score}
                    level={passwordStrength.level}
                    label={validation('passwordStrength', {
                      level: validation(
                        passwordStrength.level === 'strong'
                          ? 'strengthStrong'
                          : passwordStrength.level === 'medium'
                          ? 'strengthMedium'
                          : 'strengthWeak'
                      ),
                    })}
                  />
                )}
              </div>

              <FloatingInput
                id="confirmPassword"
                label={t('confirmPassword')}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setFieldTouched('confirm')}
                state={fieldState(confirmError, Boolean(confirmPassword), touched.confirm)}
                error={confirmError}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('submitting') : t('submit')}
              </Button>
              <p className="text-center text-sm text-gray-400">
                {t('hasAccount')}{' '}
                <Link href={`/${locale}/auth/login`} className="text-blue-300 hover:text-blue-200">
                  {t('login')}
                </Link>
              </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
