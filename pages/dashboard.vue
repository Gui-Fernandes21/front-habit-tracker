<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
	layout: "app",
	middleware: "auth",
});

const loading = useState("loading");
const habits = ref([]);
const userName = ref("");
const loadError = ref("");

// "Today" is the visitor's local date. The server renders in its own time zone, so the
// browser corrects both values once it takes over (unless the user already picked a day).
const todayKey = ref(localDayKey());
const selectedDate = useState("selectedDate", () => todayKey.value);
const followsToday = useState("selectedDateFollowsToday", () => true);

onMounted(() => {
	todayKey.value = localDayKey();
	if (followsToday.value) selectedDate.value = todayKey.value;
});
const filter = ref("ALL");

// ===============================================================================
// ==============================DATA=============================================
// ===============================================================================
// All habits are loaded once; days, the week row and streaks are worked out here.
const fetchHabits = async () => {
	loading.value = true;
	try {
		const { data, error } = await useService("/fetch-habits");
		if (error.value) throw error.value;
		habits.value = data.value?.habits || [];
		loadError.value = "";
	} catch (err) {
		console.error("An error occurred while fetching habits:", err);
		loadError.value = "We couldn't load your habits. Refresh to try again.";
	} finally {
		loading.value = false;
	}
};

const fetchUser = async () => {
	const { data } = await useService("/user-profile");
	userName.value = data.value?.user?.name || "";
};

await Promise.all([fetchHabits(), fetchUser()]);

// ===============================================================================
// ==============================DAY + WEEK=======================================
// ===============================================================================
const habitsByDay = computed(() => {
	const days = {};
	habits.value.forEach((habit) => {
		const key = habitDayKey(habit.startDate);
		if (!days[key]) days[key] = [];
		days[key].push(habit);
	});
	return days;
});

const dayHabits = computed(() => sortHabitsArray([...(habitsByDay.value[selectedDate.value] || [])]));

const counts = computed(() => {
	const c = { ALL: dayHabits.value.length, TODO: 0, DONE: 0, SKIP: 0 };
	dayHabits.value.forEach((habit) => c[habit.status]++);
	return c;
});

const visibleHabits = computed(() =>
	filter.value === "ALL" ? dayHabits.value : dayHabits.value.filter((h) => h.status === filter.value)
);

const progress = computed(() =>
	counts.value.ALL ? Math.round((counts.value.DONE / counts.value.ALL) * 100) : 0
);

const week = computed(() =>
	weekKeys(selectedDate.value).map((key) => {
		const list = habitsByDay.value[key] || [];
		const done = list.filter((h) => h.status === "DONE").length;
		let state = "empty";
		if (list.length && done === list.length) state = "full";
		else if (done > 0) state = "part";
		else if (list.length) state = "planned";
		return {
			key,
			weekday: formatDayKey(key, { weekday: "short" }),
			day: Number(key.slice(8)),
			state,
			label: `${formatDayKey(key, { weekday: "long", day: "numeric", month: "long" })}: ${
				list.length ? `${done} of ${list.length} done` : "no habits"
			}`,
		};
	})
);

const title = computed(() => formatDayKey(selectedDate.value, { weekday: "long", day: "numeric", month: "long" }));
const isToday = computed(() => selectedDate.value === todayKey.value);

const selectDay = (key) => {
	selectedDate.value = key;
	followsToday.value = key === todayKey.value;
};
const shiftWeek = (weeks) => selectDay(shiftDayKey(selectedDate.value, weeks * 7));

// ===============================================================================
// ==============================STREAKS==========================================
// ===============================================================================
// Consecutive days, ending on the selected day, on which a habit with this name was done.
// If it isn't done yet on the selected day, the streak runs up to the day before.
const doneByName = computed(() => {
	const map = {};
	habits.value.forEach((habit) => {
		if (habit.status !== "DONE") return;
		if (!map[habit.name]) map[habit.name] = new Set();
		map[habit.name].add(habitDayKey(habit.startDate));
	});
	return map;
});

const streakFor = (habit) => {
	const days = doneByName.value[habit.name];
	if (!days) return 0;
	let key = days.has(selectedDate.value) ? selectedDate.value : shiftDayKey(selectedDate.value, -1);
	let streak = 0;
	while (days.has(key)) {
		streak++;
		key = shiftDayKey(key, -1);
	}
	return streak;
};

// ===============================================================================
// ==============================ACTIONS==========================================
// ===============================================================================
const panelOpen = ref(false);
const editing = ref(null);

const openAdd = () => {
	editing.value = null;
	panelOpen.value = true;
};

const openEdit = (habit) => {
	editing.value = habit;
	panelOpen.value = true;
};

const closePanel = () => {
	panelOpen.value = false;
	editing.value = null;
};

const replaceHabit = (updated) => {
	habits.value = habits.value.map((item) => (item._id === updated._id ? updated : item));
};

const updateHabit = async (habit) => {
	loading.value = true;
	try {
		const { data, error } = await useService("/update-habit/" + habit._id, {
			method: "PATCH",
			body: habit,
		});
		if (error.value) throw error.value;
		replaceHabit(data.value?.habit || habit);
	} catch (err) {
		console.error("An error occurred while updating habit:", err);
		alert("We couldn't save that change. Please try again.");
	} finally {
		loading.value = false;
	}
};

const addHabit = async (habit) => {
	loading.value = true;
	try {
		const { error } = await useService("/add-habit", { method: "POST", body: habit });
		if (error.value) throw error.value;
		selectDay(habit.startDate);
		closePanel();
		await fetchHabits();
	} catch (err) {
		console.error("An error occurred while adding habit:", err);
		alert("We couldn't add that habit. Please try again.");
	} finally {
		loading.value = false;
	}
};

const saveFromPanel = async (habit) => {
	if (habit._id) {
		await updateHabit(habit);
		closePanel();
	} else {
		await addHabit(habit);
	}
};

const deleteHabit = async (habit) => {
	if (!confirm(`Delete "${habit.name}"?`)) return;
	loading.value = true;
	try {
		const { error } = await useService("/delete-habit/" + habit._id, { method: "DELETE" });
		if (error.value) throw error.value;
		habits.value = habits.value.filter((item) => item._id !== habit._id);
		closePanel();
	} catch (err) {
		console.error("An error occurred while deleting habit:", err);
		alert("We couldn't delete that habit. Please try again.");
	} finally {
		loading.value = false;
	}
};

const filters = [
	{ value: "ALL", label: "All" },
	{ value: "TODO", label: "To do" },
	{ value: "DONE", label: "Done" },
	{ value: "SKIP", label: "Skipped" },
];
</script>

<template>
	<section class="today">
		<header class="page-head">
			<div class="heading">
				<span class="welcome">Welcome back{{ userName ? `, ${userName}` : "" }}</span>
				<div class="title-line">
					<h1>{{ title }}</h1>
					<span v-if="isToday" class="today-tag">Today</span>
					<button v-else type="button" class="link-btn" @click="selectDay(todayKey)">Back to today</button>
				</div>
			</div>
			<div class="date-nav">
				<button type="button" class="icon-btn" aria-label="Previous week" @click="shiftWeek(-1)">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
				</button>
				<label class="icon-btn date-btn">
					<span class="visually-hidden">Pick a date</span>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<rect x="3" y="5" width="18" height="16" rx="2" />
						<path d="M3 10h18M8 3v4M16 3v4" />
					</svg>
					<input :value="selectedDate" type="date" class="date-input" @change="$event.target.value && selectDay($event.target.value)" />
				</label>
				<button type="button" class="icon-btn" aria-label="Next week" @click="shiftWeek(1)">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
				</button>
			</div>
		</header>

		<div class="week-bar">
			<div class="week" role="group" aria-label="Choose a day">
				<button
					v-for="day in week"
					:key="day.key"
					type="button"
					:class="['day', { selected: day.key === selectedDate, 'is-today': day.key === todayKey }]"
					:aria-label="day.label"
					:aria-pressed="day.key === selectedDate"
					@click="selectDay(day.key)"
				>
					<span class="weekday">{{ day.weekday }}</span>
					<span class="day-number">{{ day.day }}</span>
					<span :class="['dot', day.state]"></span>
				</button>
			</div>
			<div class="progress">
				<div class="progress-text">
					<span class="strong">{{ counts.DONE }} of {{ counts.ALL }} done</span>
					<span class="muted">{{ progress }}%</span>
				</div>
				<div class="bar" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
					<div class="bar-fill" :style="{ width: progress + '%' }"></div>
				</div>
			</div>
		</div>

		<div class="toolbar">
			<div class="tabs" role="group" aria-label="Filter habits">
				<button
					v-for="f in filters"
					:key="f.value"
					type="button"
					:class="['tab', { active: filter === f.value }]"
					:aria-pressed="filter === f.value"
					@click="filter = f.value"
				>
					{{ f.label }} <span class="count">{{ counts[f.value] }}</span>
				</button>
			</div>
			<button type="button" class="btn add-btn" @click="openAdd">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
				Add habit
			</button>
		</div>

		<p v-if="loadError" class="form-error" role="alert">{{ loadError }}</p>

		<ul v-if="visibleHabits.length" class="list">
			<HabitRow
				v-for="habit in visibleHabits"
				:key="habit._id"
				:habit="habit"
				:streak="streakFor(habit)"
				@set-status="updateHabit"
				@edit="openEdit"
				@delete="deleteHabit"
			/>
		</ul>
		<div v-else-if="!loadError" class="empty">
			<p v-if="counts.ALL">Nothing here with this filter.</p>
			<template v-else>
				<p>No habits planned for this day.</p>
				<button type="button" class="btn btn-outline" @click="openAdd">Add a habit</button>
			</template>
		</div>

		<button type="button" class="fab" aria-label="Add habit" @click="openAdd">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
		</button>

		<HabitPanel
			:open="panelOpen"
			:habit="editing"
			:default-date="selectedDate"
			@close="closePanel"
			@save="saveFromPanel"
			@delete="deleteHabit"
		/>
	</section>
</template>

<style scoped>
.today {
	max-width: 64rem;
	padding: 2rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
}

.page-head {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 1rem;
}

.heading {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.welcome {
	font-size: 0.9rem;
	color: var(--muted);
}

.title-line {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
}

h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.9rem;
	font-weight: 600;
}

.today-tag {
	padding: 0.15rem 0.6rem;
	border: 1px solid var(--primary);
	border-radius: 999px;
	background: #f3f5ef;
	color: var(--primary-dark);
	font-size: 0.75rem;
	font-weight: 600;
}

.link-btn {
	padding: 0.25rem 0;
	border: 0;
	background: transparent;
	color: var(--primary-dark);
	font: 600 0.85rem "Open Sans", sans-serif;
	text-decoration: underline;
	cursor: pointer;
}

.date-nav {
	display: flex;
	gap: 0.5rem;
}

.icon-btn {
	position: relative;
	width: 44px;
	height: 44px;
	display: grid;
	place-items: center;
	padding: 0;
	border: 2px solid var(--dark-light-1);
	border-radius: 5px;
	background: #fff;
	cursor: pointer;
}

.icon-btn:hover {
	border-color: var(--primary);
}

.icon-btn svg {
	width: 18px;
	height: 18px;
	fill: none;
	stroke: var(--dark);
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.date-btn:focus-within {
	outline: 2px solid var(--primary-dark);
	outline-offset: 2px;
}

/* The native date input sits invisibly over the calendar icon so clicking it opens the picker */
.date-input {
	position: absolute;
	inset: 0;
	opacity: 0;
	cursor: pointer;
}

.date-input::-webkit-calendar-picker-indicator {
	position: absolute;
	inset: 0;
	width: auto;
	height: auto;
	cursor: pointer;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

/* Week row + progress */
.week-bar {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.5rem;
	border: 2px solid var(--light);
	border-radius: 12px;
}

.week {
	flex: 1;
	display: flex;
	justify-content: space-between;
	gap: 0.25rem;
}

.day {
	width: 4rem;
	padding: 0.6rem 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
	border: 2px solid transparent;
	border-radius: 8px;
	background: transparent;
	font-family: "Open Sans", sans-serif;
	cursor: pointer;
}

.day:hover {
	background: var(--light);
}

.day.selected {
	border-color: var(--primary-dark);
	background: #f3f5ef;
}

.day:focus-visible,
.tab:focus-visible,
.fab:focus-visible {
	outline: 2px solid var(--primary-dark);
	outline-offset: 2px;
}

.weekday {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--muted);
}

.is-today .weekday {
	color: var(--primary-dark);
}

.day-number {
	font: 600 1.1rem "Montserrat", sans-serif;
	color: var(--dark);
}

.dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	box-sizing: border-box;
}

.dot.full {
	background: var(--primary-dark);
}

.dot.part {
	background: var(--primary);
}

.dot.planned {
	border: 1.5px solid var(--dark-light);
}

.progress {
	width: 15rem;
	padding: 0 0.75rem 0 1rem;
	border-left: 1px solid var(--dark-light-1);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.progress-text {
	display: flex;
	justify-content: space-between;
	font-size: 0.85rem;
}

.strong {
	font-weight: 600;
}

.muted {
	color: var(--muted);
}

.bar {
	height: 8px;
	border-radius: 4px;
	background: #eeeeee;
	overflow: hidden;
}

.bar-fill {
	height: 100%;
	background: var(--primary-dark);
	transition: width 0.3s ease-in-out;
}

/* Filter tabs + add */
.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.tabs {
	display: flex;
	gap: 0.25rem;
	padding: 0.25rem;
	border-radius: 8px;
	background: var(--light);
}

.tab {
	min-height: 36px;
	padding: 0 0.9rem;
	border: 0;
	border-radius: 5px;
	background: transparent;
	font: 600 0.85rem "Open Sans", sans-serif;
	color: var(--dark);
	cursor: pointer;
}

.tab.active {
	background: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.count {
	color: var(--muted);
	font-weight: 400;
}

.add-btn svg,
.fab svg {
	width: 16px;
	height: 16px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2.5;
	stroke-linecap: round;
}

.add-btn {
	padding: 0 1.25rem;
}

.list {
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.empty {
	padding: 3rem 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	border: 2px dashed var(--dark-light-1);
	border-radius: 12px;
	color: var(--muted);
	text-align: center;
}

.empty p {
	margin: 0;
}

.fab {
	display: none;
}

@media (max-width: 1024px) {
	.week-bar {
		flex-direction: column;
		align-items: stretch;
	}

	.progress {
		width: auto;
		padding: 0.5rem 0.5rem 0.25rem;
		border-left: 0;
		border-top: 1px solid var(--dark-light-1);
	}
}

@media (max-width: 768px) {
	.today {
		padding: 1rem 1.25rem 6rem;
		gap: 1rem;
	}

	h1 {
		font-size: 1.35rem;
	}

	.date-nav .icon-btn:not(.date-btn) {
		display: none;
	}

	.week-bar {
		padding: 0;
		border: 0;
		gap: 0.75rem;
	}

	.day {
		width: auto;
		flex: 1;
		padding: 0.45rem 0;
	}

	.day-number {
		font-size: 1rem;
	}

	.progress {
		padding: 0;
		border-top: 0;
	}

	.toolbar {
		overflow-x: auto;
	}

	.tabs {
		gap: 0.4rem;
		padding: 0;
		background: transparent;
	}

	.tab {
		flex-shrink: 0;
		border: 2px solid var(--dark-light-1);
		border-radius: 999px;
		background: #fff;
		white-space: nowrap;
	}

	.tab.active {
		border-color: var(--primary-dark);
		background: var(--primary-dark);
		color: #fff;
		box-shadow: none;
	}

	.tab.active .count {
		color: #fff;
	}

	.add-btn {
		display: none;
	}

	.fab {
		position: fixed;
		right: 1.25rem;
		bottom: calc(var(--tabbar-height) + 1rem);
		z-index: 90;
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--primary-dark);
		color: #fff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
		cursor: pointer;
	}

	.fab svg {
		width: 22px;
		height: 22px;
	}
}
</style>
