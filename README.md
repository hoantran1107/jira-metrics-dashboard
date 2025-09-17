# Jira Metrics Dashboard

A comprehensive, modern web dashboard for visualizing and analyzing Jira project metrics. Built with React, TypeScript, and modern web technologies to provide actionable insights into your development team's performance.

![Dashboard Preview](./docs/dashboard-preview.png)

## 🚀 Features

### Core Metrics
- **Sprint Velocity Tracking** - Monitor team velocity across sprints
- **Burndown Charts** - Real-time sprint and release burndown visualization
- **Cycle Time Analysis** - Track issue lifecycle from creation to completion
- **Lead Time Metrics** - Measure customer request fulfillment time
- **Throughput Analytics** - Issues completed over time periods
- **Work Distribution** - Breakdown by issue types, priorities, and assignees

### Advanced Analytics
- **Predictive Analytics** - Sprint completion forecasting
- **Performance Trends** - Historical team performance analysis
- **Bottleneck Identification** - Workflow stage analysis
- **Team Productivity Insights** - Individual and team metrics
- **Quality Metrics** - Bug rates, reopened issues, resolution time

### User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Customizable theme preferences
- **Real-time Updates** - Live data synchronization with Jira
- **Interactive Charts** - Drill-down capabilities and filtering
- **Export Functionality** - PDF and image export for reports
- **Customizable Dashboards** - Drag-and-drop widget arrangement

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Jira Cloud account with API access
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Jira-Metrics-Dashboard.git
cd Jira-Metrics-Dashboard
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Jira Configuration
VITE_JIRA_BASE_URL=https://your-domain.atlassian.net
VITE_JIRA_API_VERSION=3
VITE_JIRA_EMAIL=your-email@company.com
VITE_JIRA_API_TOKEN=your-api-token

# Application Configuration
VITE_APP_TITLE=Jira Metrics Dashboard
VITE_REFRESH_INTERVAL=300000
VITE_DEFAULT_PROJECT_KEY=YOUR-PROJECT

# Optional: Database Configuration (for caching)
VITE_ENABLE_CACHING=true
VITE_CACHE_DURATION=3600
```

### 4. Jira API Token Setup
1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create a new API token
3. Copy the token to your `.env` file

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to view the dashboard.

## 📊 Dashboard Sections

### 1. Overview Dashboard
- Current sprint status
- Key performance indicators
- Recent activity summary
- Quick navigation to detailed views

### 2. Sprint Metrics
- **Velocity Chart**: Historical velocity with trend analysis
- **Burndown Chart**: Real-time sprint progress tracking
- **Sprint Goals**: Progress toward sprint objectives
- **Scope Changes**: Mid-sprint additions/removals

### 3. Flow Metrics
- **Cycle Time Distribution**: Time from start to completion
- **Lead Time Trends**: Customer request to delivery time
- **Throughput Analysis**: Completed work over time
- **Work in Progress**: Current WIP limits and utilization

### 4. Quality Insights
- **Bug Trends**: Creation vs resolution rates
- **Defect Density**: Bugs per feature/story points
- **Resolution Time**: Average time to fix issues
- **Reopened Issues**: Quality indicators

### 5. Team Performance
- **Individual Metrics**: Personal productivity insights
- **Workload Distribution**: Balanced task assignment
- **Skill Matrix**: Expertise areas and development needs
- **Collaboration Patterns**: Cross-team interaction analysis

## 🔧 Configuration

### Project Selection
Configure which Jira projects to monitor in `src/config/projects.ts`:
```typescript
export const MONITORED_PROJECTS = [
  {
    key: 'PROJ1',
    name: 'Project Alpha',
    color: '#0052CC'
  },
  {
    key: 'PROJ2', 
    name: 'Project Beta',
    color: '#36B37E'
  }
];
```

### Custom Metrics
Add custom metrics in `src/config/metrics.ts`:
```typescript
export const CUSTOM_METRICS = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    jql: 'labels = customer-feedback AND resolution = Done',
    calculation: 'average',
    field: 'customfield_10001'
  }
];
```

### Dashboard Layout
Customize the dashboard layout in `src/config/dashboard.ts`:
```typescript
export const DEFAULT_LAYOUT = [
  { i: 'velocity', x: 0, y: 0, w: 6, h: 4 },
  { i: 'burndown', x: 6, y: 0, w: 6, h: 4 },
  { i: 'cycle-time', x: 0, y: 4, w: 12, h: 3 }
];
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t jira-metrics-dashboard .

# Run the container
docker run -p 3000:3000 --env-file .env jira-metrics-dashboard
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify Deployment
```bash
# Build the application
npm run build

# Deploy to Netlify (drag and drop the dist folder)
```

## 📈 Usage Guide

### Getting Started
1. **Configure Projects**: Set up project monitoring in settings
2. **Verify Connectivity**: Test Jira API connection
3. **Customize Dashboard**: Arrange widgets according to your needs
4. **Set Alerts**: Configure notifications for important metrics
5. **Schedule Reports**: Set up automated report generation

### Best Practices
- **Regular Reviews**: Schedule weekly team metric reviews
- **Goal Setting**: Use historical data to set realistic sprint goals
- **Continuous Improvement**: Use insights to identify and address bottlenecks
- **Team Communication**: Share metrics transparently with the team
- **Data-Driven Decisions**: Base process changes on concrete metrics

### Troubleshooting
- **API Rate Limits**: Implement caching and reduce refresh frequency
- **Large Datasets**: Use pagination and filtering for better performance
- **Authentication Issues**: Verify API tokens and permissions
- **Slow Loading**: Enable caching and optimize queries

## 🛡️ Security

### Data Protection
- API tokens stored securely in environment variables
- No sensitive data persisted in browser storage
- HTTPS enforcement for all API communications
- Regular security updates and dependency scanning

### Access Control
- Jira permissions respected and enforced
- Project-level access control
- Audit logging for sensitive operations
- Session management and timeout handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 API Documentation

### Jira API Integration
The dashboard uses the Jira REST API v3. Key endpoints:
- `/rest/api/3/search` - Issue searching and filtering
- `/rest/api/3/project` - Project information
- `/rest/api/3/field` - Custom field definitions
- `/rest/agile/1.0/sprint` - Sprint data (requires Jira Software)

### Custom API Extensions
For advanced features, the dashboard supports custom API extensions:
```typescript
// src/api/custom/metrics.ts
export const getCustomMetric = async (projectKey: string, metricId: string) => {
  // Custom metric calculation logic
};
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **Charts**: Recharts, D3.js
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Vitest, Testing Library, Playwright
- **Build**: Vite, TypeScript, ESLint, Prettier

## 🔗 Useful Links

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Agile Metrics Guide](https://www.atlassian.com/agile/project-management/metrics)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Atlassian for the comprehensive Jira API
- React and TypeScript communities for excellent documentation
- Open source contributors who made this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/Jira-Metrics-Dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/Jira-Metrics-Dashboard/discussions)
- **Email**: support@yourcompany.com

---

**Made with ❤️ by Hoan Khai Tran**