'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <ErrorState
        title="An Error Occurred"
        description={error.message || 'An unexpected error occurred. Please try again.'}
        onRetry={reset}
      />
      <Button onClick={() => window.location.href = `/${locale}`} className="mt-4">
        Go Home
      </Button>
    </div>
  )
}
