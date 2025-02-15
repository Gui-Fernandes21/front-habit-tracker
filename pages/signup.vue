<script setup lang="ts">
import { ref } from 'vue';

const email = ref();
const password = ref();

const signup = () => {

}

</script>

<template>
  <section>
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" required />
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" required />
      <button>Sign Up</button>
    </form>
  </section>
</template>