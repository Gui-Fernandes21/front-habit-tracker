<script setup>
definePageMeta({
	middleware: "auth",
});
useState('loading').value = false;
</script>

<template>
	<section class="preferences">
		<TheNav />
		<SideNav />
		<div class="content">
			<h1>User Settings</h1>
			<section class="picture">
				<h2>Profile Picture</h2>
				<p>Upload a new profile picture</p>
				<input type="file" />
			</section>
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

	margin: 1rem;
	padding: 1rem;
}

h1 {
	font-family: "Montserrat", sans-serif;
	font-size: 2rem;
	font-weight: 400;
	color: var(--dark-light); 

	margin-bottom: 1rem;
}
</style>
