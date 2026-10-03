<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const name = ref("");
const errorMessage = ref("");

const signup = async () => {
	useState("loading").value = true;
	errorMessage.value = "";

	const body = {
		email: email.value,
		password: password.value,
		name: name.value,
	};

	try {
		const { data, status, error } = await useService("/signup", {
			method: "POST",
			body: JSON.stringify(body),
		});

		if (status.value !== "success" || !data.value) {
			errorMessage.value =
				error.value?.data?.message || "We couldn't create your account. Please try again.";
			return;
		}

		const { token } = data.value;
		useCookie("auth-token").value = token;
		router.push("/dashboard");
	} catch (err) {
		console.error("An error occurred during signup:", err);
		errorMessage.value = "Something went wrong. Please try again.";
	} finally {
		useState("loading").value = false;
	}
};
</script>

<template>
	<AuthShell title="Create your account" subtitle="It takes less than a minute.">
		<form class="form" @submit.prevent="signup">
			<p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

			<div class="form-field">
				<label class="form-label" for="name">Name</label>
				<input
					id="name"
					v-model="name"
					class="form-input"
					type="text"
					placeholder="Your name"
					autocomplete="name"
					required
				/>
			</div>

			<div class="form-field">
				<label class="form-label" for="email">Email</label>
				<input
					id="email"
					v-model="email"
					class="form-input"
					type="email"
					placeholder="you@example.com"
					autocomplete="email"
					required
				/>
			</div>

			<div class="form-field">
				<label class="form-label" for="password">Password</label>
				<input
					id="password"
					v-model="password"
					class="form-input"
					type="password"
					autocomplete="new-password"
					required
				/>
			</div>

			<button type="submit" class="btn btn-block">Sign up</button>

			<p class="form-switch">
				Already have an account? <NuxtLink to="/login">Log in</NuxtLink>
			</p>
		</form>
	</AuthShell>
</template>
