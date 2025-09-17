import { jiraAPI } from "@/api/jira";
import { JIRA_CONFIG } from "@/config/jira";
import {
  calculateBurndown,
  calculateCycleTime,
  calculateDefectRate,
  calculateLeadTime,
  calculateThroughput,
  calculateVelocity,
} from "@/utils/metrics";
import { useQuery } from "react-query";

export const useProjectDashboardData = (
  projectKey?: string,
  days: number = 30
) => {
  return useQuery(
    ["dashboard-data", projectKey, days],
    () =>
      jiraAPI.getProjectDashboardData(
        projectKey || JIRA_CONFIG.defaultProjectKey,
        days
      ),
    {
      enabled: !!projectKey || !!JIRA_CONFIG.defaultProjectKey,
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    }
  );
};

export const useSprintData = (projectKey?: string) => {
  const boardsQuery = useQuery(
    ["boards", projectKey],
    () => jiraAPI.getBoards(projectKey || JIRA_CONFIG.defaultProjectKey),
    {
      enabled: !!projectKey || !!JIRA_CONFIG.defaultProjectKey,
      staleTime: 10 * 60 * 1000, // Boards don't change often
    }
  );

  const sprintsQuery = useQuery(
    ["sprints", boardsQuery.data?.[0]?.id],
    () =>
      boardsQuery.data?.[0]
        ? jiraAPI.getBoardSprints(boardsQuery.data[0].id, "closed")
        : [],
    {
      enabled: !!boardsQuery.data?.[0]?.id,
      staleTime: 5 * 60 * 1000,
    }
  );

  const activeSprintsQuery = useQuery(
    ["active-sprints", boardsQuery.data?.[0]?.id],
    () =>
      boardsQuery.data?.[0]
        ? jiraAPI.getBoardSprints(boardsQuery.data[0].id, "active")
        : [],
    {
      enabled: !!boardsQuery.data?.[0]?.id,
      refetchInterval: 2 * 60 * 1000, // More frequent for active sprints
    }
  );

  return {
    boards: boardsQuery.data || [],
    sprints: sprintsQuery.data || [],
    activeSprints: activeSprintsQuery.data || [],
    isLoading:
      boardsQuery.isLoading ||
      sprintsQuery.isLoading ||
      activeSprintsQuery.isLoading,
    error: boardsQuery.error || sprintsQuery.error || activeSprintsQuery.error,
  };
};

export const useSprintIssues = (sprintId?: number) => {
  return useQuery(
    ["sprint-issues", sprintId],
    () => (sprintId ? jiraAPI.getSprintIssues(sprintId) : []),
    {
      enabled: !!sprintId,
      staleTime: 3 * 60 * 1000,
    }
  );
};

export const useCalculatedMetrics = (
  projectKey?: string,
  days: number = 30
) => {
  const dashboardData = useProjectDashboardData(projectKey, days);
  const sprintData = useSprintData(projectKey);

  const calculatedData = useQuery(
    ["calculated-metrics", dashboardData.data, sprintData.sprints],
    () => {
      if (!dashboardData.data) return null;

      const { allIssues, completedIssues, bugMetrics, contributors } =
        dashboardData.data;

      // Calculate velocity data from sprint issues
      const velocityData = calculateVelocity(allIssues);

      // Calculate cycle time data
      const cycleTimeData = calculateCycleTime(completedIssues);

      // Calculate throughput data
      const throughputData = calculateThroughput(completedIssues, 7); // Weekly throughput

      // Calculate average cycle time
      const avgCycleTime = calculateLeadTime(completedIssues);

      // Calculate defect rate
      const defectRate = calculateDefectRate(allIssues);

      // Calculate average velocity from recent sprints
      const avgVelocity =
        velocityData.length > 0
          ? Math.round(
              velocityData.slice(-3).reduce((sum, v) => sum + v.completed, 0) /
                Math.min(3, velocityData.length)
            )
          : 0;

      // Calculate quality metrics
      const bugRate =
        bugMetrics.created.length > 0
          ? (bugMetrics.created.length /
              (bugMetrics.created.length + bugMetrics.resolved.length)) *
            100
          : 0;

      return {
        velocityData,
        cycleTimeData,
        throughputData,
        avgCycleTime,
        avgVelocity,
        defectRate,
        bugRate,
        activeContributors: contributors.length,
        totalIssues: dashboardData.data.totalCount,
        completedThisPeriod: completedIssues.length,
        bugsCreated: bugMetrics.created.length,
        bugsResolved: bugMetrics.resolved.length,
        bugsReopened: bugMetrics.reopened.length,
      };
    },
    {
      enabled: !!dashboardData.data,
    }
  );

  return {
    data: calculatedData.data,
    isLoading: dashboardData.isLoading || calculatedData.isLoading,
    error: dashboardData.error || calculatedData.error,
  };
};

export const useBurndownData = (sprintId?: number) => {
  const sprintIssues = useSprintIssues(sprintId);
  const sprintDetails = useQuery(
    ["sprint-details", sprintId],
    () => (sprintId ? jiraAPI.getSprintData(sprintId) : null),
    {
      enabled: !!sprintId,
      staleTime: 5 * 60 * 1000,
    }
  );

  const burndownData = useQuery(
    ["burndown-data", sprintIssues.data, sprintDetails.data],
    () => {
      if (!sprintIssues.data || !sprintDetails.data?.endDate) return [];

      return calculateBurndown(sprintIssues.data, sprintDetails.data.endDate);
    },
    {
      enabled: !!sprintIssues.data && !!sprintDetails.data?.endDate,
    }
  );

  return {
    data: burndownData.data || [],
    sprint: sprintDetails.data,
    sprintIssues: sprintIssues.data || [],
    isLoading:
      sprintIssues.isLoading ||
      sprintDetails.isLoading ||
      burndownData.isLoading,
    error: sprintIssues.error || sprintDetails.error || burndownData.error,
  };
};

export const useTeamMetrics = (projectKey?: string, days: number = 30) => {
  const dashboardData = useProjectDashboardData(projectKey, days);

  const teamMetrics = useQuery(
    ["team-metrics", dashboardData.data],
    () => {
      if (!dashboardData.data) return null;

      const { allIssues, contributors } = dashboardData.data;

      // Group issues by assignee
      const assigneeMetrics = new Map();

      allIssues.forEach((issue) => {
        const assignee = issue.fields.assignee;
        if (!assignee) return;

        const key = assignee.accountId;
        if (!assigneeMetrics.has(key)) {
          assigneeMetrics.set(key, {
            user: assignee,
            totalIssues: 0,
            completedIssues: 0,
            avgCycleTime: 0,
            storyPoints: 0,
          });
        }

        const metrics = assigneeMetrics.get(key);
        metrics.totalIssues++;

        if (["Done", "Closed", "Resolved"].includes(issue.fields.status.name)) {
          metrics.completedIssues++;
        }

        if (issue.fields.storyPoints) {
          metrics.storyPoints += issue.fields.storyPoints;
        }
      });

      // Calculate cycle times
      const completedIssues = allIssues.filter(
        (issue) => issue.fields.resolutiondate
      );
      completedIssues.forEach((issue) => {
        const assignee = issue.fields.assignee;
        if (!assignee || !assigneeMetrics.has(assignee.accountId)) return;

        const metrics = assigneeMetrics.get(assignee.accountId);
        const cycleTime = calculateCycleTime([issue]);
        if (cycleTime.length > 0) {
          metrics.avgCycleTime =
            (metrics.avgCycleTime + cycleTime[0].cycleTime) / 2;
        }
      });

      return {
        teamMembers: Array.from(assigneeMetrics.values()),
        totalContributors: contributors.length,
      };
    },
    {
      enabled: !!dashboardData.data,
    }
  );

  return {
    data: teamMetrics.data,
    isLoading: dashboardData.isLoading || teamMetrics.isLoading,
    error: dashboardData.error || teamMetrics.error,
  };
};
