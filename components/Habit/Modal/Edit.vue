<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps({
	open: { type: Boolean, required: true },
	habit: { type: Object, required: true },
});

const habit = ref(props.habit);

const habitName = ref(props.habit.name);
const habitDescription = ref(props.habit.description);
const habitHour = ref(props.habit.hour);
const habitMinute = ref(props.habit.minute);
const habitStatus = ref(props.habit.status);

const hours = generateTimeArr(23);
const minutes = generateTimeArr(59, 5);

const saveHabit = () => {
	emit("save-habit", {
		name: habitName.value,
		description: habitDescription.value,
		hour: habitHour.value,
		minute: habitMinute.value,
		status: habitStatus.value,
		_id: habit.value._id,
	});
	close();
};

const close = () => {
	emit("close");
};
</script>

<template>
	<div class="modal" v-if="open">
		<div class="modal-content">
			<h2 class="title">Edit Habit</h2>
			<form @submit.prevent="saveHabit">
				<div class="form-group">
					<label for="habit-name">Habit Name</label>
					<input
						class="primary-input"
						type="text"
						id="habit-name"
						v-model="habitName"
					/>
				</div>
				<div class="form-group">
					<label for="habit-time">Habit Time</label>
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
					<label for="habit-description">Habit Description</label>
					<textarea
						id="habit-description"
						class="primary-input"
						v-model="habitDescription"
					></textarea>
				</div>
				<div class="form-group">
					<label for="habit-status">Habit Status</label>
					<div class="group-select">
						<select id="habit-status" v-model="habitStatus">
							<option value="TODO">To Do</option>
							<option value="DONE">Done</option>
							<option value="SKIP">Skip</option>
						</select>
					</div>
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
</template>

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(33, 33, 33, 0.33);
	display: flex;
	justify-content: center;
	align-items: center;

	z-index: 10000;
}

.modal-content {
	background-color: white;
	border: 2px solid var(--primary);

	padding: 2rem;
	border-radius: 5px;
	width: 50%;

	display: flex;
	flex-direction: column;
	gap: 2.5rem;

	text-align: start;

	h2 {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.6rem;
	}
}

form {
	display: flex;
	flex-direction: column;

	font-family: "Open Sans", sans-serif;

	gap: 2rem;
}

.form-group {
	display: flex;
	flex-direction: column;
}

label {
	font-family: "Open Sans", sans-serif;
	font-size: 0.9rem;
	margin-bottom: 5px;
}

select {
	padding: 0.5rem 1rem;
	border: 2px solid var(--primary);
	border-radius: 5px;
	cursor: pointer;

	font-family: "Open Sans", sans-serif;
	font-weight: 500;
}

.group-select {
	display: flex;
	gap: 1rem;
}

#habit-description {
	min-height: 150px;
}

.actions {
	display: flex;
	gap: 1rem;

	button {
		width: 100%;
	}
}
</style>
