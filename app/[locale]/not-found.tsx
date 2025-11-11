'use client'

import Link from 'next/link'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

export default function NotFound() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for does not exist. It may have been moved or deleted.
          </p>
          <Button asChild>
            <Link href={`/${locale}`}>Go Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
