'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
      <Button onClick={() => window.location.href = '/en'} className="mt-4">
        Go Home
      </Button>
    </div>
  )
}
