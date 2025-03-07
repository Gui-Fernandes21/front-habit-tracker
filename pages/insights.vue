<script setup>
import { ref } from "vue";
import TheNav from "@/components/TheNav.vue";
import SideNav from "@/components/SideNav.vue";
import Calendar from "@/components/Calendar.vue";

definePageMeta({
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
			console.log("Habits fetched successfully:", habits.value);
		} else {
			console.warn("No habits found.");
		}
	} catch (err) {
		console.error("An error occurred while fetching habits:", err);
	} finally {
		loading.value = false;
	}
};

onMounted(fetchHabits);

const habitCounts = computed(() => {
	const counts = { TODO: 0, DONE: 0, SKIP: 0 };
	habits.value.forEach((habit) => {
		counts[habit.status]++;
	});
	return counts;
});

const completionRate = computed(() => {
	const total = habits.value.length;
	if (total === 0) return 0;
	return Math.round((habitCounts.value.DONE / total) * 100);
});

const longestStreak = computed(() => {
	const completedDays = [];
	const habitDays = {};

	habits.value.forEach((habit) => {
		const dateKey = new Date(habit.startDate).toISOString().slice(0, 10);
		if (!habitDays[dateKey]) {
			habitDays[dateKey] = { TODO: 0, DONE: 0, SKIP: 0 };
		}
		habitDays[dateKey][habit.status]++;
	});

	let maxStreak = 0;
	let currentStreak = 0;
	const sortedDates = Object.keys(habitDays).sort();

	for (let i = 0; i < sortedDates.length; i++) {
		const date = sortedDates[i];
		const { TODO, DONE, SKIP } = habitDays[date];

		if (SKIP > 0) {
			currentStreak = 0;
		} else if (DONE > 0 && TODO === 0) {
			currentStreak++;
			maxStreak = Math.max(maxStreak, currentStreak);
		} else {
			continue;
		}
	}

	return maxStreak;
});


const shareText = "Check out my progress on HTK!";
const shareUrl = "https://yourwebsite.com/insights";

const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`
};
</script>

<template>
	<section class="insights">
		<TheNav />
		<SideNav />
		<div class="content">
			<h1>Activity Insights</h1>
            <div class="top-nav-divider"></div>
            <div class="insights-container">
				<section class="calendar-container">
					<Calendar />
				</section>
				<section class="insights-summary">
					<div class="summary-container">
						<div class="summary-box done">
							<h2>✅ Done</h2>
							<p>{{ habitCounts.DONE }}</p>
						</div>
						<div class="summary-box todo">
							<h2>⏳ To Do</h2>
							<p>{{ habitCounts.TODO }}</p>
						</div>
						<div class="summary-box skip">
							<h2>❌ Skipped</h2>
							<p>{{ habitCounts.SKIP }}</p>
						</div>
					</div>
					<div class="completion-rate">
						<h2>🏆 Completion Rate</h2>
						<div class="progress-bar">
							<div class="progress" :style="{ width: completionRate + '%' }"></div>
						</div>
						<p>{{ completionRate }}% of habits completed</p>
					</div>
					<div class="streak-tracker">
						<h2>🔥 Streak Tracker</h2>
						<p>Your longest streak: <strong>{{ longestStreak }} days</strong>!</p>
					</div>
				</section>
			</div>
			<section class="share-container">
				<h2> Share Progress </h2>
				<div class="share-buttons">
					<a :href="socialLinks.facebook" target="_blank" class="share-btn facebook">Facebook</a>
					<a :href="socialLinks.twitter" target="_blank" class="share-btn twitter">Twitter</a>
					<a :href="socialLinks.linkedin" target="_blank" class="share-btn linkedin">LinkedIn</a>
					<a :href="socialLinks.whatsapp" target="_blank" class="share-btn whatsapp">WhatsApp</a>
				</div>
			</section>
		</div>
	</section>
</template>

<style scoped>
.insights {
	display: grid;
	grid-template-columns: 4rem calc(100% - 4rem);
	grid-template-rows: 5rem 1fr;
	height: 100%;
}

.content {
	grid-column: 2;
	grid-row: 2;
	font-family: "Open Sans", sans-serif;
	padding: 1rem;
	width: 100%;
	justify-self: center;
}

h1 {
	font-size: 1.3rem;
    font-weight: 500;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    padding: 1rem;
    margin-left: -0.7rem;
}

.top-nav-divider {
	width: 100%;
	height: 0.1rem;
	background-color: var(--accent);
	margin-top: 1rem;
}

.insights-container {
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin-top: 2rem;
}

.calendar-container {
	border: 2px solid var(--primary);
	border-radius: 5px;
	background-color: var(--light);
	display: flex;
	justify-content: center;
	align-items: center;
    margin-top: 4rem;
    width: 55%;
    padding: 0.7rem 0.5rem;
    margin-left: 3.5rem;
}

.insights-summary {
	width: 45%;
	display: flex;
	flex-direction: column;
	gap: 3.5rem;
    align-items: center;
    margin-top: 5rem;
}

.summary-container {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
    width: 55%;
}

.summary-box {
	flex: 1;
	padding: 0.5rem;
	border-radius: 5px;
	text-align: center;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.summary-box h2 {
	font-size: 0.6rem;
	margin-bottom: 0.5rem;
}

.summary-box p {
	font-size: 0.8rem;
	font-weight: bold;
}

.summary-box.done {
	background-color: #a3b18a;
	color: white;
}

.summary-box.todo {
	background-color: #f5f5f5;
	border: 2px solid #a3b18a;
	color: #333;
}

.summary-box.skip {
	background-color: #d9cab3;
	color: white;
}

.completion-rate {
	text-align: center;
	margin-top: 1rem;
    width: 50%;
}

.completion-rate h2 {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
}

.completion-rate p {
    font-size: 0.7rem;
    margin-top: 0.2rem;
}

.progress-bar {
	width: 100%;
	height: 10px;
	background-color: #f5f5f5;
	border-radius: 5px;
	overflow: hidden;
}

.progress {
	height: 100%;
	background-color: #a3b18a;
	border-radius: 5px;
	transition: width 0.3s ease-in-out;
}

.streak-tracker {
	text-align: center;
	margin-top: 1rem;
    width: 50%;
}

.streak-tracker h2 {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
}

.streak-tracker p {
    font-size: 0.7rem;
    margin-top: 0.2rem;
}

.share-container {
	margin-top: 5.5rem;
	text-align: center;
}

.share-container h2 {
	font-size: 0.8rem;
	font-weight: 500;
	color: var(--dark);
	margin-bottom: 1rem;
	font-family: "Montserrat", sans-serif;
}

.share-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1rem;
}

.share-btn {
	padding: 0.2rem 0.8rem;
	border-radius: 5px;
	text-decoration: none;
	color: var(--light);
	font-size: 0.5rem;
	font-weight: 500;
	cursor: pointer;
	border: none;
	display: inline-block;
}

.facebook { background-color: #3b5998; }
.twitter { background-color: #1da1f2; }
.linkedin { background-color: #0077b5; }
.whatsapp { background-color: #25d366; }

.share-btn:hover {
	opacity: 0.8;
}
</style>