import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => {
  const instance: any = {
    defaults: { baseURL: "", headers: {} },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    request: vi.fn(),
  };
  const create = vi.fn((config?: any) => {
    if (config?.baseURL) instance.defaults.baseURL = config.baseURL;
    if (config?.headers) instance.defaults.headers = config.headers;
    return instance;
  });
  const mockAxios: any = Object.assign(instance, { create });
  return { default: mockAxios };
});

import { jiraAPI } from "@/api/jira";
import { API_ENDPOINTS, JIRA_CONFIG } from "@/config/jira";
import axios from "axios";

describe("JiraAPI configuration", () => {
  it("creates axios client with baseURL and Basic auth", async () => {
    // Access jiraAPI singleton to trigger constructor
    expect(jiraAPI).toBeDefined();

    // Verify defaults on mocked axios instance
    const mocked = axios as unknown as any;
    expect(mocked.defaults.baseURL).toBe(JIRA_CONFIG.baseUrl);
    expect(mocked.defaults.headers).toEqual(
      expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: expect.stringMatching(/^Basic\s.+/),
      })
    );
  });
});

describe("JiraAPI endpoints", () => {
  beforeEach(() => {
    const mocked = axios as unknown as any;
    mocked.get.mockReset();
  });

  it("calls search with correct path and params", async () => {
    const mocked = axios as unknown as any;
    mocked.get.mockResolvedValueOnce({ data: { issues: [], total: 0 } });
    await jiraAPI.searchIssues("project=TEST", ["*all"], 5, 50);
    expect(mocked.get).toHaveBeenCalledWith(API_ENDPOINTS.search, {
      params: expect.objectContaining({
        jql: "project=TEST",
        fields: "*all",
        startAt: 5,
        maxResults: 50,
        expand: "changelog",
      }),
    });
  });

  it("calls getIssue with issue endpoint", async () => {
    const mocked = axios as unknown as any;
    mocked.get.mockResolvedValueOnce({ data: {} });
    await jiraAPI.getIssue("TEST-1");
    expect(mocked.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.issue}/TEST-1`,
      expect.objectContaining({
        params: expect.objectContaining({
          fields: "*all",
          expand: "changelog",
        }),
      })
    );
  });

  it("calls getCurrentUser with /myself", async () => {
    const mocked = axios as unknown as any;
    mocked.get.mockResolvedValueOnce({ data: {} });
    await jiraAPI.getCurrentUser();
    expect(mocked.get).toHaveBeenCalledWith(API_ENDPOINTS.myself);
  });

  it("calls boards with projectKeyOrId param", async () => {
    const mocked = axios as unknown as any;
    mocked.get.mockResolvedValueOnce({ data: { values: [] } });
    await jiraAPI.getBoards("GRIDSZDT");
    expect(mocked.get).toHaveBeenCalledWith(API_ENDPOINTS.board, {
      params: { projectKeyOrId: "GRIDSZDT" },
    });
  });
});
