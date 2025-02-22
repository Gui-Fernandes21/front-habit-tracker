<script setup>
import Loading from './components/global/Loading.vue';

// import { } from "vue";

useState("loading", () => false);
useState("auth-token", () => null);
</script>

<template>
	<div>
		<Loading :show="useState('loading').value" />
		<NuxtPage />
	</div>
</template>

<style scoped>
div {
	height: 100vh;
}
</style>
