<script setup>
defineProps({
	title: { type: String, required: true },
	subtitle: { type: String, default: "" },
});
</script>

<template>
	<div class="auth">
		<aside class="brand">
			<NuxtLink to="/" class="logo">HTK</NuxtLink>
			<div class="brand-copy">
				<h2>Small habits, done daily.</h2>
				<p>Plan your day, tick off your habits and watch your streaks grow.</p>
			</div>
			<WaveLines />
		</aside>

		<header class="mobile-bar">
			<NuxtLink to="/" class="back" aria-label="Back to home">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
			</NuxtLink>
			<NuxtLink to="/" class="logo">HTK</NuxtLink>
			<span class="back-spacer"></span>
		</header>

		<main class="panel">
			<div class="panel-inner">
				<div class="heading">
					<h1>{{ title }}</h1>
					<p v-if="subtitle">{{ subtitle }}</p>
				</div>
				<slot />
			</div>
		</main>

		<WaveLines class="mobile-waves" flip />
	</div>
</template>

<style scoped>
.auth {
	min-height: 100vh;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
	background: #fff;
}

.logo {
	font-family: "Montserrat", sans-serif;
	font-weight: 700;
	font-size: 1.75rem;
	letter-spacing: 2px;
	color: var(--primary);
	text-decoration: none;
}

/* Left brand panel */
.brand {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 3rem 0;
	background: var(--light);
	border-right: 2px solid var(--primary);
}

.brand .logo {
	padding: 0 3rem;
	align-self: flex-start;
}

.brand-copy {
	padding: 0 3rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.brand-copy h2 {
	margin: 0;
	max-width: 26rem;
	font-family: "Montserrat", sans-serif;
	font-size: 2.25rem;
	font-weight: 600;
	line-height: 1.2;
}

.brand-copy p {
	margin: 0;
	max-width: 25rem;
	color: var(--muted);
	line-height: 1.6;
}

/* Right form panel */
.panel {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
}

.panel-inner {
	width: 100%;
	max-width: 24rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.heading {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.heading h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.75rem;
	font-weight: 600;
}

.heading p {
	margin: 0;
	color: var(--muted);
	font-size: 0.9rem;
}

.mobile-bar,
.auth .mobile-waves {
	display: none;
}

@media (max-width: 768px) {
	.auth {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1fr auto;
	}

	.brand {
		display: none;
	}

	.mobile-bar {
		height: 4rem;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2px solid var(--primary);
	}

	.mobile-bar .logo {
		font-size: 1.4rem;
	}

	.back,
	.back-spacer {
		width: 44px;
		height: 44px;
	}

	.back {
		display: grid;
		place-items: center;
		border-radius: 5px;
	}

	.back svg {
		width: 20px;
		height: 20px;
		fill: none;
		stroke: var(--dark);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.panel {
		align-items: flex-start;
		padding: 2rem 1.5rem;
	}

	.auth .mobile-waves {
		display: block;
	}
}
</style>
