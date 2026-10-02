<script setup>
const { logout } = useAuth();

const links = [
	{ to: "/dashboard", label: "Today", icon: "home" },
	{ to: "/insights", label: "Insights", icon: "chart" },
	{ to: "/explore", label: "Explore", icon: "compass" },
];
</script>

<template>
	<nav class="sidenav" aria-label="Main">
		<div class="group">
			<NuxtLink to="/" class="logo" aria-label="HTK home">HTK</NuxtLink>
			<div class="links">
				<NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="nav-item">
					<svg v-if="link.icon === 'home'" class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3 11l9-8 9 8" />
						<path d="M5 10v10h14V10" />
					</svg>
					<svg v-else-if="link.icon === 'chart'" class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3 20h18" />
						<path d="M7 16v-5" />
						<path d="M12 16V6" />
						<path d="M17 16v-8" />
					</svg>
					<svg v-else class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="12" cy="12" r="9" />
						<path d="M15.5 8.5l-2 5-5 2 2-5z" />
					</svg>
					<span>{{ link.label }}</span>
				</NuxtLink>
			</div>
		</div>

		<div class="group bottom">
			<NuxtLink to="/preferences" class="nav-item">
				<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="12" r="3" />
					<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
				</svg>
				<span>Settings</span>
			</NuxtLink>
			<button type="button" class="nav-item" @click="logout">
				<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
					<path d="M16 17l5-5-5-5" />
					<path d="M21 12H9" />
				</svg>
				<span>Log out</span>
			</button>
		</div>
	</nav>
</template>

<style scoped>
.sidenav {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 100;

	width: var(--sidenav-width);
	padding: 1.5rem 0;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;

	background: var(--light);
	border-right: 2px solid var(--primary);
}

.group,
.links {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.group {
	gap: 1.75rem;
}

.bottom {
	gap: 0.5rem;
}

.logo {
	font-family: "Montserrat", sans-serif;
	font-weight: 700;
	font-size: 1.4rem;
	letter-spacing: 2px;
	color: var(--primary);
	text-decoration: none;
}

.nav-item {
	width: 4rem;
	padding: 0.5rem 0;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;

	border: 0;
	border-radius: 8px;
	background: transparent;
	color: var(--dark);
	text-decoration: none;
	font-family: "Open Sans", sans-serif;
	font-size: 0.7rem;
	font-weight: 600;
	cursor: pointer;
}

.nav-item:hover {
	background: var(--primary-soft);
}

.nav-item.router-link-active {
	background: var(--primary-dark);
	color: #fff;
}

.nav-item:focus-visible {
	outline: 2px solid var(--primary-dark);
	outline-offset: 2px;
}

.icon {
	width: 1.25rem;
	height: 1.25rem;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

/* Phones: the sidebar becomes a bottom tab bar */
@media (max-width: 768px) {
	.sidenav {
		top: auto;
		right: 0;
		width: auto;
		height: var(--tabbar-height);
		padding: 0 0.5rem;

		flex-direction: row;
		justify-content: space-around;

		border-right: 0;
		border-top: 2px solid var(--primary);
	}

	.group,
	.links,
	.bottom {
		flex-direction: row;
		flex: 1;
		justify-content: space-around;
		gap: 0;
	}

	.group:not(.bottom) {
		flex: 3;
	}

	.logo {
		display: none;
	}

	.nav-item {
		width: auto;
		flex: 1;
		min-height: 44px;
	}

	.nav-item.router-link-active {
		background: transparent;
		color: var(--primary-dark);
	}
}
</style>
