import { formatMetricValue } from '@/utils/format'
import { clsx } from 'clsx'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ReactNode } from 'react'
import { Card } from './Card'

interface MetricCardProps {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'stable'
  format?: 'number' | 'percentage' | 'currency' | 'duration'
  icon?: ReactNode
  loading?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  format = 'number',
  icon,
  loading = false,
  className
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />
      case 'down':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
      case 'down':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            {icon && (
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            )}
          </div>
          {change !== undefined && (
            <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatMetricValue(value, format)}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="h-8 w-8 text-gray-400">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="mt-2 flex items-center">
          <div className={clsx(
            'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
            getTrendColor()
          )}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            vs last period
          </span>
        </div>
      )}
    </Card>
  )
}
