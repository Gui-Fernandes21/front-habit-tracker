<script setup>
import { defineProps, ref, defineEmits } from "vue";
import ItemDropdown from "./ItemDropdown.vue";

const props = defineProps({ item: { type: Object, required: true } });
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
	console.log("confirm");
};

const skipAction = () => {
	console.log("skip");
};

const saveHabit = (updatedHabit) => {
	emit("save-habit", updatedHabit);
};
</script>

<template>
	<li>
		<div class="head">
			<div class="time">{{ item.hour }}:{{ item.minute }}</div>
			<h2 class="title">{{ item.name }}</h2>
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
			<button class="primary-btn" @click="confirmAction">Confirm</button>
			<button class="accent-btn outline" @click="skipAction">Skip</button>
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

	border: 1px solid var(--primary);
	border-radius: 5px;
}

.head {
	display: flex;
	justify-content: space-between;
	align-items: center;

	font-family: "Montserrat", sans-serif;
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
