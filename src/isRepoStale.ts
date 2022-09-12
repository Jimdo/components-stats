export const isStale = (pushedAt: string, daysUntilStale: number): boolean => {
  if (pushedAt === null) {
    return false;
  }

  const pushedAtDate = new Date(pushedAt);
  const todayDate = new Date();

  const diffTime = todayDate.getTime() - pushedAtDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isStale = diffDays > daysUntilStale;
  return isStale;
};
