<script setup>
import { defineProps } from "vue";

const props = defineProps({ item: { type: Object, required: true } });
</script>

<template>
	<li> 
    <div class="head">
      <div class="time">{{ item.time }}</div>
      <h2 class="title">{{ item.title }}</h2>
      <div class="float-btn"></div>
    </div>
    <div class="body body-text">
      {{ item.description }}
    </div>
    <div class="actions">
      <button class="primary-btn">Confirm</button>
      <button class="accent-btn outline">Skip</button>
    </div>  
  </li>
</template>

<style scoped>
li {
  margin: 1rem 0;
  padding: 1rem;
  width: 100%;
  
  border: 1px solid var(--primary);
  border-radius: 5px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-family: "Montserrat", sans-serif;
}

.title {
  font-weight: 400;
}

.body {
  text-align: center;
  margin: 1.5rem 0;
  padding: 0 1rem;
}

.actions {
  display: flex;
  gap: 1rem;

  & > button {
    width: 100%;
  }
}
</style>
