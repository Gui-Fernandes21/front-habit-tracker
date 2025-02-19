<script setup>
import { defineProps } from "vue";

const props = defineProps({
	habit: { type: Object, required: true },
	open: { type: Boolean, required: true },
});

const editHabit = () => {
	
}

const deleteHabit = () => {
	
}
</script>

<template>
	<div class="dropdown" v-if="open" @mouseleave="$emit('update:open', false)">
		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
			<li class="body-text" @click="editHabit">Edit</li>
			<li class="body-text" @click="deleteHabit">Delete</li>
		</ul>
	</div>
</template>

<style scoped>
.dropdown {
	position: absolute;
	top: 100%; /* Position the menu below the dropdown */
	left: -1.5rem;
	z-index: 1000; 
}

.dropdown-menu {
  background-color: var(--primary); 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	border-radius: 5px;

	list-style-type: none;

	li {
		padding: 0.5rem 1rem;
		color: white;
		cursor: pointer;


		border-radius: 5px;

		&:hover {
			background-color: var(--accent);
		}
	}
}

.dropdown:hover .dropdown-menu {
  display: block; /* Show menu on hover */
}
</style>
