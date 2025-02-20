<script setup>
// import { } from "vue";

const loading = useState("loading", () => false);
</script>

<template>
	<div>
		<NuxtPage />
		<HabitModalLoading :show="loading" />
	</div>
</template>

<style scoped>
div {
	height: 100vh;
}
</style>
