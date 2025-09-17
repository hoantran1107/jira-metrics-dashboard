import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { JIRA_CONFIG } from '@/config/jira'
import { useCalculatedMetrics, useProjectDashboardData } from '@/hooks/useJiraData'
import { calculateLeadTime } from '@/utils/metrics'
import { Bug, CheckCircle, ShieldAlert, TrendingDown } from 'lucide-react'

export default function QualityInsights() {
  // Use real data from custom hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useProjectDashboardData(JIRA_CONFIG.defaultProjectKey)
  const { data: metrics, isLoading: metricsLoading } = useCalculatedMetrics(JIRA_CONFIG.defaultProjectKey)

  const isLoading = dashboardLoading || metricsLoading

  // Calculate quality metrics
  const bugMetrics = dashboardData?.bugMetrics
  const bugRate = metrics?.bugRate || 0
  const defectRate = metrics?.defectRate || 0
  
  // Calculate bug resolution time (average cycle time for bugs)
  const bugResolutionTime = bugMetrics?.resolved.length > 0 ? 
    Math.round(calculateLeadTime(bugMetrics.resolved)) : 0

  // Calculate first time fix rate (bugs that weren't reopened)
  const firstTimeFixRate = bugMetrics && bugMetrics.resolved.length > 0 ? 
    Math.round(((bugMetrics.resolved.length - bugMetrics.reopened.length) / bugMetrics.resolved.length) * 100) : 0
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quality Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor code quality, bug rates, and defect trends
        </p>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Bug Rate"
          value={Math.round(bugRate * 100) / 100}
          change={bugRate < 5 ? -15 : bugRate > 10 ? 15 : 0}
          trend={bugRate < 5 ? "down" : bugRate > 10 ? "up" : "stable"}
          format="percentage"
          icon={<Bug className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Defect Density"
          value={Math.round(defectRate * 100) / 100}
          change={defectRate < 2 ? -8 : defectRate > 5 ? 8 : 0}
          trend={defectRate < 2 ? "down" : defectRate > 5 ? "up" : "stable"}
          format="percentage"
          icon={<ShieldAlert className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Resolution Time"
          value={bugResolutionTime}
          change={bugResolutionTime < 5 ? -12 : bugResolutionTime > 10 ? 12 : 0}
          trend={bugResolutionTime < 5 ? "down" : bugResolutionTime > 10 ? "up" : "stable"}
          format="number"
          icon={<TrendingDown className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="First Time Fix"
          value={firstTimeFixRate}
          change={firstTimeFixRate > 80 ? 5 : firstTimeFixRate < 60 ? -5 : 0}
          trend={firstTimeFixRate > 80 ? "up" : firstTimeFixRate < 60 ? "down" : "stable"}
          format="percentage"
          icon={<CheckCircle className="h-6 w-6" />}
          loading={isLoading}
        />
      </div>

      {/* Quality Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bug Trends
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Bugs</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {bugMetrics?.created.length || 0}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-red-500 h-1 rounded-full" style={{ 
                      width: `${Math.min(100, ((bugMetrics?.created.length || 0) / Math.max(1, (bugMetrics?.created.length || 0) + (bugMetrics?.resolved.length || 0))) * 100)}%` 
                    }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fixed Bugs</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {bugMetrics?.resolved.length || 0}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ 
                      width: `${Math.min(100, ((bugMetrics?.resolved.length || 0) / Math.max(1, (bugMetrics?.created.length || 0) + (bugMetrics?.resolved.length || 0))) * 100)}%` 
                    }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reopened</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {bugMetrics?.reopened.length || 0}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-yellow-500 h-1 rounded-full" style={{ 
                      width: `${Math.min(100, ((bugMetrics?.reopened.length || 0) / Math.max(1, bugMetrics?.resolved.length || 1)) * 100)}%` 
                    }}></div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Net Change</span>
                  <span className={`text-sm font-medium ${
                    (bugMetrics?.resolved.length || 0) - (bugMetrics?.created.length || 0) > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(bugMetrics?.resolved.length || 0) - (bugMetrics?.created.length || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Issue Priority Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">5</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Issues
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Login fails with OAuth
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    PROJ-145 • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Dashboard slow loading
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    PROJ-142 • 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    CSS alignment issue
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    PROJ-140 • 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Component Health
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Frontend</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">85%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Backend API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">72%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">92%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Authentication</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-red-500 h-1 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resolution Stats
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Resolution Time
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    4.8 days
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  ↓ 12% from last month
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    First Time Fix Rate
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    87%
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  ↑ 5% from last month
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Reopen Rate
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    8%
                  </span>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  ↑ 2% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
