export const sortHabitsArray = (arr = []) => {
  console.log("before sorting", arr);
  
	arr.sort((a, b) => {
		if (a.hour === b.hour) {
			return a.minute - b.minute;
		}
		return a.hour - b.hour;
	});
  
  console.log("after sorting", arr);
	return arr;
};
