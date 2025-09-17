import { jiraAPI } from '@/api/jira'
import { BurndownChart } from '@/components/charts/BurndownChart'
import { CycleTimeChart } from '@/components/charts/CycleTimeChart'
import { ThroughputChart } from '@/components/charts/ThroughputChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { MetricCard } from '@/components/ui/MetricCard'
import { JIRA_CONFIG } from '@/config/jira'
import { calculateCycleTime, calculateVelocity } from '@/utils/metrics'
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react'
import { useQuery } from 'react-query'

export default function Dashboard() {
  // Mock data for demonstration - in real app, this would come from Jira API
  const { data: issues, isLoading } = useQuery(
    'dashboard-issues',
    () => jiraAPI.searchIssues(`project = "${JIRA_CONFIG.defaultProjectKey}" AND updated >= -30d`),
    {
      enabled: !!JIRA_CONFIG.defaultProjectKey,
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    }
  )

  const velocityData = issues ? calculateVelocity(issues.issues) : []
  const cycleTimeData = issues ? calculateCycleTime(issues.issues) : []
  
  // Mock burndown data - in real app, this would be calculated from sprint data
  const burndownData = [
    { date: 'Day 1', remaining: 40, ideal: 40 },
    { date: 'Day 2', remaining: 38, ideal: 37 },
    { date: 'Day 3', remaining: 35, ideal: 34 },
    { date: 'Day 4', remaining: 32, ideal: 31 },
    { date: 'Day 5', remaining: 28, ideal: 28 },
    { date: 'Day 6', remaining: 25, ideal: 25 },
    { date: 'Day 7', remaining: 22, ideal: 22 },
    { date: 'Day 8', remaining: 18, ideal: 19 },
    { date: 'Day 9', remaining: 15, ideal: 16 },
    { date: 'Day 10', remaining: 12, ideal: 13 },
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
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Key metrics and insights for your Jira projects
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Issues"
          value={issues?.total || 0}
          change={12}
          trend="up"
          icon={<BarChart3 className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Velocity"
          value={32}
          change={5}
          trend="up"
          format="number"
          icon={<TrendingUp className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Cycle Time"
          value={4.2}
          change={-8}
          trend="down"
          format="number"
          icon={<Clock className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Active Contributors"
          value={8}
          change={0}
          trend="stable"
          icon={<Users className="h-6 w-6" />}
          loading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VelocityChart data={velocityData} loading={isLoading} />
        <BurndownChart data={burndownData} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CycleTimeChart data={cycleTimeData} loading={isLoading} />
        <ThroughputChart data={throughputData} loading={isLoading} />
      </div>
    </div>
  )
}
