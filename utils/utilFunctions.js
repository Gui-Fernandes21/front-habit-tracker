export const sortHabitsArray = (arr = []) => {
  const statusOrder = {
    TODO: 0,
    SKIP: 1,
    DONE: 2
  };

  arr.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    if (a.hour !== b.hour) {
      return a.hour - b.hour;
    }

    return a.minute - b.minute;
  });

  return arr;
};