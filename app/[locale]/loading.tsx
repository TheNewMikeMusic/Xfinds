import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/search/product-card'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-blue-600/30 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

