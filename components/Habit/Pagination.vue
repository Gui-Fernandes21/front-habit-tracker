<script lang="ts" setup>
import {computed} from 'vue';

const displayedTime = computed(() => {
  return new Date().getHours() + ":" + new Date().getMinutes();
});

const currentDate = computed(() => {
  
});
</script>

<template>
	<section>
		<div class="page"></div>
		<div class="action">
      <button class="primary-btn">Edit Habits</button>
    </div>
		<div class="current-time">{{ displayedTime }}</div>
	</section>
</template>

<style scoped>
section {
	display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: "Open Sans", sans-serif;
}

.current-time {
  font-size: 1.5rem;
}
</style>
