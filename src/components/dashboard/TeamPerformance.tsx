import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { Clock, Target, TrendingUp, Users } from 'lucide-react'

export default function TeamPerformance() {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25b5d7b?w=32&h=32&fit=crop&crop=face',
      role: 'Frontend Developer',
      completedIssues: 12,
      avgCycleTime: 3.2,
      velocity: 28,
      efficiency: 85,
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      role: 'Backend Developer',
      completedIssues: 15,
      avgCycleTime: 4.1,
      velocity: 32,
      efficiency: 92,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      role: 'Full Stack Developer',
      completedIssues: 18,
      avgCycleTime: 2.8,
      velocity: 35,
      efficiency: 88,
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      role: 'QA Engineer',
      completedIssues: 22,
      avgCycleTime: 1.5,
      velocity: 25,
      efficiency: 78,
    },
  ]

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
          value={8}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Team Velocity"
          value={158}
          change={12}
          trend="up"
          format="number"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <MetricCard
          title="Sprint Completion"
          value={94}
          change={3}
          trend="up"
          format="percentage"
          icon={<Target className="h-6 w-6" />}
        />
        <MetricCard
          title="Avg Cycle Time"
          value={2.9}
          change={-8}
          trend="down"
          format="number"
          icon={<Clock className="h-6 w-6" />}
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
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {member.completedIssues}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {member.avgCycleTime} days
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {member.velocity}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${member.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {member.efficiency}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
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
