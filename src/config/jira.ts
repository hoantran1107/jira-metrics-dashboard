export const JIRA_CONFIG = {
  baseUrl: import.meta.env.VITE_JIRA_BASE_URL || "",
  apiVersion: import.meta.env.VITE_JIRA_API_VERSION || "3",
  email: import.meta.env.VITE_JIRA_EMAIL || "",
  apiToken: import.meta.env.VITE_JIRA_API_TOKEN || "",
  defaultProjectKey: import.meta.env.VITE_DEFAULT_PROJECT_KEY || "",
} as const;

export const API_ENDPOINTS = {
  search: "/rest/api/3/search",
  project: "/rest/api/3/project",
  user: "/rest/api/3/user",
  field: "/rest/api/3/field",
  sprint: "/rest/agile/1.0/sprint",
  board: "/rest/agile/1.0/board",
} as const;

export const JQL_QUERIES = {
  recentIssues: (projectKey: string, days: number = 30) =>
    `project = "${projectKey}" AND updated >= -${days}d ORDER BY updated DESC`,

  sprintIssues: (projectKey: string, sprintId: number) =>
    `project = "${projectKey}" AND sprint = ${sprintId}`,

  completedIssues: (projectKey: string, startDate: string, endDate: string) =>
    `project = "${projectKey}" AND status CHANGED TO ("Done", "Closed", "Resolved") DURING ("${startDate}", "${endDate}")`,

  bugsCreated: (projectKey: string, startDate: string, endDate: string) =>
    `project = "${projectKey}" AND issuetype = Bug AND created >= "${startDate}" AND created <= "${endDate}"`,

  bugsResolved: (projectKey: string, startDate: string, endDate: string) =>
    `project = "${projectKey}" AND issuetype = Bug AND resolved >= "${startDate}" AND resolved <= "${endDate}"`,

  activeSprintIssues: (projectKey: string) =>
    `project = "${projectKey}" AND sprint in openSprints()`,

  issuesByAssignee: (
    projectKey: string,
    assigneeId: string,
    days: number = 30
  ) =>
    `project = "${projectKey}" AND assignee = "${assigneeId}" AND updated >= -${days}d`,
} as const;

export const FIELD_MAPPINGS = {
  storyPoints: "customfield_10020",
  sprint: "customfield_10020",
  epicLink: "customfield_10014",
  flagged: "customfield_10021",
} as const;

// Rate limiting configuration
export const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  retryDelay: 1000,
} as const;
