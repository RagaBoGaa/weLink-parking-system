export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatDuration = (hours: number) => {
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}h ${mins}m`;
};
