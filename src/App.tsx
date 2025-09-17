import Dashboard from '@/components/dashboard/Dashboard'
import FlowMetrics from '@/components/dashboard/FlowMetrics'
import QualityInsights from '@/components/dashboard/QualityInsights'
import Settings from '@/components/dashboard/Settings'
import SprintMetrics from '@/components/dashboard/SprintMetrics'
import TeamPerformance from '@/components/dashboard/TeamPerformance'
import Layout from '@/components/ui/Layout'
import { useThemeStore } from '@/store/theme'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sprint" element={<SprintMetrics />} />
        <Route path="/flow" element={<FlowMetrics />} />
        <Route path="/quality" element={<QualityInsights />} />
        <Route path="/team" element={<TeamPerformance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
