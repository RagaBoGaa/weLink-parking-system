export const formatVacationDate = (
  dateString: string,
  format: 'short' | 'long' = 'short'
) => {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' };

  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const getDurationDays = (from: string, to: string): number => {
  const start = new Date(from);
  const end = new Date(to);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const isUpcoming = (fromDate: string): boolean => {
  return new Date(fromDate) > new Date();
};

export const isActive = (fromDate: string, toDate: string): boolean => {
  const now = new Date();
  return new Date(fromDate) <= now && now <= new Date(toDate);
};

export const getDaysRemaining = (fromDate: string): number => {
  const now = new Date();
  const start = new Date(fromDate);
  const diffTime = start.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysElapsed = (fromDate: string, toDate: string): number => {
  const now = new Date();
  const start = new Date(fromDate);
  const end = new Date(toDate);

  if (now <= start) return 0;
  if (now >= end) return getDurationDays(fromDate, toDate);

  const diffTime = now.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getProgressPercentage = (
  fromDate: string,
  toDate: string
): number => {
  const total = getDurationDays(fromDate, toDate);
  const elapsed = getDaysElapsed(fromDate, toDate);
  return Math.min((elapsed / total) * 100, 100);
};

export type VacationStatus = 'active' | 'upcoming' | 'past';

export const getVacationStatus = (
  fromDate: string,
  toDate: string
): VacationStatus => {
  if (isActive(fromDate, toDate)) return 'active';
  if (isUpcoming(fromDate)) return 'upcoming';
  return 'past';
};
