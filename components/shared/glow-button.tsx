import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'danger' | 'ok'
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variantClasses = {
      primary: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400',
      accent: 'from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400',
      danger: 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400',
      ok: 'from-green-600 to-green-500 hover:from-green-500 hover:to-green-400',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'glow-button',
          `bg-gradient-to-r ${variantClasses[variant]}`,
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlowButton.displayName = 'GlowButton'

