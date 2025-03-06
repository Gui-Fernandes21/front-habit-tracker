<script setup>
import { ref, watch } from "vue";
definePageMeta({
	middleware: "auth",
});

const loading = useState("loading");
const filterStatus = ref("TODO");
const habits = ref([]);

const addHabitModal = ref(false);

const openAddHabit = () => {
  addHabitModal.value = true;
};

const closeHabitModal = () => {
  addHabitModal.value = false;
};

// ===============================================================================
// ==============================FETCH DASHBOARD==================================
// ===============================================================================

const fetchHabits = async ({ filter = "TODO" } = {}) => {
	loading.value = true;
	try {
		const { data } = await useService("/fetch-habits", {
			params: { filter },
		});
		if (data.value) {
			habits.value = data.value.habits;
			console.log("Habits fetched successfully: ", habits.value);
		} else {
			console.warn("No habits found for the given filter status: ", filter);
		}
	} catch (err) {
		console.error("An error occurred while fetching habits:", err);
	} finally {
		loading.value = false;
	}
};

fetchHabits();

watch(filterStatus, (newValue) => fetchHabits({ filter: newValue }));

// ===============================================================================
// ==============================METHODS==========================================
// ===============================================================================

const addHabit = async (newHabit) => {
	loading.value = true;

	try {
		const { data } = await useService("/add-habit", {
			method: "POST",
			body: newHabit,
		});

		if (filterStatus.value == "ALL" || filterStatus.value == "TODO") {
			habits.value = [...habits.value, data.value.habit];
		}

		habits.value = sortHabitsArray(habits.value);

		console.log("Habit added successfully:", data.value.habit);
  		closeHabitModal();
	} catch (err) {
		console.error("An error occurred while adding habit:", err);
	} finally {
		loading.value = false;
	}
};

const deleteHabit = async (id) => {
	if (!id) {
		return console.error("No habit id provided.");
	}

	const confirmDelete = confirm("Are you sure you want to delete this habit?");

	if (!confirmDelete) {
		return console.log("delete canceled");
	}

	try {
		loading.value = true;
		const { data } = await useService("/delete-habit/" + id, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${useCookie("auth-token").value}` },
		});

		habits.value = habits.value.filter((habit) => habit._id !== id);
	} catch (err) {
		console.error("An error occurred while deleting habit:", err);
	} finally {
		loading.value = false;
	}
};

const updateHabit = async (habit) => {
	loading.value = true;

	try {
		const { data } = await useService("/update-habit/" + habit._id, {
			method: "PATCH",
			headers: { Authorization: `Bearer ${useCookie("auth-token").value}` },
			body: habit,
		});

		habits.value = habits.value.map((item) => {
			if (item._id === habit._id) {
				item = data.value.habit;
			}
			return item;
		});

		if (filterStatus.value !== "ALL") {
			habits.value = habits.value.filter(
				(habit) => habit.status === filterStatus.value
			);
		}

		habits.value = sortHabitsArray(habits.value);

		console.log("Habit updated successfully:", data.value.habit);
	} catch (err) {
		console.error("An error occurred while updating habit:", err);
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<section class="dashboard">
		<TheNav />
		<SideNav />
		<div class="content">
			<HabitPagination @add-habit="addHabit"></HabitPagination>
			<div class="filter-action-container">
				<div class="action">
					<button @click="openAddHabit" @close="closeHabitModal" class="primary-btn">Add habit</button>
				</div>				
				<div class="group-select select-custom">
					<select id="filter-status" v-model="filterStatus">
						<option value="ALL">All</option>
						<option value="TODO">To Do</option>
						<option value="DONE">Done</option>
						<option value="SKIP">Skip</option>
					</select>
				</div>
			</div>
			<ul v-if="habits.length">
				<HabitItem
					v-for="habit in habits"
					:key="habit._id"
					:item="habit"
					:style="habit.status"
					@delete="deleteHabit(habit._id)"
					@save-habit="updateHabit"
				></HabitItem>
			</ul>
			<h1 v-else>No habits found.</h1>
		</div>
	</section>

	<HabitModalAdd :open="addHabitModal" @add-habit="addHabit" @close="closeHabitModal" />
</template>

<style scoped>
.dashboard {
	display: grid;

	grid-template-columns: 4rem calc(100% - 4rem);
	grid-template-rows: 5rem 1fr;

	height: 100%;
}

ul {
	list-style: none;
}

.content {
	grid-column: 2;
	grid-row: 2;

	padding: 1rem;

	text-align: center;
}

h1 {
	color: var(--dark-light);
	font-family: "Montserrat", sans-serif;
	margin: 1rem 0;
	margin-left: -1.1rem;
	font-size: 1rem;
}

.filter-container {
	display: flex;
	justify-content: end;
	align-items: end;
	margin: 1rem 0;
}

select {
	padding: 0.5rem 1rem;
	border: 2px solid var(--primary);
	border-radius: 5px;
	cursor: pointer;

	font-family: "Open Sans", sans-serif;
	font-weight: 500;
}

label {
	font-family: "Open Sans", sans-serif;
	font-size: 0.9rem;
	margin-bottom: 5px;
}

.select-custom {
	width: 100%;
	text-align: center;
	margin-top: 2rem;
	justify-self: start;
}

#filter-status {
	width: 100%;
}

.filter-action-container {
	display: flex;
	flex-direction: row;
	width: 70%;
	gap: 5rem;
	margin-top: 3rem;
	justify-self: center;
}

.filter-action-container .action,
.filter-action-container .group-select {
	width: 50%;
}

.filter-action-container .action {
	margin-top: 2rem;
}

.filter-action-container .action button {
	width: 100%;
}
</style>
