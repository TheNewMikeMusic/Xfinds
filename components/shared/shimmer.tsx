'use client'

export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:1000px_100%] ${className}`}
    />
  )
}

