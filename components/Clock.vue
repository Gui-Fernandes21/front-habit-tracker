<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const currentTime = ref('');

const updateClock = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  // Determine the period (AM/PM)
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // if hour is 0, set to 12

  // Format time values to have leading zeros
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  currentTime.value = `${formattedHours}:${formattedMinutes} ${period}`;
};

let interval;

onMounted(() => {
  updateClock(); // Initial update
  interval = setInterval(updateClock, 1000); // Update every second
});

onBeforeUnmount(() => {
  clearInterval(interval); // Clear interval when component unmounts
});
</script>

<template>
  <div class="clock">
    <span>{{ currentTime }}</span>
  </div>
</template>

<style scoped>
.clock {
  font-size: 2rem;
  font-weight: 400;
  text-align: center;

  font-family: "Montserrat", sans-serif;
}
</style>
