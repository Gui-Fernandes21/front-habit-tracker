<template>
	<section>
		<img src="/svg/hz-waves.svg" alt="horizontal waves on the screen" />
		<div>
			<h1>HTK</h1>
			<span>Habit Tracker</span>
      <div class="actions">
        <nuxt-link class="primary-btn" to="/login">Login</nuxt-link>
        <nuxt-link class="accent-btn" to="/signup">Sign Up</nuxt-link>
      </div>
		</div>
		<img src="/svg/hz-waves.svg" alt="horizontal waves on the screen" />
	</section>
</template>

<style scoped>
section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
  height: 100vh;
}

div {
  position: relative;
  text-align: center;
}

img {
	width: 100%;
	height: auto;
}

h1 {
  color: var(--primary);
	font-size: 7rem;
	font-family: "Montserrat", sans-serif;
}

span {
  position: absolute;
  bottom: 4rem;
  right: 25%;

  font-family: "Open Sans", sans-serif;
  font-size: 1.5rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

a {
  text-decoration: none;
}
</style>
