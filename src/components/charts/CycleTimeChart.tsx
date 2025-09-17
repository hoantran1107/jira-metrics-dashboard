import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { CycleTimeData } from '@/types'
import { getIssueTypeColor } from '@/utils/colors'
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

interface CycleTimeChartProps {
  data: CycleTimeData[]
  loading?: boolean
}

export function CycleTimeChart({ data, loading = false }: CycleTimeChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cycle Time Distribution
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Group data by issue type for different scatter plots
  const groupedData = data.reduce((acc, item, index) => {
    const group = acc.find(g => g.type === item.issueType)
    if (group) {
      group.data.push({ ...item, index })
    } else {
      acc.push({
        type: item.issueType,
        data: [{ ...item, index }],
        color: getIssueTypeColor(item.issueType)
      })
    }
    return acc
  }, [] as Array<{ type: string; data: any[]; color: string }>)

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cycle Time Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Days to complete issues by type
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number"
              dataKey="index"
              domain={[0, data.length]}
              className="text-xs fill-gray-600 dark:fill-gray-400"
              label={{ value: 'Issues', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number"
              dataKey="cycleTime"
              className="text-xs fill-gray-600 dark:fill-gray-400"
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      <p className="font-medium">{data.issue}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Type: {data.issueType}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cycle Time: {data.cycleTime} days
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            {groupedData.map((group) => (
              <Scatter
                key={group.type}
                name={group.type}
                data={group.data}
                fill={group.color}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          {groupedData.map((group) => (
            <div key={group.type} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {group.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
