<script setup>
import { ref, defineEmits } from "vue";
import ItemDropdown from "./ItemDropdown.vue";

const props = defineProps({
	item: { type: Object, required: true },
	style: { type: String, required: true, default: "TODO" },
});

const emit = defineEmits(["delete", "save-habit"]);

const habit = ref(props.item);

const dropdownOpen = ref(false);
const editModal = ref(false);

const editHabit = () => {
	toggleDropdown();
	editModal.value = true;
};

const closeEdit = () => {
	editModal.value = false;
};

const deleteHabit = async () => {
	emit("delete");
};

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value;
};

const confirmAction = () => {
	saveHabit({ ...habit.value, status: "DONE" });
};

const skipAction = () => {
	saveHabit({ ...habit.value, status: "SKIP" });
};

const todoAction = () => {
	saveHabit({ ...habit.value, status: "TODO" });
};

const saveHabit = (updatedHabit) => {
	emit("save-habit", updatedHabit);
};
</script>

<template>
	<li :class="style">
		<div class="head">
			<div class="time">{{ item.hour }}:{{ item.minute }}</div>
			<div class="header">
				<span :class="item.status">{{ item.status }}</span>
				<h2 class="title">{{ item.name }}</h2>
			</div>
			<div class="float-btn" @click="toggleDropdown">
				<img src="/svg/edit-icon.svg" alt="edit icon" />
				<ItemDropdown
					:habit="item"
					:open="dropdownOpen"
					@update:open="dropdownOpen = $event"
					@edit-habit="editHabit"
					@delete-habit="deleteHabit"
				></ItemDropdown>
			</div>
		</div>
		<div class="body body-text">
			{{ item.description }}
		</div>
		<div class="actions">
			<button v-if="item.status === 'TODO' || item.status == 'SKIP'" class="primary-btn" @click="confirmAction">Confirm</button>
			<button v-if="item.status === 'DONE' || item.status === 'SKIP'" class="dark-btn outline" @click="todoAction">Mark as TODO</button>
			<button v-if="item.status !== 'SKIP'" class="accent-btn outline" @click="skipAction">Skip</button>
		</div>

		<HabitModalEdit
			:habit="habit"
			:open="editModal"
			@close="closeEdit"
			@save-habit="saveHabit"
		></HabitModalEdit>
	</li>
</template>

<style scoped>
li {
	margin: 1rem 0;
	padding: 1rem;
	width: 100%;

	border-radius: 5px;
}

li.TODO {
	border: 2px solid var(--dark-light-1);

	& .float-btn {
		background-color: var(--dark-light);
		border: none;
	}
}

li.DONE {
	border: 2px solid var(--primary);
}

li.SKIP {
	border: 2px solid var(--accent);

	& .float-btn {
		background-color: var(--accent);
		border: 1px solid var(--accent);
	}
}

.head {
	display: flex;
	justify-content: space-between;
	align-items: end;

	font-family: "Montserrat", sans-serif;
}

span {
	font-size: 1rem;
}

span.TODO {
	color: var(--dark-light-1);
}

span.DONE {
	color: var(--primary);
}

span.SKIP {
	color: var(--accent);
}

.title {
	font-weight: 400;
}

.body {
	text-align: center;
	margin: 1.5rem 0;
	padding: 0 1rem;
}

.actions {
	display: flex;
	gap: 1rem;

	& > button {
		width: 100%;
	}
}

.float-btn {
	position: relative;
}

.time {
	font-size: 1.2rem;
}
</style>
