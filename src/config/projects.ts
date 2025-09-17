import { MetricConfig, ProjectConfig } from "@/types";

export const MONITORED_PROJECTS: ProjectConfig[] = [
  {
    key: "DEMO",
    name: "Demo Project",
    color: "#0052CC",
    enabled: true,
  },
  {
    key: "TEST",
    name: "Test Project",
    color: "#36B37E",
    enabled: true,
  },
  {
    key: "DEV",
    name: "Development",
    color: "#FF5630",
    enabled: false,
  },
];

export const CUSTOM_METRICS: MetricConfig[] = [
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "Average customer satisfaction score from feedback",
    jql: "labels = customer-feedback AND resolution = Done",
    calculation: "average",
    field: "customfield_10001",
    enabled: true,
  },
  {
    id: "technical-debt",
    name: "Technical Debt",
    description: "Number of technical debt issues",
    jql: "labels = technical-debt AND status != Done",
    calculation: "count",
    enabled: true,
  },
  {
    id: "security-issues",
    name: "Security Issues",
    description: "Number of open security-related issues",
    jql: "labels = security AND status != Done",
    calculation: "count",
    enabled: true,
  },
  {
    id: "performance-issues",
    name: "Performance Issues",
    description: "Number of performance-related issues",
    jql: "labels = performance AND status != Done",
    calculation: "count",
    enabled: false,
  },
];

export const ISSUE_TYPE_COLORS: Record<string, string> = {
  Story: "#0052CC",
  Bug: "#FF5630",
  Task: "#36B37E",
  Epic: "#6554C0",
  "Sub-task": "#FFAB00",
  Improvement: "#00B8D9",
};

export const STATUS_CATEGORIES: Record<string, string> = {
  "To Do": "#42526E",
  "In Progress": "#0052CC",
  Done: "#36B37E",
};
