// Jira API Types
export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
        name: string;
      };
    };
    issuetype: {
      id: string;
      name: string;
      iconUrl: string;
    };
    priority: {
      id: string;
      name: string;
      iconUrl: string;
    };
    assignee?: {
      accountId: string;
      displayName: string;
      avatarUrls: {
        "24x24": string;
        "32x32": string;
        "48x48": string;
      };
    };
    reporter: {
      accountId: string;
      displayName: string;
      avatarUrls: {
        "24x24": string;
        "32x32": string;
        "48x48": string;
      };
    };
    created: string;
    updated: string;
    resolutiondate?: string;
    storyPoints?: number;
    labels: string[];
    components: Array<{
      id: string;
      name: string;
    }>;
    fixVersions: Array<{
      id: string;
      name: string;
    }>;
    customfield_10020?: Array<{
      id: number;
      name: string;
      state: string;
      startDate?: string;
      endDate?: string;
      completeDate?: string;
      goal?: string;
    }>;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    "24x24": string;
    "32x32": string;
    "48x48": string;
  };
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: "future" | "active" | "closed";
  startDate?: string;
  endDate?: string;
  completeDate?: string;
  goal?: string;
  originBoardId: number;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls: {
    "24x24": string;
    "32x32": string;
    "48x48": string;
  };
  active: boolean;
  timeZone: string;
}

// Dashboard Types
export interface DashboardMetric {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "stable";
  format?: "number" | "percentage" | "currency" | "duration";
}

export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
  [key: string]: unknown;
}

export interface VelocityData {
  sprint: string;
  planned: number;
  completed: number;
  date: string;
}

export interface BurndownData {
  date: string;
  remaining: number;
  ideal: number;
}

export interface CycleTimeData {
  issue: string;
  cycleTime: number;
  startDate: string;
  endDate: string;
  issueType: string;
}

export interface ThroughputData {
  period: string;
  completed: number;
  type: string;
}

// Configuration Types
export interface ProjectConfig {
  key: string;
  name: string;
  color: string;
  enabled: boolean;
}

export interface MetricConfig {
  id: string;
  name: string;
  description: string;
  jql: string;
  calculation: "sum" | "average" | "count" | "median";
  field?: string;
  enabled: boolean;
}

export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

// API Response Types
export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}

// Theme Types
export type Theme = "light" | "dark";

// Filter Types
export interface FilterOptions {
  projects: string[];
  assignees: string[];
  issueTypes: string[];
  statuses: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sprints: number[];
}

// Export additional utility types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  hasMore: boolean;
}
