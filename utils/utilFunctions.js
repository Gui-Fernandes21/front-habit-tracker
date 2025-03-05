export const sortHabitsArray = (arr = []) => {
  // Map each status to a numeric value so we can sort them easily.
  // Lower values come first in the sort order.
  const statusOrder = {
    TODO: 0,
    SKIP: 1,
    DONE: 2
  };

  arr.sort((a, b) => {
    // 1. Sort by status first
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    // 2. If status is the same, sort by hour
    if (a.hour !== b.hour) {
      return a.hour - b.hour;
    }

    // 3. If hour is the same, sort by minute
    return a.minute - b.minute;
  });

  return arr;
};