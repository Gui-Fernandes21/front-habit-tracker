<script setup>
// import { } from "vue";

useState("loading", () => false);
useState("auth-token", () => null);
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
