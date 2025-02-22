<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const name = ref("");

const signup = async () => {
	// useState("loading").value = true;

	const body = {
		email: email.value,
		password: password.value,
		name: name.value,
	};

	try {
		const { data, status } = await useService("/signup", {
			method: "POST",
			body: JSON.stringify(body),
		});

		if (status.value !== "success") {
			return console.error("Signup failed:", data.message);
		}

		if (data.value) {
			const { token } = data.value;
			useCookie("auth-token").value = token;
			useState("loading").value = false;
			router.push("/dashboard");
		}
	} catch (error) {
		console.error("An error occurred during signup:", error);
	}
};
</script>

<template>
	<TheNav />

	<section>
		<div class="modal">
			<h1>Sign up</h1>
			<form @submit.prevent="signup">
				<input
					type="text"
					placeholder="Name"
					id="name"
					v-model="name"
					required
				/>
				<input
					type="email"
					placeholder="Email"
					id="email"
					v-model="email"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					id="password"
					v-model="password"
					required
				/>
				<button class="primary-btn">Sign up</button>
			</form>
		</div>
	</section>
</template>

<style scoped>
section {
	background-color: #fff8ee;
	min-height: 90vh;

	display: grid;
	place-items: center;
}
.modal {
	width: 60%;
	max-width: 600px;
	padding: 2rem;

	background-color: #fff;
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
