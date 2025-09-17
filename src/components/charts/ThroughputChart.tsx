import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ThroughputData } from '@/types'
import { getIssueTypeColor } from '@/utils/colors'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ThroughputChartProps {
  data: ThroughputData[]
  loading?: boolean
}

export function ThroughputChart({ data, loading = false }: ThroughputChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Throughput Trend
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Transform data for stacked area chart
  const periods = [...new Set(data.map(d => d.period))]
  const issueTypes = [...new Set(data.map(d => d.type))]
  
  const chartData = periods.map(period => {
    const periodData: any = { period }
    issueTypes.forEach(type => {
      const item = data.find(d => d.period === period && d.type === type)
      periodData[type] = item?.completed || 0
    })
    return periodData
  })

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Throughput Trend
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Issues completed over time by type
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              className="text-xs fill-gray-600 dark:fill-gray-400"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs fill-gray-600 dark:fill-gray-400"
              label={{ value: 'Issues', angle: -90, position: 'insideLeft' }}
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
            {issueTypes.map((type) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                stackId="1"
                stroke={getIssueTypeColor(type)}
                fill={getIssueTypeColor(type)}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
