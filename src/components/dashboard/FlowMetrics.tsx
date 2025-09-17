import { CycleTimeChart } from '@/components/charts/CycleTimeChart'
import { ThroughputChart } from '@/components/charts/ThroughputChart'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { AlertTriangle, ArrowRight, BarChart3, Clock } from 'lucide-react'

export default function FlowMetrics() {
  const cycleTimeData = [
    { issue: 'PROJ-123', cycleTime: 5, startDate: '2024-03-01', endDate: '2024-03-06', issueType: 'Story' },
    { issue: 'PROJ-124', cycleTime: 2, startDate: '2024-03-02', endDate: '2024-03-04', issueType: 'Bug' },
    { issue: 'PROJ-125', cycleTime: 8, startDate: '2024-03-01', endDate: '2024-03-09', issueType: 'Epic' },
    { issue: 'PROJ-126', cycleTime: 3, startDate: '2024-03-05', endDate: '2024-03-08', issueType: 'Task' },
    { issue: 'PROJ-127', cycleTime: 12, startDate: '2024-02-28', endDate: '2024-03-11', issueType: 'Story' },
    { issue: 'PROJ-128', cycleTime: 1, startDate: '2024-03-07', endDate: '2024-03-08', issueType: 'Bug' },
    { issue: 'PROJ-129', cycleTime: 6, startDate: '2024-03-03', endDate: '2024-03-09', issueType: 'Story' },
    { issue: 'PROJ-130', cycleTime: 4, startDate: '2024-03-06', endDate: '2024-03-10', issueType: 'Task' },
  ]

  const throughputData = [
    { period: 'Week 1', completed: 12, type: 'Story' },
    { period: 'Week 1', completed: 3, type: 'Bug' },
    { period: 'Week 1', completed: 5, type: 'Task' },
    { period: 'Week 2', completed: 15, type: 'Story' },
    { period: 'Week 2', completed: 2, type: 'Bug' },
    { period: 'Week 2', completed: 7, type: 'Task' },
    { period: 'Week 3', completed: 18, type: 'Story' },
    { period: 'Week 3', completed: 4, type: 'Bug' },
    { period: 'Week 3', completed: 6, type: 'Task' },
    { period: 'Week 4', completed: 14, type: 'Story' },
    { period: 'Week 4', completed: 1, type: 'Bug' },
    { period: 'Week 4', completed: 8, type: 'Task' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Flow Metrics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze work flow efficiency and identify bottlenecks
        </p>
      </div>

      {/* Key Flow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Cycle Time"
          value={5.1}
          change={-12}
          trend="down"
          format="number"
          icon={<Clock className="h-6 w-6" />}
        />
        <MetricCard
          title="Avg Lead Time"
          value={8.3}
          change={-5}
          trend="down"
          format="number"
          icon={<ArrowRight className="h-6 w-6" />}
        />
        <MetricCard
          title="Throughput"
          value={23}
          change={15}
          trend="up"
          format="number"
          icon={<BarChart3 className="h-6 w-6" />}
        />
        <MetricCard
          title="WIP Items"
          value={18}
          change={8}
          trend="up"
          format="number"
          icon={<AlertTriangle className="h-6 w-6" />}
        />
      </div>

      {/* Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flow Efficiency
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Work
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    72%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Wait Time
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    28%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stage Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">To Do</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">25 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">In Review</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">6 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Done</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">142 items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bottlenecks
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Code Review
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  Avg wait time: 2.3 days
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Testing
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Avg wait time: 1.8 days
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  In Progress
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  High WIP limit usage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CycleTimeChart data={cycleTimeData} />
        <ThroughputChart data={throughputData} />
      </div>
    </div>
  )
}
