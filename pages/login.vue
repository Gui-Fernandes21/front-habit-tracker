<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();

const email = ref('');
const password = ref('');

const login = async () => {
	useState("loading").value = true;

	const body = {
		email: email.value,
		password: password.value,
	};
  
	try {
		const { data, status } = await useService("/login", {
			method: "POST",
			body: JSON.stringify(body),
		});

		if (status.value !== "success") {
			useState("loading").value = false;
			return console.error("Login failed:", data.value.message);
		}

		if (data.value) {
			const { token } = data.value;
			useCookie("auth-token").value = token;
			useState("loading").value = false;
			router.push("/dashboard");
		}
	} catch (error) {
		useState("loading").value = false;
		console.error("An error occurred during login:", error);
	}
};
</script>

<template>
  <TheNav />

  <section>

    <div class="modal">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input class="primary-input" type="email" placeholder="Email" id="email" v-model="email" required />
        <input class="primary-input" type="password" placeholder="Password" id="password" v-model="password" required />
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

button {
  margin: 1rem 0;
  font-size: 1.1rem;
}
</style>