<script setup>
import { ref, computed } from "vue";

const currentDate = computed(() => {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${day}/${month}`;
});

const addHabitModal = ref(false);

const addHabit = () => {
  addHabitModal.value = true;
};

const closeHabitModal = () => {
  addHabitModal.value = false;
};

</script>

<template>
	<section>
		<div class="page">
      <h2 class="date">{{ currentDate }}</h2>
      <!-- <div class="actions">
        <div class="prev"><</div>
        <div class="next">></div>
      </div> -->
    </div>
		<div class="action">
			<button @click="addHabit" @close="closeHabitModal" class="primary-btn">Add Habits</button>
		</div>
    <Clock />
	</section>
  <HabitModalAdd :open="addHabitModal" @close="closeHabitModal" />
</template>

<style scoped>
section {
	padding: 1rem;

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
