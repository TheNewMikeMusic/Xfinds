import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { UploadForm } from '@/components/dashboard/upload-form'
import { Card, CardContent } from '@/components/ui/card'

interface UploadPageProps {
  params: { locale: string }
}

export default function UploadPage({ params }: UploadPageProps) {
  setRequestLocale(params.locale)
  
  // Check if in development mode
  if (
    process.env.NODE_ENV !== 'development' &&
    !process.env.NEXT_PUBLIC_ADMIN_TOKEN
  ) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="glass max-w-md mx-auto">
            <CardContent className="p-6">
              <p className="text-center text-red-400">
                此功能仅在开发模式下可用
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <UploadForm />
      </main>
      <Footer />
    </div>
  )
}

