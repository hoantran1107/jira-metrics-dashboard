export const CHART_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
] as const;

export const STATUS_COLORS = {
  "To Do": "#6B7280",
  "In Progress": "#3B82F6",
  "In Review": "#F59E0B",
  Done: "#10B981",
  Blocked: "#EF4444",
  Cancelled: "#6B7280",
} as const;

export const PRIORITY_COLORS = {
  Highest: "#DC2626",
  High: "#EA580C",
  Medium: "#F59E0B",
  Low: "#10B981",
  Lowest: "#6B7280",
} as const;

export const ISSUE_TYPE_COLORS = {
  Story: "#3B82F6",
  Bug: "#EF4444",
  Task: "#10B981",
  Epic: "#8B5CF6",
  "Sub-task": "#F59E0B",
  Improvement: "#06B6D4",
} as const;

export const getColorByIndex = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

export const getStatusColor = (status: string): string => {
  return (
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS["To Do"]
  );
};

export const getPriorityColor = (priority: string): string => {
  return (
    PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ||
    PRIORITY_COLORS["Medium"]
  );
};

export const getIssueTypeColor = (issueType: string): string => {
  return (
    ISSUE_TYPE_COLORS[issueType as keyof typeof ISSUE_TYPE_COLORS] ||
    ISSUE_TYPE_COLORS["Task"]
  );
};

export const lightenColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const darkenColor = (color: string, amount: number): string => {
  return lightenColor(color, -amount);
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
