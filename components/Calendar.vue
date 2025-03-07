<script setup>
import { ref, computed } from "vue";

const currentDate = ref(new Date());

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

			<div v-for="n in firstDayOfMonth" :key="'empty' + n" class="empty-cell"></div>
			<div v-for="day in daysInMonth" :key="day" class="day">
				{{ day }}
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
</style>
