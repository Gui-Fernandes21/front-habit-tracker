<script setup>
import { ref, computed, onMounted } from "vue";

const currentDate = ref(new Date());
const habits = ref([]);

const fetchHabits = async () => {
	try {
		const { data } = await useService("/fetch-habits");
		if (data.value) {
			habits.value = data.value.habits;
		} else {
			console.warn("No habits found.");
		}
	} catch (err) {
		console.error("An error occurred while fetching habits:", err);
	}
};

onMounted(fetchHabits);

const monthNames = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

const daysInMonth = computed(() => {
	const year = currentDate.value.getFullYear();
	const month = currentDate.value.getMonth();
	return new Date(year, month + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
	const year = currentDate.value.getFullYear();
	const month = currentDate.value.getMonth();
	return new Date(year, month, 1).getDay();
});

const habitsByDate = computed(() => {
	const grouped = {};
	habits.value.forEach((habit) => {
		const dateKey = new Date(habit.startDate).toISOString().slice(0, 10);
		if (!grouped[dateKey]) {
			grouped[dateKey] = { TODO: 0, DONE: 0, SKIP: 0 };
		}
		grouped[dateKey][habit.status]++; // Count each habit
	});
	return grouped;
});
</script>

<template>
	<div class="calendar">
		<h2 class="month-title">{{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}</h2>
		<div class="calendar-grid">
			<div class="day-header">Sun</div>
			<div class="day-header">Mon</div>
			<div class="day-header">Tue</div>
			<div class="day-header">Wed</div>
			<div class="day-header">Thu</div>
			<div class="day-header">Fri</div>
			<div class="day-header">Sat</div>

			<!-- <div v-for="n in firstDayOfMonth" :key="'empty' + n" class="empty-cell"></div>
			<div v-for="day in daysInMonth" :key="day" class="day">
				{{ day }}
			</div> -->
			<div v-for="n in firstDayOfMonth" :key="'empty' + n" class="empty-cell"></div>
			<div v-for="day in daysInMonth" :key="day" class="day">
				<span>{{ day }}</span>
				<div class="habit-dots">
					<span v-for="n in (habitsByDate[`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`]?.TODO || 0)"
						  :key="'todo' + n" class="dot todo"></span>
					<span v-for="n in (habitsByDate[`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`]?.DONE || 0)"
						  :key="'done' + n" class="dot done"></span>
					<span v-for="n in (habitsByDate[`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`]?.SKIP || 0)"
						  :key="'skip' + n" class="dot skip"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.calendar {
	width: 100%;
	text-align: center;
}

.month-title {
	font-size: 1.1rem;
	font-weight: 400;
	margin-bottom: 1.2rem;
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 5px;
}

.day-header {
	font-weight: bold;
	padding: 5px;
	color: var(--dark);
    font-size: 0.6rem;
}

.day {
	padding: 10px;
	border-radius: 5px;
	background-color: var(--primary);
	color: var(--light);
	font-weight: bold;
	cursor: pointer;
    font-size: 0.6rem;
}

.day:hover {
	background-color: var(--accent);
}

.empty-cell {
	visibility: hidden;
}

.habit-dots {
	display: flex;
	justify-content: center;
	margin-top: 5px;
	gap: 3px;
}

.dot {
	width: 0.3rem;
	height: 0.3rem;
	border-radius: 50%;
}

.todo {
	background-color: #f5b400; /* Yellow */
}

.done {
	background-color: #4caf50; /* Green */
}

.skip {
	background-color: #f44336; /* Red */
}
</style>
