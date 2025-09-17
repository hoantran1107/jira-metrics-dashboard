import {
  endOfDay,
  format,
  formatDistanceToNow,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

export const formatDate = (
  date: string | Date,
  formatStr: string = "MMM dd, yyyy"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const getDateRange = (days: number) => {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(new Date(), days));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
};

export const getWorkingDaysBetween = (
  startDate: Date,
  endDate: Date
): number => {
  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (isWorkingDay(currentDate)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};
