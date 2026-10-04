// Day keys are "YYYY-MM-DD" strings.
//
// Habits are saved with the start date picked in a date input, which the API stores
// as midnight UTC, so a habit's day is the UTC date of its startDate.
// "Today", on the other hand, must be the user's local date: using toISOString()
// for it flips to tomorrow in the evening for anyone west of UTC.

const pad = (n) => String(n).padStart(2, "0");

export const localDayKey = (date = new Date()) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const habitDayKey = (startDate) => new Date(startDate).toISOString().slice(0, 10);

export const keyToUTCDate = (key) => new Date(`${key}T00:00:00Z`);

export const shiftDayKey = (key, days) => {
	const date = keyToUTCDate(key);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
};

// The seven day keys (Monday first) of the week that contains `key`
export const weekKeys = (key) => {
	const mondayOffset = (keyToUTCDate(key).getUTCDay() + 6) % 7;
	const monday = shiftDayKey(key, -mondayOffset);
	return Array.from({ length: 7 }, (_, i) => shiftDayKey(monday, i));
};

export const formatDayKey = (key, options) =>
	keyToUTCDate(key).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
