<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const login = () => {
  console.log(email.value, password.value);
}	
</script>

<template>
  <TheNav />

  <section>

    <div class="modal">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input type="email" placeholder="Email" id="email" v-model="email" required />
        <input type="password" placeholder="Password" id="password" v-model="password" required />
        <button class="primary-btn">Login</button>
      </form>
    </div>
  </section>

</template>

<style scoped>  
section {
  background-color: #FFF8EE;
  min-height: 90vh;

  display: grid;
  place-items: center;
}
.modal {
  width: 60%;
  max-width: 600px;
  padding: 2rem;

  background-color: #FFF;
  border: 2px solid var(--primary);
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;

  color: var(--dark-light);
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2.5rem;
}

input {
  padding: 1rem 1rem;
  border: 2px solid var(--primary);
  border-radius: 0.5rem;
  font-size: 1.1rem;
}

button {
  margin: 1rem 0;
  font-size: 1.1rem;
}
</style>