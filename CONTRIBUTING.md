# Contributing to Jira Metrics Dashboard

Thank you for your interest in contributing to the Jira Metrics Dashboard! This document provides guidelines and instructions for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- A Jira Cloud account for testing

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Jira-Metrics-Dashboard.git
   cd Jira-Metrics-Dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
5. Configure your Jira credentials in `.env`
6. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── api/              # Jira API integration
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── dashboard/   # Dashboard-specific components
│   └── charts/      # Chart components
├── config/          # Configuration files
├── hooks/           # Custom React hooks
├── store/           # State management (Zustand)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── styles/          # Global styles
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Guidelines
- Create functional components with TypeScript
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow the existing naming conventions

### Testing
- Write unit tests for utility functions
- Add integration tests for API functions
- Test components with React Testing Library
- Aim for good test coverage

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and version information
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide detailed use case
- Consider implementation complexity
- Discuss with maintainers before large changes

## 🔀 Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the guidelines

3. Test thoroughly:
   ```bash
   npm run test
   npm run type-check
   npm run lint
   ```

4. Commit with descriptive messages:
   ```bash
   git commit -m "feat: add velocity trend analysis"
   ```

5. Push to your fork and create a PR

6. Fill out the PR template completely

7. Address any review feedback

### PR Requirements
- [ ] Tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Changes are documented
- [ ] Breaking changes are noted

## 🏷️ Commit Convention

We use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

## 📊 Adding New Metrics

When adding new Jira metrics:

1. Define the metric interface in `src/types/index.ts`
2. Add calculation logic in `src/utils/metrics.ts`
3. Create a chart component in `src/components/charts/`
4. Add the metric to appropriate dashboard sections
5. Update configuration options if needed
6. Add tests for the calculation logic

### Example Metric Implementation

```typescript
// types/index.ts
export interface CustomMetricData {
  date: string
  value: number
  category: string
}

// utils/metrics.ts
export const calculateCustomMetric = (issues: JiraIssue[]): CustomMetricData[] => {
  // Implementation
}

// components/charts/CustomMetricChart.tsx
export function CustomMetricChart({ data }: { data: CustomMetricData[] }) {
  // Chart implementation
}
```

## 🎨 UI/UX Guidelines

- Follow the existing design system
- Ensure responsiveness across devices
- Support both light and dark themes
- Use semantic HTML for accessibility
- Test with screen readers when possible

## 🔒 Security Considerations

- Never commit API tokens or credentials
- Validate all user inputs
- Use HTTPS for all API communications
- Follow OWASP security guidelines
- Report security issues privately

## 📚 Documentation

- Update README for new features
- Add JSDoc comments for complex functions
- Include examples in documentation
- Keep API documentation current

## 🤝 Community

- Be respectful and inclusive
- Help other contributors
- Share knowledge and best practices
- Participate in discussions constructively

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Contact maintainers for complex issues

Thank you for contributing to make this project better! 🙏
