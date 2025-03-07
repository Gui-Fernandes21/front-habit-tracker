<script setup>
import { ref } from "vue";
import TheNav from "@/components/TheNav.vue";
import SideNav from "@/components/SideNav.vue";
import Calendar from "@/components/Calendar.vue";

definePageMeta({
	middleware: "auth",
});

const loading = useState("loading");

onMounted(() => {
    loading.value = false;
});

</script>

<template>
	<section class="insights">
		<TheNav />
		<SideNav />
		<div class="content">
			<h1>Activity Insights</h1>
            <div class="top-nav-divider"></div>
			<section class="calendar-container">
				<Calendar />
			</section>
		</div>
	</section>
</template>

<style scoped>
.insights {
	display: grid;
	grid-template-columns: 4rem calc(100% - 4rem);
	grid-template-rows: 5rem 1fr;
	height: 100%;
}

.content {
	grid-column: 2;
	grid-row: 2;
	font-family: "Open Sans", sans-serif;
	padding: 1rem;
	width: 100%;
	justify-self: center;
}

h1 {
	font-size: 1.3rem;
    font-weight: 500;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    padding: 1rem;
    margin-left: -0.7rem;
}

.calendar-container {
	border: 2px solid var(--primary);
	border-radius: 5px;
	background-color: var(--light);
	display: flex;
	justify-content: center;
	align-items: center;
    margin-top: 4rem;
    width: 45%;
    padding: 0.7rem 0.5rem;
    margin-left: 1.5rem;
}

.top-nav-divider {
	width: 100%;
	height: 0.1rem;
	background-color: var(--accent);
	margin-top: 1rem;
}
</style>