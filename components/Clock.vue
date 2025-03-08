<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const currentTime = ref('');

const updateClock = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  currentTime.value = `${formattedHours}:${formattedMinutes} ${period}`;
};

let interval;

onMounted(() => {
  updateClock();
  interval = setInterval(updateClock, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="clock">
    <span>{{ currentTime }}</span>
  </div>
</template>

<style scoped>
.clock {
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;

  font-family: "Montserrat", sans-serif;
}
</style>
