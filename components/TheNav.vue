<template>
	<nav>
		<div class="logo" @click="$router.push('/')">
			<h1>HTK</h1>
		</div>
	</nav>
</template>

<style scoped>
nav {
	grid-column: span 2;
	grid-row: 1;

	position: fixed;

	width: 100%;
	height: 5rem;
	
	display: flex;
	justify-content: center;
	align-items: center;
	
	padding: 1rem 2rem;
	background: var(--light);
	border-bottom: 2px solid var(--primary);
	color: var(--white);

	z-index: 1000;
}

.logo {
  cursor: pointer;
}

.logo h1 {
	font-size: 2.5rem;
	font-family: "Montserrat", sans-serif;
	color: var(--primary);
	user-select: none;
	margin-left: 2.5rem;
}
</style>
