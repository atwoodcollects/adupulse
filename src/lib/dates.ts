export function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getReviewAge(isoDate: string): number {
  const reviewed = new Date(isoDate + 'T00:00:00');
  const now = new Date();
  const diffMs = now.getTime() - reviewed.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isStale(isoDate: string, thresholdDays = 180): boolean {
  return getReviewAge(isoDate) > thresholdDays;
}
