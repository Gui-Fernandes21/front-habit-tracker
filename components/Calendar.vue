<script setup>
import { computed } from "vue";

const props = defineProps({
	// Habits grouped by day: { "2026-09-14": { TODO: 0, DONE: 2, SKIP: 0 } }
	days: { type: Object, default: () => ({}) },
	year: { type: Number, required: true },
	month: { type: Number, required: true }, // 0-11
});

const emit = defineEmits(["change-month"]);

const monthNames = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");

const cells = computed(() => {
	const first = new Date(props.year, props.month, 1).getDay();
	const total = new Date(props.year, props.month + 1, 0).getDate();
	const list = Array.from({ length: first }, (_, i) => ({ key: `empty-${i}`, empty: true }));

	for (let day = 1; day <= total; day++) {
		const key = `${props.year}-${pad(props.month + 1)}-${pad(day)}`;
		const counts = props.days[key];
		list.push({ key, day, state: dayState(counts), label: dayLabel(day, counts) });
	}
	return list;
});

function dayState(counts) {
	if (!counts) return "none";
	const { TODO, DONE, SKIP } = counts;
	if (DONE > 0 && TODO === 0 && SKIP === 0) return "full";
	if (DONE > 0) return "part";
	if (SKIP > 0) return "skip";
	return "pending";
}

function dayLabel(day, counts) {
	const name = `${monthNames[props.month]} ${day}`;
	if (!counts) return `${name}: no habits`;
	return `${name}: ${counts.DONE} done, ${counts.TODO} to do, ${counts.SKIP} skipped`;
}
</script>

<template>
	<div class="calendar">
		<div class="calendar-head">
			<h2>{{ monthNames[month] }} {{ year }}</h2>
			<div class="calendar-nav">
				<button type="button" aria-label="Previous month" @click="emit('change-month', -1)">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
				</button>
				<button type="button" aria-label="Next month" @click="emit('change-month', 1)">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
				</button>
			</div>
		</div>

		<div class="grid week-days">
			<span v-for="name in weekDays" :key="name">{{ name }}</span>
		</div>

		<div class="grid">
			<div
				v-for="cell in cells"
				:key="cell.key"
				:class="['cell', cell.empty ? 'empty' : cell.state]"
				:title="cell.label"
			>
				<span v-if="!cell.empty">{{ cell.day }}</span>
			</div>
		</div>

		<div class="legend">
			<span><i class="full"></i>All done</span>
			<span><i class="part"></i>Some done</span>
			<span><i class="skip"></i>Skipped</span>
			<span><i class="pending"></i>To do</span>
		</div>
	</div>
</template>

<style scoped>
.calendar {
	display: flex;
	flex-direction: column;
	gap: 0.9rem;
}

.calendar-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.calendar-head h2 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
}

.calendar-nav {
	display: flex;
	gap: 0.5rem;
}

.calendar-nav button {
	width: 44px;
	height: 44px;
	display: grid;
	place-items: center;
	border: 2px solid var(--dark-light-1);
	border-radius: 5px;
	background: #fff;
	cursor: pointer;
}

.calendar-nav button:hover {
	border-color: var(--primary);
}

.calendar-nav svg {
	width: 18px;
	height: 18px;
	fill: none;
	stroke: var(--dark);
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 6px;
}

.week-days {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--muted);
	text-align: center;
}

.cell {
	height: 2.9rem;
	padding: 6px 8px;
	box-sizing: border-box;
	border-radius: 6px;
	display: flex;
	justify-content: flex-end;
	font-family: "Montserrat", sans-serif;
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--dark);
}

.empty {
	visibility: hidden;
}

.full {
	background: var(--primary-dark);
	color: #fff;
}

.part {
	background: #c8d1b8;
}

.skip {
	background: #ece3d4;
}

.pending {
	border: 2px solid var(--primary);
}

.none {
	border: 1px solid #e3e3e3;
	color: var(--muted);
}

.legend {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1.25rem;
	font-size: 0.75rem;
	color: var(--muted);
}

.legend span {
	display: flex;
	align-items: center;
	gap: 0.4rem;
}

.legend i {
	width: 12px;
	height: 12px;
	border-radius: 3px;
	box-sizing: border-box;
}

@media (max-width: 768px) {
	.cell {
		height: 2.2rem;
		justify-content: center;
		align-items: center;
		padding: 0;
	}

	.grid {
		gap: 4px;
	}
}
</style>
