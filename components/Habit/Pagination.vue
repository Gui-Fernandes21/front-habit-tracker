<script setup>
import { computed } from "vue";

const displayedTime = computed(() => {
	return new Date().getHours() + ":" + new Date().getMinutes();
});

const currentDate = computed(() => {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${day}/${month}`;
});
</script>

<template>
	<section>
		<div class="page">
      <h2 class="date">{{ currentDate }}</h2>
      <div class="actions">
        <div class="prev"><</div>
        <div class="next">></div>
      </div>
    </div>
		<div class="action">
			<button class="primary-btn">Edit Habits</button>
		</div>
    <Clock />
		<!-- <div class="current-time">{{ displayedTime }}</div> -->
	</section>
</template>

<style scoped>
section {
	padding: 1rem;

  /* margin-bottom: 3rem; */

	display: flex;
	align-items: center;
	justify-content: space-between;

	font-family: "Montserrat", sans-serif;
}

.page {
  font-size: 1.5rem;
}

.date {
  font-size: 1.5rem;
  letter-spacing: 2px;
}

.actions {
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    cursor: pointer;
  }
}

.current-time {
	font-size: 2rem;
}
</style>
