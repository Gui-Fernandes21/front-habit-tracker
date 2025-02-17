<script setup lang="ts"></script>

<template>
	<section>
		<TheNav />
		<div class="container">
			<SideNav />
			<div class="content">
				<HabitPagination></HabitPagination>
				<p>Welcome to your dashboard</p>
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

.content {
  padding: 1rem;
}
</style>
