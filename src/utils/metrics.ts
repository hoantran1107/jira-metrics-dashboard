import {
  BurndownData,
  CycleTimeData,
  JiraIssue,
  ThroughputData,
  VelocityData,
} from "@/types";
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";

export const calculateVelocity = (issues: JiraIssue[]): VelocityData[] => {
  const sprintGroups = new Map<
    string,
    { planned: number; completed: number; date: string }
  >();

  issues.forEach((issue) => {
    const sprint = issue.fields.customfield_10020?.[0];
    if (!sprint) return;

    const sprintKey = sprint.name;
    const storyPoints = issue.fields.storyPoints || 0;
    const isCompleted = ["Done", "Closed", "Resolved"].includes(
      issue.fields.status.name
    );

    if (!sprintGroups.has(sprintKey)) {
      sprintGroups.set(sprintKey, {
        planned: 0,
        completed: 0,
        date: sprint.startDate || new Date().toISOString(),
      });
    }

    const group = sprintGroups.get(sprintKey)!;
    group.planned += storyPoints;

    if (isCompleted) {
      group.completed += storyPoints;
    }
  });

  return Array.from(sprintGroups.entries()).map(([sprint, data]) => ({
    sprint,
    ...data,
  }));
};

export const calculateBurndown = (
  sprintIssues: JiraIssue[],
  sprintEndDate: string
): BurndownData[] => {
  const endDate = parseISO(sprintEndDate);
  const startDate = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Assume 2-week sprint

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const totalStoryPoints = sprintIssues.reduce(
    (sum, issue) => sum + (issue.fields.storyPoints || 0),
    0
  );

  return days.map((day, index) => {
    const completedByDay = sprintIssues
      .filter((issue) => {
        const resolutionDate = issue.fields.resolutiondate;
        return resolutionDate && parseISO(resolutionDate) <= day;
      })
      .reduce((sum, issue) => sum + (issue.fields.storyPoints || 0), 0);

    const remaining = totalStoryPoints - completedByDay;
    const ideal =
      totalStoryPoints - (totalStoryPoints * index) / (days.length - 1);

    return {
      date: format(day, "MMM dd"),
      remaining,
      ideal: Math.max(0, ideal),
    };
  });
};

export const calculateCycleTime = (issues: JiraIssue[]): CycleTimeData[] => {
  return issues
    .filter((issue) => issue.fields.resolutiondate)
    .map((issue) => {
      const startDate = parseISO(issue.fields.created);
      const endDate = parseISO(issue.fields.resolutiondate!);
      const cycleTime = differenceInDays(endDate, startDate);

      return {
        issue: issue.key,
        cycleTime,
        startDate: issue.fields.created,
        endDate: issue.fields.resolutiondate!,
        issueType: issue.fields.issuetype.name,
      };
    })
    .sort((a, b) => b.cycleTime - a.cycleTime);
};

export const calculateThroughput = (
  issues: JiraIssue[],
  periodDays: number = 7
): ThroughputData[] => {
  const completedIssues = issues.filter((issue) => issue.fields.resolutiondate);
  const periods = new Map<string, Map<string, number>>();

  completedIssues.forEach((issue) => {
    const resolutionDate = parseISO(issue.fields.resolutiondate!);
    const periodStart = new Date(resolutionDate);
    periodStart.setDate(
      periodStart.getDate() - (periodStart.getDate() % periodDays)
    );

    const periodKey = format(periodStart, "MMM dd, yyyy");
    const issueType = issue.fields.issuetype.name;

    if (!periods.has(periodKey)) {
      periods.set(periodKey, new Map());
    }

    const periodData = periods.get(periodKey)!;
    periodData.set(issueType, (periodData.get(issueType) || 0) + 1);
  });

  const result: ThroughputData[] = [];
  periods.forEach((typeMap, period) => {
    typeMap.forEach((completed, type) => {
      result.push({ period, completed, type });
    });
  });

  return result.sort(
    (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
  );
};

export const calculateDefectRate = (issues: JiraIssue[]): number => {
  const totalIssues = issues.length;
  const bugs = issues.filter(
    (issue) => issue.fields.issuetype.name.toLowerCase() === "bug"
  ).length;

  return totalIssues > 0 ? (bugs / totalIssues) * 100 : 0;
};

export const calculateLeadTime = (issues: JiraIssue[]): number => {
  const completedIssues = issues.filter((issue) => issue.fields.resolutiondate);

  if (completedIssues.length === 0) return 0;

  const totalLeadTime = completedIssues.reduce((sum, issue) => {
    const createdDate = parseISO(issue.fields.created);
    const resolvedDate = parseISO(issue.fields.resolutiondate!);
    return sum + differenceInDays(resolvedDate, createdDate);
  }, 0);

  return Math.round(totalLeadTime / completedIssues.length);
};

export const calculateTeamVelocity = (sprintData: VelocityData[]): number => {
  if (sprintData.length === 0) return 0;

  const recentSprints = sprintData.slice(-3); // Last 3 sprints
  const totalCompleted = recentSprints.reduce(
    (sum, sprint) => sum + sprint.completed,
    0
  );

  return Math.round(totalCompleted / recentSprints.length);
};

export const predictSprintCompletion = (
  burndownData: BurndownData[]
): {
  onTrack: boolean;
  projectedCompletion: number;
  daysRemaining: number;
} => {
  if (burndownData.length < 2) {
    return { onTrack: true, projectedCompletion: 100, daysRemaining: 0 };
  }

  const current = burndownData[burndownData.length - 1];
  const previous = burndownData[burndownData.length - 2];
  const ideal = current.ideal;

  const burnRate = previous.remaining - current.remaining;
  const projectedCompletion =
    burnRate > 0
      ? ((burndownData[0].remaining - current.remaining) /
          burndownData[0].remaining) *
        100
      : 0;

  const daysRemaining =
    burnRate > 0 ? Math.ceil(current.remaining / burnRate) : Infinity;
  const onTrack = current.remaining <= ideal;

  return {
    onTrack,
    projectedCompletion: Math.min(100, Math.max(0, projectedCompletion)),
    daysRemaining: isFinite(daysRemaining) ? daysRemaining : 0,
  };
};
