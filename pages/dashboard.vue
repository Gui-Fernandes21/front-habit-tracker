<script setup lang="ts">
const habits = [
	{
		id: 1,
		title: "read a book",
		status: "ToDo",
		time: "12:30PM",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, illum quae ducimus, facilis error repudiandae assumenda eum, provident ipsa beatae modi? Temporibus iure corrupti sit inventore debitis assumenda maxime accusantium.",
	},
	{
		id: 1,
		title: "Go for a Walk",
		status: "ToDo",
		time: "13:30PM",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, illum quae ducimus, facilis error repudiandae assumenda eum, provident ipsa beatae modi? Temporibus iure corrupti sit inventore debitis assumenda maxime accusantium.",
	},
	{
		id: 1,
		title: "Hit the Gym",
		status: "ToDo",
		time: "14:30PM",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, illum quae ducimus, facilis error repudiandae assumenda eum, provident ipsa beatae modi? Temporibus iure corrupti sit inventore debitis assumenda maxime accusantium.",
	},
];
</script>

<template>
	<section class="dashboard">
		<TheNav />
		<SideNav />
		<div class="content">
			<HabitPagination></HabitPagination>
			<ul>
				<HabitItem v-for="item in habits" :item="item"></HabitItem>
			</ul>
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
}
</style>
