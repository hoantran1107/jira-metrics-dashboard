import { BurndownChart } from '@/components/charts/BurndownChart'
import { CycleTimeChart } from '@/components/charts/CycleTimeChart'
import { ThroughputChart } from '@/components/charts/ThroughputChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { MetricCard } from '@/components/ui/MetricCard'
import { JIRA_CONFIG } from '@/config/jira'
import { useBurndownData, useCalculatedMetrics, useSprintData } from '@/hooks/useJiraData'
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react'

export default function Dashboard() {
  // Use real data from custom hooks
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useCalculatedMetrics(JIRA_CONFIG.defaultProjectKey)
  const { activeSprints, isLoading: sprintLoading } = useSprintData(JIRA_CONFIG.defaultProjectKey)
  
  // Get burndown data from the first active sprint if available
  const activeSprintId = activeSprints.length > 0 ? activeSprints[0].id : undefined
  const { data: burndownData, isLoading: burndownLoading } = useBurndownData(activeSprintId)

  const isLoading = metricsLoading || sprintLoading || burndownLoading

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
          value={metrics?.totalIssues || 0}
          change={Math.round(((metrics?.completedThisPeriod || 0) / Math.max(1, metrics?.totalIssues || 1)) * 100)}
          trend="up"
          icon={<BarChart3 className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Velocity"
          value={metrics?.avgVelocity || 0}
          change={metrics && metrics.velocityData.length > 1 ? 
            Math.round(((metrics.velocityData[metrics.velocityData.length - 1]?.completed || 0) - 
                       (metrics.velocityData[metrics.velocityData.length - 2]?.completed || 0)) / 
                       Math.max(1, metrics.velocityData[metrics.velocityData.length - 2]?.completed || 1) * 100) : 0}
          trend={metrics && metrics.velocityData.length > 1 && 
                 metrics.velocityData[metrics.velocityData.length - 1]?.completed > 
                 metrics.velocityData[metrics.velocityData.length - 2]?.completed ? "up" : "stable"}
          format="number"
          icon={<TrendingUp className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Cycle Time"
          value={metrics?.avgCycleTime || 0}
          change={metrics?.avgCycleTime ? Math.round((metrics.avgCycleTime - 7) / 7 * 100) : 0}
          trend={metrics && metrics.avgCycleTime < 7 ? "down" : "stable"}
          format="number"
          icon={<Clock className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Active Contributors"
          value={metrics?.activeContributors || 0}
          change={0}
          trend="stable"
          icon={<Users className="h-6 w-6" />}
          loading={isLoading}
        />
      </div>

      {/* Error handling */}
      {metricsError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading metrics data
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>Failed to fetch data from Jira. Please check your configuration and connection.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VelocityChart 
          data={metrics?.velocityData || []} 
          loading={isLoading} 
        />
        <BurndownChart 
          data={burndownData || []} 
          loading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CycleTimeChart 
          data={metrics?.cycleTimeData || []} 
          loading={isLoading} 
        />
        <ThroughputChart 
          data={metrics?.throughputData || []} 
          loading={isLoading} 
        />
      </div>
    </div>
  )
}
