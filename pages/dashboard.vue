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
	<section>
		<TheNav />
		<div class="container">
			<SideNav />
			<div class="content">
				<HabitPagination></HabitPagination>
				<ul>
					<HabitItem v-for="item in habits" :item="item"></HabitItem>
				</ul>
			</div>
		</div>
	</section>
</template>

<style scoped>
.container {
	display: grid;
	grid-template-columns: 4rem calc(100% - 4rem);
	min-height: 90vh;
}

ul {
	list-style: none;
}

.content {
	padding: 1rem;
}
</style>
