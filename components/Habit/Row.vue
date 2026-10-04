<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
	habit: { type: Object, required: true },
	streak: { type: Number, default: 0 },
});

const emit = defineEmits(["set-status", "edit", "delete"]);

const menuOpen = ref(false);
const menuRoot = ref(null);

const status = computed(() => props.habit.status);
const time = computed(
	() => `${String(props.habit.hour).padStart(2, "0")}:${String(props.habit.minute).padStart(2, "0")}`
);
const streakLabel = computed(() => `${props.streak} ${props.streak === 1 ? "day" : "days"}`);

const setStatus = (value) => emit("set-status", { ...props.habit, status: value });

const choose = (action) => {
	menuOpen.value = false;
	emit(action, props.habit);
};

const onDocumentClick = (event) => {
	if (menuOpen.value && menuRoot.value && !menuRoot.value.contains(event.target)) {
		menuOpen.value = false;
	}
};
onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));
</script>

<template>
	<li :class="['row', status.toLowerCase()]">
		<span class="time">{{ time }}</span>

		<div class="main">
			<div class="title-line">
				<span class="name">{{ habit.name }}</span>
				<span v-if="status === 'DONE'" class="tag tag-done">Done</span>
				<span v-else-if="status === 'SKIP'" class="tag tag-skip">Skipped</span>
			</div>
			<span v-if="habit.description" class="description">{{ habit.description }}</span>
		</div>

		<span v-if="streak > 0 && status !== 'SKIP'" class="streak" :title="`${streakLabel} in a row`">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z" />
			</svg>
			{{ streakLabel }}
		</span>

		<div class="actions">
			<button
				v-if="status === 'DONE'"
				type="button"
				class="icon-btn is-done"
				aria-label="Done. Mark as to do"
				@click="setStatus('TODO')"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
			</button>
			<template v-else-if="status === 'TODO'">
				<button type="button" class="icon-btn do" aria-label="Mark as done" @click="setStatus('DONE')">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
				</button>
				<button type="button" class="icon-btn skip" aria-label="Skip today" @click="setStatus('SKIP')">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l7 7-7 7" /><path d="M13 5l7 7-7 7" /></svg>
				</button>
			</template>
			<button v-else type="button" class="icon-btn skip" aria-label="Undo skip" @click="setStatus('TODO')">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14l-4-4 4-4" /><path d="M5 10h9a5 5 0 0 1 0 10h-2" /></svg>
			</button>

			<div ref="menuRoot" class="menu-root">
				<button
					type="button"
					class="icon-btn"
					aria-label="More options"
					aria-haspopup="menu"
					:aria-expanded="menuOpen"
					@click="menuOpen = !menuOpen"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" class="dots">
						<circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
					</svg>
				</button>
				<ul v-if="menuOpen" class="menu" role="menu">
					<li role="none"><button type="button" role="menuitem" @click="choose('edit')">Edit</button></li>
					<li role="none"><button type="button" role="menuitem" class="danger" @click="choose('delete')">Delete</button></li>
				</ul>
			</div>
		</div>
	</li>
</template>

<style scoped>
.row {
	display: flex;
	align-items: center;
	gap: 1.25rem;
	padding: 0.85rem 1rem;
	border: 2px solid var(--dark-light-1);
	border-radius: 8px;
	background: #fff;
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
	text-align: left;
}

.row.done {
	border-color: var(--primary);
	background: #f3f5ef;
}

.row.skip {
	border-color: var(--accent);
	background: var(--accent-soft);
}

.time {
	width: 3.25rem;
	flex-shrink: 0;
	font: 600 0.95rem "Montserrat", sans-serif;
}

.done .time {
	color: var(--primary-dark);
}

.skip .time,
.skip .name {
	color: var(--muted);
}

.main {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
}

.title-line {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	flex-wrap: wrap;
}

.name {
	font-weight: 600;
	font-size: 0.95rem;
}

.description {
	font-size: 0.8rem;
	color: var(--muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tag {
	padding: 0.1rem 0.5rem;
	border-radius: 999px;
	font-size: 0.7rem;
	font-weight: 600;
}

.tag-done {
	background: var(--primary-dark);
	color: #fff;
}

.tag-skip {
	background: var(--accent);
	color: var(--dark);
}

.streak {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	flex-shrink: 0;
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--muted);
}

.done .streak {
	color: var(--primary-dark);
}

.streak svg {
	width: 16px;
	height: 16px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linejoin: round;
}

.actions {
	display: flex;
	gap: 0.5rem;
	flex-shrink: 0;
}

.icon-btn {
	width: 44px;
	height: 44px;
	display: grid;
	place-items: center;
	padding: 0;
	border: 2px solid var(--dark-light-1);
	border-radius: 5px;
	background: #fff;
	cursor: pointer;
}

.icon-btn svg {
	width: 18px;
	height: 18px;
	fill: none;
	stroke: var(--dark);
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.icon-btn svg.dots {
	fill: var(--dark);
	stroke: none;
}

.icon-btn.do {
	border-color: var(--primary-dark);
}

.icon-btn.do svg {
	stroke: var(--primary-dark);
	stroke-width: 2.5;
}

.icon-btn.do:hover {
	background: var(--primary-soft);
}

.icon-btn.is-done {
	border-color: var(--primary-dark);
	background: var(--primary-dark);
}

.icon-btn.is-done svg {
	stroke: #fff;
	stroke-width: 2.5;
}

.icon-btn.skip {
	border-color: var(--accent);
}

.icon-btn.skip svg {
	stroke: #8a7655;
}

.icon-btn.skip:hover {
	background: var(--accent-soft);
}

.icon-btn:focus-visible,
.menu button:focus-visible {
	outline: 2px solid var(--primary-dark);
	outline-offset: 2px;
}

.menu-root {
	position: relative;
}

.menu {
	position: absolute;
	right: 0;
	top: calc(100% + 0.4rem);
	z-index: 20;
	min-width: 9rem;
	margin: 0;
	padding: 0.35rem;
	list-style: none;
	background: #fff;
	border: 2px solid var(--primary);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.menu button {
	width: 100%;
	min-height: 40px;
	padding: 0 0.75rem;
	border: 0;
	border-radius: 5px;
	background: transparent;
	text-align: left;
	font: 0.9rem "Open Sans", sans-serif;
	color: var(--dark);
	cursor: pointer;
}

.menu button:hover {
	background: var(--primary-soft);
}

.menu .danger {
	color: #8a4a3a;
}

@media (max-width: 768px) {
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			"time actions"
			"main actions"
			"streak actions";
		gap: 0.15rem 0.75rem;
		padding: 0.75rem;
	}

	.time {
		grid-area: time;
		width: auto;
		font-size: 0.8rem;
	}

	.main {
		grid-area: main;
	}

	.streak {
		grid-area: streak;
		margin-top: 0.15rem;
		font-size: 0.75rem;
	}

	.actions {
		grid-area: actions;
		align-self: center;
	}
}
</style>
