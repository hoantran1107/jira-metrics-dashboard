import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BurndownData } from '@/types'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface BurndownChartProps {
  data: BurndownData[]
  loading?: boolean
}

export function BurndownChart({ data, loading = false }: BurndownChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sprint Burndown
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sprint Burndown
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Remaining work vs ideal burndown line
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs fill-gray-600 dark:fill-gray-400"
            />
            <YAxis 
              className="text-xs fill-gray-600 dark:fill-gray-400"
              label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tw-colors-white)',
                border: '1px solid var(--tw-colors-gray-200)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--tw-colors-gray-900)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#94A3B8" 
              strokeDasharray="5 5"
              name="Ideal"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="remaining" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Remaining"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
