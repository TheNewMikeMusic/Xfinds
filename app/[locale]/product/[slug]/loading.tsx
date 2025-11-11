import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-[480px] w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      </div>
      <div className="mt-12 space-y-4">
        {[...Array(2)].map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
