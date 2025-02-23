<script setup>
import { ref } from "vue";
definePageMeta({
	middleware: "auth",
});

const habits = ref([]);

// ===============================================================================
useService("/fetch-habits", {
	method: "GET",
	headers: {
		Authorization: `Bearer ${useCookie("auth-token").value}`,
	},
})
	.then((res) => {
		const { data } = res;
		if (data.value) {
			habits.value = data.value.habits;
			console.log("Habits fetched successfully:", habits.value);
		}
	})
	.catch((error) => {
		console.error("An error occurred while fetching habits:", error);
	})
	.finally(() => {
		useState("loading").value = false;
	});

// ==============================METHODS========================================
const deleteHabit = async (id) => {
	if (!id) {
		return console.error("No habit id provided.");
	}

	const confirmDelete = confirm("Are you sure you want to delete this habit?");

	if (!confirmDelete) {
		return console.log("delete canceled");
	}

	try {
		useState("loading").value = true;
		const { data } = await useService("/delete-habit/" + id, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${useCookie("auth-token").value}` },
		});

		habits.value = habits.value.filter((habit) => habit._id !== id);
	} catch (err) {
		console.error("An error occurred while deleting habit:", err);
	} finally {
		useState("loading").value = false;
	}
};

const saveHabit = async (habit) => {
	useState("loading").value = true;

	const body = {
		name: habit.name,
		description: habit.description,
		hour: habit.hour,
		minute: habit.minute,
	};

	try {
		const { data } = await useService("/update-habit/" + habit._id, {
			method: "PATCH",
			headers: { Authorization: `Bearer ${useCookie("auth-token").value}` },
			body,
		});

		habits.value = habits.value.map((item) => {
			if (item._id === habit._id) {
				item = data.value.habit;
			}
			return item;
		});

		habits.value = sortHabitsArray(habits.value);

		console.log("Habit updated successfully:", data.value.habit);
	} catch (err) {
		console.error("An error occurred while updating habit:", err);
	} finally {
		useState("loading").value = false;
	}
};
</script>

<template>
	<section class="dashboard">
		<TheNav />
		<SideNav />
		<div class="content">
			<HabitPagination></HabitPagination>
			<ul v-if="habits.length">
				<HabitItem
					v-for="habit in habits"
					:key="habit._id"
					:item="habit"
					@delete="deleteHabit(habit._id)"
					@save-habit="saveHabit"
				></HabitItem>
			</ul>
			<h1 v-else>No habits found.</h1>
		</div>
	</section>
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
}
</style>
