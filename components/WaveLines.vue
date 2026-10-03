<script setup>
defineProps({
	// Mirror the waves vertically (used for the bottom edge of a page)
	flip: { type: Boolean, default: false },
});
</script>

<template>
	<svg
		class="waves"
		:class="{ flip }"
		viewBox="0 -12 1280 126"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
	>
		<path d="M0 40 C 160 0, 320 80, 480 40 S 800 0, 960 40 S 1180 80, 1280 40" stroke="#a3b18a" />
		<path d="M0 62 C 160 22, 320 102, 480 62 S 800 22, 960 62 S 1180 102, 1280 62" stroke="#d9cab3" />
	</svg>
</template>

<style scoped>
.waves {
	display: block;
	width: 100%;
	height: 90px;
}

.waves path {
	stroke-width: 2;
	vector-effect: non-scaling-stroke;
}

.flip {
	transform: scaleY(-1);
}

@media (max-width: 768px) {
	.waves {
		height: 64px;
	}
}
</style>
