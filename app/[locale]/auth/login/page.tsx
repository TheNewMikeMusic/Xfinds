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

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('auth.login')
  const validation = useTranslations('auth.validation')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)

  const passwordStrength = evaluatePasswordStrength(password)

  const emailError =
    touched.email && email && !emailPattern.test(email) ? validation('invalidEmail') : ''
  const passwordError =
    touched.password && password && password.length < 8 ? validation('passwordShort') : ''

  const isFormValid = emailPattern.test(email) && password.length >= 8

  type FloatingState = 'default' | 'error' | 'success'
  const fieldState = (error: string, hasValue: boolean, isTouched: boolean): FloatingState => {
    if (error) return 'error'
    if (hasValue && isTouched) return 'success'
    return 'default'
  }

  const setFieldTouched = (field: 'email' | 'password') =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const handleResendVerification = async () => {
    if (!email) {
      setFormError(t('enterEmailFirst'))
      return
    }

    setResendingVerification(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend-verification', email }),
      })

      const data = await res.json()
      if (res.ok) {
        setFormError('')
        alert(t('verificationSent'))
      } else {
        setFormError(data.error || t('resendFailed'))
      }
    } catch (err) {
      setFormError(t('genericError'))
    } finally {
      setResendingVerification(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldTouched('email')
    setFieldTouched('password')

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
        body: JSON.stringify({ action: 'login', email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Check if email is verified
        if (!data.user?.emailVerified) {
          setEmailNotVerified(true)
          // Still allow login for demo, but show warning
          // Wait a bit to show the message, then redirect
          setTimeout(() => {
            router.push(`/${locale}/dashboard`)
            router.refresh()
          }, 2000)
        } else {
          router.push(`/${locale}/dashboard`)
          router.refresh()
        }
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
                {emailNotVerified && (
                  <motion.div
                    className="flex flex-col gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p>{t('emailNotVerified')}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                      className="w-full"
                    >
                      {resendingVerification ? t('sending') : t('resendVerification')}
                    </Button>
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
                  autoComplete="current-password"
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

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('submitting') : t('submit')}
              </Button>
              <p className="text-center text-sm text-gray-400">
                {t('noAccount')}{' '}
                <Link href={`/${locale}/auth/register`} className="text-blue-300 hover:text-blue-200">
                  {t('register')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
