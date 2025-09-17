import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'white' | 'gray'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

const colorClasses = {
  primary: 'border-primary-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-300 border-t-transparent dark:border-gray-600',
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'primary' 
}: LoadingSpinnerProps) {
  return (
    <div className={clsx(
      'animate-spin rounded-full border-2',
      sizeClasses[size],
      colorClasses[color],
      className
    )} />
  )
}

interface LoadingStateProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  loading, 
  children, 
  fallback,
  className 
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={clsx('flex items-center justify-center p-8', className)}>
        {fallback || <LoadingSpinner />}
      </div>
    )
  }

  return <>{children}</>
}
