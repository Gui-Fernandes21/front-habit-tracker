<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
	useState("loading").value = true;
	errorMessage.value = "";

	const body = {
		email: email.value,
		password: password.value,
	};

	try {
		const { data, status, error } = await useService("/login", {
			method: "POST",
			body: JSON.stringify(body),
		});

		if (status.value !== "success" || !data.value) {
			errorMessage.value =
				error.value?.data?.message || "We couldn't log you in. Check your email and password.";
			return;
		}

		const { token } = data.value as { token: string };
		useCookie("auth-token").value = token;
		router.push("/dashboard");
	} catch (err) {
		console.error("An error occurred during login:", err);
		errorMessage.value = "Something went wrong. Please try again.";
	} finally {
		useState("loading").value = false;
	}
};
</script>

<template>
	<AuthShell title="Log in" subtitle="Welcome back.">
		<form class="form" @submit.prevent="login">
			<p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

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
					autocomplete="current-password"
					required
				/>
			</div>

			<button type="submit" class="btn btn-block">Log in</button>

			<p class="form-switch">
				New to HTK? <NuxtLink to="/signup">Create an account</NuxtLink>
			</p>
		</form>
	</AuthShell>
</template>
