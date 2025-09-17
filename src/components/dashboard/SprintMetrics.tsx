import { BurndownChart } from '@/components/charts/BurndownChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { Calendar, Target, TrendingUp } from 'lucide-react'

export default function SprintMetrics() {
  // Mock data - in real app, this would come from API
  const velocityData = [
    { sprint: 'Sprint 1', planned: 40, completed: 38, date: '2024-01-01' },
    { sprint: 'Sprint 2', planned: 42, completed: 42, date: '2024-01-15' },
    { sprint: 'Sprint 3', planned: 45, completed: 40, date: '2024-01-29' },
    { sprint: 'Sprint 4', planned: 38, completed: 35, date: '2024-02-12' },
    { sprint: 'Sprint 5', planned: 44, completed: 46, date: '2024-02-26' },
  ]

  const burndownData = [
    { date: 'Day 1', remaining: 44, ideal: 44 },
    { date: 'Day 2', remaining: 42, ideal: 41 },
    { date: 'Day 3', remaining: 39, ideal: 38 },
    { date: 'Day 4', remaining: 35, ideal: 35 },
    { date: 'Day 5', remaining: 32, ideal: 32 },
    { date: 'Day 6', remaining: 28, ideal: 29 },
    { date: 'Day 7', remaining: 24, ideal: 26 },
    { date: 'Day 8', remaining: 20, ideal: 23 },
    { date: 'Day 9', remaining: 16, ideal: 20 },
    { date: 'Day 10', remaining: 12, ideal: 17 },
    { date: 'Day 11', remaining: 8, ideal: 14 },
    { date: 'Day 12', remaining: 4, ideal: 11 },
    { date: 'Day 13', remaining: 1, ideal: 8 },
    { date: 'Day 14', remaining: 0, ideal: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sprint Metrics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track sprint performance, velocity, and burndown progress
        </p>
      </div>

      {/* Current Sprint Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Current Sprint"
          value="Sprint 5"
          icon={<Calendar className="h-6 w-6" />}
        />
        <MetricCard
          title="Sprint Goal Progress"
          value={85}
          format="percentage"
          change={5}
          trend="up"
          icon={<Target className="h-6 w-6" />}
        />
        <MetricCard
          title="Team Velocity"
          value={42}
          change={8}
          trend="up"
          format="number"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Sprint Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sprint Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sprint Goal
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                Implement user authentication and authorization system
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Duration
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                Feb 26 - Mar 11 (14 days)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Stories
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                12 total, 8 completed, 3 in progress, 1 blocked
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Story Points
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                44 committed, 38 completed
              </dd>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sprint Progress
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  8/12 stories
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Story Points
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  38/44 points
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VelocityChart data={velocityData} />
        <BurndownChart data={burndownData} />
      </div>
    </div>
  )
}
