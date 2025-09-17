import { BurndownChart } from '@/components/charts/BurndownChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { FIELD_MAPPINGS, JIRA_CONFIG } from '@/config/jira'
import { useBurndownData, useCalculatedMetrics, useSprintData } from '@/hooks/useJiraData'
import { format, parseISO } from 'date-fns'
import { Calendar, Target, TrendingUp } from 'lucide-react'

export default function SprintMetrics() {
  // Use real data from custom hooks
  const { data: metrics, isLoading: metricsLoading } = useCalculatedMetrics(JIRA_CONFIG.defaultProjectKey)
  const { activeSprints, sprints, isLoading: sprintLoading } = useSprintData(JIRA_CONFIG.defaultProjectKey)
  
  // Get current/most recent active sprint
  const currentSprint = activeSprints.length > 0 ? activeSprints[0] : null
  const { data: burndownData, sprint: sprintDetails, sprintIssues, isLoading: burndownLoading } = useBurndownData(currentSprint?.id)

  const isLoading = metricsLoading || sprintLoading || burndownLoading

  // Calculate sprint progress
  const calculateSprintProgress = () => {
    if (!sprintIssues.length) return { stories: '0/0', storyPoints: '0/0', storyProgress: 0, pointsProgress: 0 }
    
    const totalStories = sprintIssues.length
    const completedStories = sprintIssues.filter(issue => 
      ['Done', 'Closed', 'Resolved'].includes(issue.fields.status.name)
    ).length
    
    const totalPoints = sprintIssues.reduce((sum, issue) => 
      sum + (issue.fields[FIELD_MAPPINGS.storyPoints] || 0), 0
    )
    const completedPoints = sprintIssues
      .filter(issue => ['Done', 'Closed', 'Resolved'].includes(issue.fields.status.name))
      .reduce((sum, issue) => sum + (issue.fields[FIELD_MAPPINGS.storyPoints] || 0), 0)
    
    return {
      stories: `${completedStories}/${totalStories}`,
      storyPoints: `${completedPoints}/${totalPoints}`,
      storyProgress: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
      pointsProgress: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0
    }
  }

  const sprintProgress = calculateSprintProgress()

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
          value={currentSprint?.name || "No Active Sprint"}
          icon={<Calendar className="h-6 w-6" />}
          loading={isLoading}
        />
        <MetricCard
          title="Sprint Goal Progress"
          value={sprintProgress.pointsProgress}
          format="percentage"
          change={sprintProgress.pointsProgress - sprintProgress.storyProgress}
          trend={sprintProgress.pointsProgress > sprintProgress.storyProgress ? "up" : 
                 sprintProgress.pointsProgress < sprintProgress.storyProgress ? "down" : "stable"}
          icon={<Target className="h-6 w-6" />}
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
                {currentSprint?.goal || 'No goal specified'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Duration
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {currentSprint && currentSprint.startDate && currentSprint.endDate ? 
                  `${format(parseISO(currentSprint.startDate), 'MMM dd')} - ${format(parseISO(currentSprint.endDate), 'MMM dd, yyyy')}` : 
                  'Dates not specified'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Stories
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {sprintProgress.stories} stories
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Story Points
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {sprintProgress.storyPoints} points
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
                  {sprintProgress.stories} stories
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${sprintProgress.storyProgress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Story Points
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {sprintProgress.storyPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${sprintProgress.pointsProgress}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
    </div>
  )
}
