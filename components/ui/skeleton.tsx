import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "shimmer relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        "shadow-[0_15px_50px_rgba(5,7,16,0.55)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
