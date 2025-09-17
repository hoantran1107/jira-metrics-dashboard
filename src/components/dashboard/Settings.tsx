import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useThemeStore } from '@/store/theme'
import { AlertCircle, CheckCircle, Save, TestTube } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore()
  const [jiraConfig, setJiraConfig] = useState({
    baseUrl: '',
    email: '',
    apiToken: '',
    defaultProject: '',
  })
  
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error'
    message: string
  }>({ status: 'idle', message: '' })

  const handleSave = () => {
    // In a real app, this would save to backend/local storage
    console.log('Saving configuration:', jiraConfig)
  }

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing connection...' })
    
    // Simulate API test
    setTimeout(() => {
      if (jiraConfig.baseUrl && jiraConfig.email && jiraConfig.apiToken) {
        setTestResult({ 
          status: 'success', 
          message: 'Connection successful! API access verified.' 
        })
      } else {
        setTestResult({ 
          status: 'error', 
          message: 'Please fill in all required fields.' 
        })
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your Jira connection and dashboard preferences
        </p>
      </div>

      {/* Jira Configuration */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Jira Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set up your Jira instance connection details
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jira Base URL
            </label>
            <input
              type="url"
              placeholder="https://your-domain.atlassian.net"
              className="input w-full"
              value={jiraConfig.baseUrl}
              onChange={(e) => setJiraConfig({ ...jiraConfig, baseUrl: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your-email@company.com"
              className="input w-full"
              value={jiraConfig.email}
              onChange={(e) => setJiraConfig({ ...jiraConfig, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Token
            </label>
            <input
              type="password"
              placeholder="Your Jira API token"
              className="input w-full"
              value={jiraConfig.apiToken}
              onChange={(e) => setJiraConfig({ ...jiraConfig, apiToken: e.target.value })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Generate an API token from your{' '}
              <a 
                href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Atlassian Account Settings
              </a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Project Key
            </label>
            <input
              type="text"
              placeholder="PROJ"
              className="input w-full"
              value={jiraConfig.defaultProject}
              onChange={(e) => setJiraConfig({ ...jiraConfig, defaultProject: e.target.value })}
            />
          </div>

          {/* Test Connection Result */}
          {testResult.status !== 'idle' && (
            <div className={`p-3 rounded-md flex items-center space-x-2 ${
              testResult.status === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : testResult.status === 'error'
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-blue-50 dark:bg-blue-900/20'
            }`}>
              {testResult.status === 'testing' && (
                <div className="loading-spinner w-4 h-4" />
              )}
              {testResult.status === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              {testResult.status === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-sm ${
                testResult.status === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : testResult.status === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {testResult.message}
              </span>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={handleTestConnection} variant="outline" loading={testResult.status === 'testing'}>
              <TestTube className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Display Settings
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose your preferred display theme
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="sm">
              {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Refresh Interval
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                How often to refresh dashboard data
              </p>
            </div>
            <select className="input w-32">
              <option value="60000">1 minute</option>
              <option value="300000" selected>5 minutes</option>
              <option value="600000">10 minutes</option>
              <option value="1800000">30 minutes</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Project Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Settings
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monitored Projects
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="proj1" defaultChecked className="rounded" />
                <label htmlFor="proj1" className="text-sm text-gray-700 dark:text-gray-300">
                  DEMO - Demo Project
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="proj2" defaultChecked className="rounded" />
                <label htmlFor="proj2" className="text-sm text-gray-700 dark:text-gray-300">
                  TEST - Test Project
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="proj3" className="rounded" />
                <label htmlFor="proj3" className="text-sm text-gray-700 dark:text-gray-300">
                  DEV - Development
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range for Metrics
            </label>
            <select className="input w-full">
              <option value="7">Last 7 days</option>
              <option value="30" selected>Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
