import { API_ENDPOINTS, JIRA_CONFIG, RATE_LIMIT } from "@/config/jira";
import {
  ApiError,
  JiraIssue,
  JiraProject,
  JiraSearchResponse,
  JiraSprint,
  JiraUser,
} from "@/types";
import axios, { AxiosInstance, AxiosResponse } from "axios";
class JiraAPI {
  private client: AxiosInstance;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor() {
    const basic = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString("base64");
    this.client = axios.create({
      baseURL: JIRA_CONFIG.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + basic,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use((config) => {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Success: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          `❌ API Error: ${error.config?.url}`,
          error.response?.data
        );

        if (error.response?.status === 429) {
          // Rate limited - add to queue
          return this.addToQueue(() => this.client.request(error.config));
        }

        throw this.transformError(error);
      }
    );
  }

  private transformError(error: any): ApiError {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    const statusCode = error.response?.status || 500;

    return {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  private async addToQueue<T>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await request();
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          await this.delay(RATE_LIMIT.retryDelay);
        } catch (error) {
          console.error("Queue processing error:", error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Public API methods
  async searchIssues(
    jql: string,
    fields: string[] = ["*all"],
    startAt: number = 0,
    maxResults: number = 100
  ): Promise<JiraSearchResponse> {
    const response = await this.client.get<JiraSearchResponse>(
      API_ENDPOINTS.search,
      {
        params: {
          jql,
          fields: fields.join(","),
          startAt,
          maxResults,
          expand: "changelog",
        },
      }
    );
    return response.data;
  }

  async getIssue(
    issueKey: string,
    fields: string[] = ["*all"]
  ): Promise<JiraIssue> {
    const response = await this.client.get<JiraIssue>(
      `${API_ENDPOINTS.issue}/${issueKey}`,
      {
        params: {
          fields: fields.join(","),
          expand: "changelog",
        },
      }
    );
    return response.data;
  }

  async getProjects(): Promise<JiraProject[]> {
    const response = await this.client.get<JiraProject[]>(
      API_ENDPOINTS.project
    );
    return response.data;
  }

  async getProject(projectKey: string): Promise<JiraProject> {
    const response = await this.client.get<JiraProject>(
      `${API_ENDPOINTS.project}/${projectKey}`
    );
    return response.data;
  }

  async getUser(accountId: string): Promise<JiraUser> {
    const response = await this.client.get<JiraUser>(API_ENDPOINTS.user, {
      params: { accountId },
    });
    return response.data;
  }

  async getCurrentUser(): Promise<JiraUser> {
    const response = await this.client.get<JiraUser>(API_ENDPOINTS.myself);
    return response.data;
  }

  async getSprints(boardId: number): Promise<JiraSprint[]> {
    const response = await this.client.get<{ values: JiraSprint[] }>(
      `${API_ENDPOINTS.board}/${boardId}/sprint`
    );
    return response.data.values;
  }

  async getActiveSprints(boardId: number): Promise<JiraSprint[]> {
    const response = await this.client.get<{ values: JiraSprint[] }>(
      `${API_ENDPOINTS.board}/${boardId}/sprint`,
      {
        params: { state: "active" },
      }
    );
    return response.data.values;
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    const response = await this.client.get<{ issues: JiraIssue[] }>(
      `${API_ENDPOINTS.sprint}/${sprintId}/issue`
    );
    return response.data.issues;
  }

  async getFields(): Promise<any[]> {
    const response = await this.client.get<any[]>(API_ENDPOINTS.field);
    return response.data;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  // Enhanced methods for real data collection
  async getBoards(projectKeyOrId?: string): Promise<any[]> {
    const params: any = {};
    if (projectKeyOrId) {
      params.projectKeyOrId = projectKeyOrId;
    }

    const response = await this.client.get<{ values: any[] }>(
      API_ENDPOINTS.board,
      { params }
    );
    return response.data.values;
  }

  async getBoardSprints(
    boardId: number,
    state?: "active" | "closed" | "future"
  ): Promise<JiraSprint[]> {
    const params: any = {};
    if (state) {
      params.state = state;
    }

    const response = await this.client.get<{ values: JiraSprint[] }>(
      `${API_ENDPOINTS.board}/${boardId}/sprint`,
      { params }
    );
    return response.data.values;
  }

  async getSprintData(sprintId: number): Promise<JiraSprint> {
    const response = await this.client.get<JiraSprint>(
      `${API_ENDPOINTS.sprint}/${sprintId}`
    );
    return response.data;
  }

  async getRecentCompletedIssues(
    projectKey: string,
    days: number = 30
  ): Promise<JiraIssue[]> {
    const jql = `project = "${projectKey}" AND status CHANGED TO ("Done", "Closed", "Resolved") DURING (-${days}d, now()) ORDER BY resolved DESC`;
    const result = await this.searchIssues(jql, ["*all"], 0, 100);
    return result.issues;
  }

  async getBugMetrics(
    projectKey: string,
    days: number = 30
  ): Promise<{
    created: JiraIssue[];
    resolved: JiraIssue[];
    reopened: JiraIssue[];
  }> {
    const [created, resolved, reopened] = await Promise.all([
      this.searchIssues(
        `project = "${projectKey}" AND issuetype = Bug AND created >= -${days}d ORDER BY created DESC`,
        ["*all"],
        0,
        100
      ),
      this.searchIssues(
        `project = "${projectKey}" AND issuetype = Bug AND resolved >= -${days}d ORDER BY resolved DESC`,
        ["*all"],
        0,
        100
      ),
      this.searchIssues(
        `project = "${projectKey}" AND issuetype = Bug AND status CHANGED FROM ("Done", "Closed", "Resolved") DURING (-${days}d, now()) ORDER BY updated DESC`,
        ["*all"],
        0,
        100
      ),
    ]);

    return {
      created: created.issues,
      resolved: resolved.issues,
      reopened: reopened.issues,
    };
  }

  async getActiveContributors(
    projectKey: string,
    days: number = 30
  ): Promise<JiraUser[]> {
    const result = await this.searchIssues(
      `project = "${projectKey}" AND updated >= -${days}d`,
      ["assignee", "reporter"],
      0,
      1000
    );

    const contributorIds = new Set<string>();
    result.issues.forEach((issue) => {
      if (issue.fields.assignee?.accountId) {
        contributorIds.add(issue.fields.assignee.accountId);
      }
      if (issue.fields.reporter?.accountId) {
        contributorIds.add(issue.fields.reporter.accountId);
      }
    });

    const contributors = await Promise.all(
      Array.from(contributorIds).map((accountId) =>
        this.getUser(accountId).catch(() => null)
      )
    );

    return contributors.filter((user) => user !== null) as JiraUser[];
  }

  async getProjectDashboardData(projectKey: string, days: number = 30) {
    const [allIssues, completedIssues, bugMetrics, contributors] =
      await Promise.all([
        this.searchIssues(
          `project = "${projectKey}" AND updated >= -${days}d ORDER BY updated DESC`
        ),
        this.getRecentCompletedIssues(projectKey, days),
        this.getBugMetrics(projectKey, days),
        this.getActiveContributors(projectKey, days),
      ]);

    return {
      allIssues: allIssues.issues,
      completedIssues,
      bugMetrics,
      contributors,
      totalCount: allIssues.total,
    };
  }
}

// Export singleton instance
export const jiraAPI = new JiraAPI();

// Export helper functions
export const createJQL = {
  projectIssues: (projectKey: string, status?: string) => {
    let jql = `project = "${projectKey}"`;
    if (status) {
      jql += ` AND status = "${status}"`;
    }
    return jql + " ORDER BY updated DESC";
  },

  dateRange: (
    projectKey: string,
    startDate: string,
    endDate: string,
    field = "updated"
  ) =>
    `project = "${projectKey}" AND ${field} >= "${startDate}" AND ${field} <= "${endDate}" ORDER BY ${field} DESC`,

  assignee: (projectKey: string, assigneeId: string) =>
    `project = "${projectKey}" AND assignee = "${assigneeId}" ORDER BY updated DESC`,

  issueType: (projectKey: string, issueType: string) =>
    `project = "${projectKey}" AND issuetype = "${issueType}" ORDER BY created DESC`,
};
