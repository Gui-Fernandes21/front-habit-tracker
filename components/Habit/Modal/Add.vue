<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["close", "add-habit"]);
const router = useRouter();

const props = defineProps({
	open: { type: Boolean, required: true },
});

const habitName = ref("");
const habitDescription = ref("");
const habitGoal = ref(1);
const repeat = ref("Daily");
const habitHour = ref("");
const habitMinute = ref("");
const startDate = ref(new Date().toISOString().split("T")[0]);

const hours = generateTimeArr(23);
const minutes = generateTimeArr(59, 5);

const repeatOptions = ["Daily", "Weekly", "Monthly"];
const timeOfDayOptions = ["Morning", "Afternoon", "Evening", "Night"];

const saveHabit = async () => {
	if (!habitName.value || !habitHour.value || !habitMinute.value) {
		console.error("Please fill in all required fields.");
		return;
	}
	
	emit("add-habit", {
		name: habitName.value,
		description: habitDescription.value,
		hour: habitHour.value,
		minute: habitMinute.value,
		repeat: repeat.value,
		goal: habitGoal.value,
		startDate: startDate.value
	});

	habitName.value = "";
	habitDescription.value = "";
	habitHour.value = "";
	habitMinute.value = "";
	repeat.value = "Daily";
	habitGoal.value = 1;
	startDate.value = ref(new Date().toISOString().split("T")[0]);

	close();
};

const close = () => {
	emit("close");
};
</script>

<template>
	<div class="modal" v-if="open">
		<div class="modal-content">
			<h2 class="title">New habit</h2>
			<form @submit.prevent="saveHabit">
				<div class="form-group">
					<label for="habit-name">Name</label>
					<input
						class="primary-input-form"
						type="text"
						id="habit-name"
						v-model="habitName"
					/>
				</div>
				<div class="form-group">
					<label for="habit-goal">Goal per month</label>
					<input type="number" id="habit-goal" class="primary-input-form" v-model="habitGoal" min="1" />
				</div>
				<div class="form-group">
					<label for="habit-repeat">Repeat</label>
					<select id="habit-repeat" v-model="repeat">
						<option v-for="option in repeatOptions" :value="option">{{ option }}</option>
					</select>
				</div>
				<div class="form-group">
					<label for="habit-time">Time</label>
					<div class="group-select">
						<select id="habit-time" v-model="habitHour">
							<option v-for="hour in hours" :value="hour">{{ hour }}</option>
						</select>
						<select id="habit-time" v-model="habitMinute">
							<option v-for="minute in minutes" :value="minute">
								{{ minute }}
							</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="start-date">Start date</label>
					<input type="date" id="start-date" class="primary-input-form" v-model="startDate" />
				</div>
				<div class="form-group">
					<label for="habit-description">Description</label>
					<textarea
						id="habit-description"
						class="primary-input-form"
						v-model="habitDescription"
					></textarea>
				</div>
				<div class="actions">
					<button type="submit" class="primary-btn">Save</button>
					<button @click.prevent="close" class="accent-btn outline">
						Close
					</button>
				</div>
			</form>
		</div>
	</div>

	<HabitModalLoading :show="false"></HabitModalLoading>
</template>

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(33, 33, 33, 0.33);
	display: flex;
	justify-content: center;
	align-items: center;

	z-index: 1000;
}

.modal-content {
	background-color: white;
	border: 2px solid var(--primary);

	text-align: start;

	padding: 2rem;
	border-radius: 5px;
	width: 50%;
	max-height: calc(100vh - 40px);
	overflow-y: auto;

	display: flex;
	flex-direction: column;
	gap: 2.5rem;

	h2 {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.1rem;
	}
}

form {
	display: flex;
	flex-direction: column;

	gap: 1.5rem;
}

.form-group {
	display: flex;
	flex-direction: column;
}

label {
	font-family: "Open Sans", sans-serif;
	font-size: 0.8rem;
	margin-bottom: 5px;
}

select {
	padding: 0.2rem 0.5rem;
	border: 2px solid var(--primary);
	border-radius: 5px;
	cursor: pointer;
	font-size: 0.8rem;
}

.group-select {
	display: flex;
	gap: 1rem;
}

#habit-description {
	min-height: 2.5rem;
	width: 100% !important;
}

.actions {
	margin-top: 1.5rem;
	display: flex;
	gap: 1rem;

	button {
		width: 100%;
	}
}

.title {
	text-align: center;
}

#start-date, #habit-description {
	font-family: 'Arial';
}
</style>
