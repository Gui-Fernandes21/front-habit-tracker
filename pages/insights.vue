<script setup>
import { ref, computed } from "vue";
import Calendar from "@/components/Calendar.vue";

definePageMeta({
	layout: "app",
	middleware: "auth",
});

const loading = useState("loading");
const habits = ref([]);

const fetchHabits = async () => {
	loading.value = true;
	try {
		const { data } = await useService("/fetch-habits");
		if (data.value) {
			habits.value = data.value.habits;
		} else {
			console.warn("No habits found.");
		}
	} catch (err) {
		console.error("An error occurred while fetching habits:", err);
	} finally {
		loading.value = false;
	}
};

// Fetch during setup (not onMounted) so the data is loaded on the server and on
// first page load; useFetch skips requests made while the page is still hydrating.
await fetchHabits();

// ===============================================================================
// ==============================DATES============================================
// ===============================================================================
// Same day key the dashboard uses, so both pages agree on which day a habit is on.
const dayKey = (date) => new Date(date).toISOString().slice(0, 10);
const todayKey = dayKey(new Date());

const shiftDay = (key, delta) => {
	const date = new Date(`${key}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + delta);
	return date.toISOString().slice(0, 10);
};

const now = new Date();
const viewYear = ref(now.getFullYear());
const viewMonth = ref(now.getMonth());
const monthPrefix = computed(
	() => `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, "0")}`
);

const changeMonth = (delta) => {
	const date = new Date(viewYear.value, viewMonth.value + delta, 1);
	viewYear.value = date.getFullYear();
	viewMonth.value = date.getMonth();
};

// ===============================================================================
// ==============================STATS============================================
// ===============================================================================
// { "2026-09-14": { TODO, DONE, SKIP } } for every day that has habits
const habitsByDay = computed(() => {
	const days = {};
	habits.value.forEach((habit) => {
		const key = dayKey(habit.startDate);
		if (!days[key]) days[key] = { TODO: 0, DONE: 0, SKIP: 0 };
		days[key][habit.status]++;
	});
	return days;
});

// Habits in the month on screen, up to today (future to-dos don't count against you)
const monthHabits = computed(() =>
	habits.value.filter((habit) => {
		const key = dayKey(habit.startDate);
		return key.startsWith(monthPrefix.value) && key <= todayKey;
	})
);

const monthCounts = computed(() => {
	const counts = { TODO: 0, DONE: 0, SKIP: 0 };
	monthHabits.value.forEach((habit) => counts[habit.status]++);
	return counts;
});

const completionRate = computed(() => {
	const total = monthHabits.value.length;
	return total ? Math.round((monthCounts.value.DONE / total) * 100) : 0;
});

// A day counts towards a streak when every habit on it is done.
const isCompleteDay = (key) => {
	const day = habitsByDay.value[key];
	return Boolean(day && day.DONE > 0 && day.TODO === 0 && day.SKIP === 0);
};

const longestStreak = computed(() => {
	const keys = Object.keys(habitsByDay.value)
		.filter((key) => key <= todayKey && isCompleteDay(key))
		.sort();
	let best = 0;
	let run = 0;
	keys.forEach((key, i) => {
		run = i > 0 && shiftDay(keys[i - 1], 1) === key ? run + 1 : 1;
		best = Math.max(best, run);
	});
	return best;
});

const currentStreak = computed(() => {
	// Today still in progress doesn't break the streak: start counting from yesterday.
	let key = isCompleteDay(todayKey) ? todayKey : shiftDay(todayKey, -1);
	let streak = 0;
	while (isCompleteDay(key)) {
		streak++;
		key = shiftDay(key, -1);
	}
	return streak;
});

const dayWord = (n) => (n === 1 ? "day" : "days");

// Completion per habit name for the month on screen, best first
const byHabit = computed(() => {
	const groups = {};
	monthHabits.value.forEach((habit) => {
		if (!groups[habit.name]) groups[habit.name] = { name: habit.name, done: 0, total: 0 };
		groups[habit.name].total++;
		if (habit.status === "DONE") groups[habit.name].done++;
	});
	return Object.values(groups)
		.map((group) => ({ ...group, rate: Math.round((group.done / group.total) * 100) }))
		.sort((a, b) => b.rate - a.rate)
		.slice(0, 6);
});

// ===============================================================================
// ==============================SHARE============================================
// ===============================================================================
const shareOpen = ref(false);
const shareText = computed(
	() => `I've completed ${completionRate.value}% of my habits this month on HTK!`
);
const shareUrl = useRequestURL().origin;

const socialLinks = computed(() => {
	const text = encodeURIComponent(shareText.value);
	const url = encodeURIComponent(shareUrl);
	return [
		{ name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
		{ name: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
		{ name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
		{ name: "WhatsApp", href: `https://api.whatsapp.com/send?text=${text}%20${url}` },
	];
});
</script>

<template>
	<section class="insights">
		<header class="page-head">
			<h1>Insights</h1>
			<div class="share">
				<button
					type="button"
					class="share-btn"
					:aria-expanded="shareOpen"
					aria-controls="share-menu"
					@click="shareOpen = !shareOpen"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="18" cy="5" r="3" />
						<circle cx="6" cy="12" r="3" />
						<circle cx="18" cy="19" r="3" />
						<path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
					</svg>
					<span>Share progress</span>
				</button>
				<ul v-if="shareOpen" id="share-menu" class="share-menu">
					<li v-for="link in socialLinks" :key="link.name">
						<a :href="link.href" target="_blank" rel="noopener" @click="shareOpen = false">
							{{ link.name }}
						</a>
					</li>
				</ul>
			</div>
		</header>

		<div class="stats">
			<div class="card stat">
				<span class="stat-label">Completion rate</span>
				<span class="stat-value accent">{{ completionRate }}%</span>
				<div class="bar" role="progressbar" :aria-valuenow="completionRate" aria-valuemin="0" aria-valuemax="100">
					<div class="bar-fill" :style="{ width: completionRate + '%' }"></div>
				</div>
			</div>
			<div class="card stat">
				<span class="stat-label">Done</span>
				<span class="stat-value">{{ monthCounts.DONE }}</span>
				<span class="stat-note">this month</span>
			</div>
			<div class="card stat">
				<span class="stat-label">Skipped</span>
				<span class="stat-value">{{ monthCounts.SKIP }}</span>
				<span class="stat-note">this month</span>
			</div>
			<div class="card stat">
				<span class="stat-label">Current streak</span>
				<span class="stat-value">{{ currentStreak }} {{ dayWord(currentStreak) }}</span>
				<span class="stat-note">Longest: {{ longestStreak }} {{ dayWord(longestStreak) }}</span>
			</div>
		</div>

		<div class="panels">
			<section class="card" aria-label="Monthly calendar">
				<Calendar
					:days="habitsByDay"
					:year="viewYear"
					:month="viewMonth"
					@change-month="changeMonth"
				/>
			</section>

			<section class="card by-habit">
				<h2>By habit</h2>
				<p v-if="!byHabit.length" class="empty">No habits tracked this month yet.</p>
				<div v-for="habit in byHabit" :key="habit.name" class="habit-row">
					<div class="habit-row-head">
						<span class="habit-name">{{ habit.name }}</span>
						<span class="stat-note">{{ habit.rate }}%</span>
					</div>
					<div class="bar small">
						<div class="bar-fill" :style="{ width: habit.rate + '%' }"></div>
					</div>
				</div>
			</section>
		</div>
	</section>
</template>

<style scoped>
.insights {
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
	align-items: center;
}

h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.9rem;
	font-weight: 600;
}

h2 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
}

.card {
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	padding: 1.25rem;
	background: #fff;
	box-sizing: border-box;
}

/* Share */
.share {
	position: relative;
}

.share-btn {
	height: 44px;
	padding: 0 1.25rem;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	border: 2px solid var(--primary-dark);
	border-radius: 5px;
	background: transparent;
	color: var(--primary-dark);
	font: 600 0.9rem "Open Sans", sans-serif;
	cursor: pointer;
}

.share-btn:hover {
	background: var(--primary-dark);
	color: #fff;
}

.share-btn svg {
	width: 16px;
	height: 16px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.share-menu {
	position: absolute;
	right: 0;
	top: calc(100% + 0.5rem);
	z-index: 10;
	min-width: 11rem;
	margin: 0;
	padding: 0.4rem;
	list-style: none;
	background: #fff;
	border: 2px solid var(--primary);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.share-menu a {
	display: block;
	padding: 0.6rem 0.75rem;
	border-radius: 5px;
	color: var(--dark);
	text-decoration: none;
	font-size: 0.9rem;
}

.share-menu a:hover {
	background: var(--primary-soft);
}

/* Stats */
.stats {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
}

.stat {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.stat-label {
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--muted);
}

.stat-value {
	font-family: "Montserrat", sans-serif;
	font-size: 2rem;
	font-weight: 600;
}

.stat-value.accent {
	color: var(--primary-dark);
}

.stat-note {
	font-size: 0.8rem;
	color: var(--muted);
}

.bar {
	height: 8px;
	border-radius: 4px;
	background: #eeeeee;
	overflow: hidden;
}

.bar.small {
	height: 6px;
}

.bar-fill {
	height: 100%;
	background: var(--primary-dark);
	transition: width 0.3s ease-in-out;
}

/* Panels */
.panels {
	display: grid;
	grid-template-columns: 3fr 2fr;
	gap: 1rem;
	align-items: start;
}

.by-habit {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.habit-row {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.habit-row-head {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	font-size: 0.9rem;
}

.habit-name {
	font-weight: 600;
}

.empty {
	margin: 0;
	font-size: 0.9rem;
	color: var(--muted);
}

@media (max-width: 1024px) {
	.stats {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.panels {
		grid-template-columns: minmax(0, 1fr);
	}
}

@media (max-width: 768px) {
	.insights {
		padding: 1rem 1.25rem;
		gap: 1rem;
	}

	h1 {
		font-size: 1.4rem;
	}

	.share-btn span {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.share-btn {
		width: 44px;
		padding: 0;
		justify-content: center;
	}

	.stats {
		gap: 0.6rem;
	}

	.card {
		padding: 0.9rem;
	}

	.stat-value {
		font-size: 1.5rem;
	}
}
</style>
