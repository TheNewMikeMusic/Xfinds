import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-ripple inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[44px] h-11 px-4 py-2 sm:h-9 sm:min-h-0",
        sm: "min-h-[44px] h-10 rounded-md px-3 text-xs sm:h-8 sm:min-h-0",
        lg: "min-h-[44px] h-12 rounded-md px-8 sm:h-10 sm:min-h-0",
        icon: "min-h-[44px] min-w-[44px] h-11 w-11 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, onPointerDown, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
      onPointerDown?.(event as React.PointerEvent<HTMLButtonElement>)
      if (event.defaultPrevented || disabled || prefersReducedMotion()) {
        return
      }

      const target = event.currentTarget as HTMLElement
      if (!target) return

      const rect = target.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      target.style.setProperty("--ripple-x", `${x}%`)
      target.style.setProperty("--ripple-y", `${y}%`)
      target.classList.remove("is-rippling")
      // Force reflow to restart animation
      void target.offsetWidth
      target.classList.add("is-rippling")
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        onPointerDown={handlePointerDown}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
