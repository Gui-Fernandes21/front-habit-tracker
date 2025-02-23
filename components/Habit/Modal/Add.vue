<script setup>
import { ref, defineProps, defineEmits } from "vue";

const emit = defineEmits(["close"]);
const router = useRouter();

const props = defineProps({
	open: { type: Boolean, required: true },
});

const habitName = ref("");
const habitDescription = ref("");
const habitHour = ref("");
const habitMinute = ref("");

const hours = generateTimeArr(23);
const minutes = generateTimeArr(59, 5);

const saveHabit = async () => {
	useState("loading").value = true;

	if (!habitName.value || !habitHour.value || !habitMinute.value) {
		console.error("Please fill in all required fields.");
		useState("loading").value = false;
		return;
	}

	try {
		const body = {
			name: habitName.value,
			description: habitDescription.value,
			hour: habitHour.value,
			minute: habitMinute.value,
		};

		const { data } = await useService("/add-habit", {
			method: "POST",
			body: JSON.stringify(body),
			headers: { Authorization: `Bearer ${useCookie("auth-token").value}` },
		});

		router.go(0);
		useState("loading").value = false;
		emit("close");
	} catch (error) {
		useState("loading").value = false;
		console.error("An error occurred while saving habit:", error);
	}
};

const close = () => {
	emit("close");
};
</script>

<template>
	<div class="modal" v-if="open">
		<div class="modal-content">
			<h2 class="title">Create a Habit</h2>
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

	display: flex;
	flex-direction: column;
	gap: 2.5rem;

	h2 {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.6rem;
	}
}

form {
	display: flex;
	flex-direction: column;

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
