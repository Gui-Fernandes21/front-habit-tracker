export const generateTimeArr = (range, step = 1) => {
	const arr = [];
	for (let i = 0; i <= range; i = i + step) {
		const str = i.toString().length === 1 ? `0${i}` : i;
		arr.push(str);
	}
	return arr;
};
