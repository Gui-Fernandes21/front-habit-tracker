<template>
	<div class="app-shell">
		<SideNav />
		<main class="app-main">
			<slot />
		</main>
	</div>
</template>

<style scoped>
.app-shell {
	min-height: 100vh;
}

.app-main {
	margin-left: var(--sidenav-width);
	min-height: 100vh;
	box-sizing: border-box;
}

@media (max-width: 768px) {
	.app-main {
		margin-left: 0;
		padding-bottom: var(--tabbar-height);
	}
}
</style>
