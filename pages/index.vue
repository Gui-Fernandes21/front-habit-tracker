<script setup>
const { isLoggedIn, logout } = useAuth();
</script>

<template>
	<section class="landing">
		<WaveLines />

		<div class="hero">
			<div class="wordmark">
				<h1>HTK</h1>
				<p class="name">Habit Tracker</p>
			</div>
			<p class="tagline">Plan your day, tick off your habits, watch your streaks grow.</p>

			<div v-if="!isLoggedIn" class="actions">
				<NuxtLink class="btn" to="/login">Log in</NuxtLink>
				<NuxtLink class="btn btn-outline" to="/signup">Sign up</NuxtLink>
			</div>
			<div v-else class="actions">
				<NuxtLink class="btn" to="/dashboard">Go to today</NuxtLink>
				<button type="button" class="btn btn-outline" @click="logout">
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<path d="M16 17l5-5-5-5" />
						<path d="M21 12H9" />
					</svg>
					Log out
				</button>
			</div>
		</div>

		<WaveLines flip />
	</section>
</template>

<style scoped>
.landing {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #fff;
	color: var(--dark);
	font-family: "Open Sans", sans-serif;
	overflow: hidden;
}

.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.75rem;
	padding: 2rem 1.5rem;
	text-align: center;
}

.wordmark {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
}

h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-weight: 700;
	font-size: 8rem;
	line-height: 1;
	letter-spacing: 4px;
	color: var(--primary);
}

.name {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.35rem;
	font-weight: 500;
	letter-spacing: 6px;
	text-transform: uppercase;
}

.tagline {
	margin: 0;
	max-width: 30rem;
	color: var(--muted);
	line-height: 1.6;
}

.actions {
	display: flex;
	gap: 1rem;
}

.icon {
	width: 16px;
	height: 16px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

@media (max-width: 768px) {
	h1 {
		font-size: 5.5rem;
		letter-spacing: 3px;
	}

	.name {
		font-size: 1rem;
		letter-spacing: 5px;
	}

	.actions {
		flex-direction: column;
		width: 100%;
		max-width: 22rem;
	}

	.actions .btn {
		min-height: 48px;
	}
}
</style>
