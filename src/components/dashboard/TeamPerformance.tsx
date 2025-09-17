import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { JIRA_CONFIG } from '@/config/jira'
import { useCalculatedMetrics, useTeamMetrics } from '@/hooks/useJiraData'
import { Clock, Target, TrendingUp, Users } from 'lucide-react'

export default function TeamPerformance() {
  // Use real data from custom hooks
  const { data: teamData, isLoading: teamLoading } = useTeamMetrics(JIRA_CONFIG.defaultProjectKey)
  const { data: metrics, isLoading: metricsLoading } = useCalculatedMetrics(JIRA_CONFIG.defaultProjectKey)
  
  const isLoading = teamLoading || metricsLoading
  const teamMembers = teamData?.teamMembers || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Individual and team productivity metrics and insights
        </p>
      </div>

      {/* Team Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Team Size"
          value={teamData?.totalContributors || 0}
          icon={<Users className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Team Velocity"
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
          title="Sprint Completion"
          value={metrics?.completedThisPeriod && metrics?.totalIssues ? 
            Math.round((metrics.completedThisPeriod / metrics.totalIssues) * 100) : 0}
          change={3}
          trend="up"
          format="percentage"
          icon={<Target className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Cycle Time"
          value={metrics?.avgCycleTime || 0}
          change={metrics?.avgCycleTime ? Math.round((7 - metrics.avgCycleTime) / 7 * 100) : 0}
          trend={metrics && metrics.avgCycleTime < 7 ? "down" : "stable"}
          format="number"
          icon={<Clock className="h-6 w-6" />}
          loading={isLoading}
        />
      </div>

      {/* Team Members Performance */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Individual Performance
          </h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Team Member
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Avg Cycle Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Velocity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.length > 0 ? teamMembers.map((member, index) => (
                  <tr key={member.user.accountId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.user.avatarUrls['32x32'] || member.user.avatarUrls['24x24']}
                          alt={member.user.displayName}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const initials = member.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
                            target.parentElement!.innerHTML = `<div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">${initials}</div>` + target.parentElement!.innerHTML.substring(target.outerHTML.length);
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.user.displayName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.user.emailAddress || 'Team Member'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {member.completedIssues}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {Math.round(member.avgCycleTime * 10) / 10} days
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {member.storyPoints}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, Math.round((member.completedIssues / Math.max(1, member.totalIssues)) * 100))}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.min(100, Math.round((member.completedIssues / Math.max(1, member.totalIssues)) * 100))}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                      {isLoading ? 'Loading team data...' : 'No team data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Workload Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Frontend</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">35 issues</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Backend</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">28 issues</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">QA</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">42 issues</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">DevOps</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">15 issues</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Collaboration Matrix
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Frontend ↔ Backend
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  High collaboration • 12 shared issues
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Dev ↔ QA
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Excellent handoff • 95% success rate
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  QA ↔ DevOps
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  Needs improvement • 3 blocked issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Capacity
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current Sprint
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    82%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>• 6.5/8 developers active</p>
                <p>• 1 on vacation, 0.5 on training</p>
                <p>• Capacity: 320/390 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
