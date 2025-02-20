<script setup lang="ts">
</script>

<template>
	<section class="preferences">
		<TheNav />
		<SideNav />
		<div class="content">
			<HabitPagination></HabitPagination>
			<ul>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.preferences {
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
