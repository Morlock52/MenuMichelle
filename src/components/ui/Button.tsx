'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { motion, HTMLMotionProps } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-primary-500 text-white',
    'hover:bg-primary-600 active:bg-primary-700',
    'shadow-md hover:shadow-lg',
    'dark:bg-primary-600 dark:hover:bg-primary-500'
  ),
  secondary: clsx(
    'bg-secondary-500 text-white',
    'hover:bg-secondary-600 active:bg-secondary-700',
    'shadow-md hover:shadow-lg'
  ),
  outline: clsx(
    'border-2 border-primary-500 text-primary-500',
    'hover:bg-primary-50 active:bg-primary-100',
    'dark:hover:bg-primary-900/30'
  ),
  ghost: clsx(
    'text-gray-700 dark:text-gray-300',
    'hover:bg-gray-100 active:bg-gray-200',
    'dark:hover:bg-gray-800 dark:active:bg-gray-700'
  ),
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-button',
  md: 'px-4 py-2.5 text-body rounded-button',
  lg: 'px-6 py-3 text-lg rounded-soft',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2',
          'font-semibold transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
