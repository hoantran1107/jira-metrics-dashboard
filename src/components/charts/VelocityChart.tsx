import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { VelocityData } from '@/types'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface VelocityChartProps {
  data: VelocityData[]
  loading?: boolean
}

export function VelocityChart({ data, loading = false }: VelocityChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sprint Velocity
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
          Sprint Velocity
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comparison of planned vs completed story points
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="sprint" 
              className="text-xs fill-gray-600 dark:fill-gray-400"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tw-colors-white)',
                border: '1px solid var(--tw-colors-gray-200)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'var(--tw-colors-gray-900)' }}
            />
            <Legend />
            <Bar 
              dataKey="planned" 
              fill="#94A3B8" 
              name="Planned" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="completed" 
              fill="#3B82F6" 
              name="Completed" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
