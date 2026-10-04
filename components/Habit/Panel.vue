<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
	open: { type: Boolean, default: false },
	// The habit being edited, or null to create a new one
	habit: { type: Object, default: null },
	defaultDate: { type: String, default: () => localDayKey() },
});

const emit = defineEmits(["close", "save", "delete"]);

const isEdit = computed(() => Boolean(props.habit?._id));

const name = ref("");
const time = ref("07:00");
const startDate = ref("");
const description = ref("");
const error = ref("");

const reset = () => {
	const h = props.habit;
	name.value = h?.name || "";
	time.value = h ? `${String(h.hour).padStart(2, "0")}:${String(h.minute).padStart(2, "0")}` : "07:00";
	startDate.value = h?.startDate ? habitDayKey(h.startDate) : props.defaultDate;
	description.value = h?.description || "";
	error.value = "";
};

watch(() => props.open, (isOpen) => isOpen && reset(), { immediate: true });

const submit = () => {
	if (!name.value.trim() || !time.value || !startDate.value) {
		error.value = "Add a name, a time and a start date.";
		return;
	}
	const [hour, minute] = time.value.split(":");
	emit("save", {
		...(props.habit || {}),
		name: name.value.trim(),
		description: description.value.trim(),
		hour,
		minute,
		startDate: startDate.value,
		status: props.habit?.status || "TODO",
		goal: props.habit?.goal ?? 1,
		repeat: props.habit?.repeat || "Daily",
	});
};

const onKey = (event) => {
	if (props.open && event.key === "Escape") emit("close");
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
	<Teleport to="body">
		<div v-if="open" class="overlay" @click.self="emit('close')">
			<aside class="panel" role="dialog" aria-modal="true" aria-labelledby="habit-panel-title">
				<span class="handle" aria-hidden="true"></span>
				<header class="panel-head">
					<h2 id="habit-panel-title">{{ isEdit ? "Edit habit" : "New habit" }}</h2>
					<button type="button" class="icon-btn" aria-label="Close" @click="emit('close')">
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
					</button>
				</header>

				<form id="habit-form" class="form panel-body" @submit.prevent="submit">
					<p v-if="error" class="form-error" role="alert">{{ error }}</p>

					<div class="form-field">
						<label class="form-label" for="habit-name">Name</label>
						<input
							id="habit-name"
							v-model="name"
							class="form-input"
							type="text"
							placeholder="e.g. Morning run"
							required
						/>
					</div>

					<div class="two-col">
						<div class="form-field">
							<label class="form-label" for="habit-time">Time</label>
							<input id="habit-time" v-model="time" class="form-input" type="time" required />
						</div>
						<div class="form-field">
							<label class="form-label" for="habit-date">Start date</label>
							<input id="habit-date" v-model="startDate" class="form-input" type="date" required />
						</div>
					</div>

					<div class="form-field">
						<label class="form-label" for="habit-description">
							Description <span class="optional">(optional)</span>
						</label>
						<textarea
							id="habit-description"
							v-model="description"
							class="form-input textarea"
							rows="4"
							placeholder="A note to your future self"
						></textarea>
					</div>

					<button v-if="isEdit" type="button" class="delete-link" @click="emit('delete', habit)">
						Delete habit
					</button>
				</form>

				<footer class="panel-foot">
					<button type="button" class="btn btn-outline" @click="emit('close')">Cancel</button>
					<button type="submit" form="habit-form" class="btn">Save habit</button>
				</footer>
			</aside>
		</div>
	</Teleport>
</template>

<style scoped>
.overlay {
	position: fixed;
	inset: 0;
	z-index: 500;
	background: rgba(51, 51, 51, 0.45);
}

.panel {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: min(440px, 100%);
	display: flex;
	flex-direction: column;
	background: #fff;
	border-left: 2px solid var(--primary);
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
}

.handle {
	display: none;
}

.panel-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.25rem 1.75rem;
	border-bottom: 2px solid var(--light);
}

.panel-head h2 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.35rem;
	font-weight: 600;
}

.icon-btn {
	width: 44px;
	height: 44px;
	display: grid;
	place-items: center;
	border: 0;
	border-radius: 5px;
	background: transparent;
	cursor: pointer;
}

.icon-btn:hover {
	background: var(--light);
}

.icon-btn svg {
	width: 20px;
	height: 20px;
	fill: none;
	stroke: var(--dark);
	stroke-width: 2;
	stroke-linecap: round;
}

.panel-body {
	flex: 1;
	overflow-y: auto;
	padding: 1.5rem 1.75rem;
}

.two-col {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.textarea {
	min-height: 7rem;
	padding: 0.6rem 0.8rem;
	resize: vertical;
}

.optional {
	font-weight: 400;
	color: var(--muted);
}

.delete-link {
	align-self: flex-start;
	padding: 0.5rem 0;
	border: 0;
	background: transparent;
	font: 600 0.9rem "Open Sans", sans-serif;
	color: #8a4a3a;
	cursor: pointer;
}

.delete-link:hover {
	text-decoration: underline;
}

.panel-foot {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	padding: 1.25rem 1.75rem;
	border-top: 2px solid var(--light);
}

/* Phones: bottom sheet */
@media (max-width: 768px) {
	.panel {
		top: auto;
		left: 0;
		width: 100%;
		max-height: 88vh;
		border-left: 0;
		border-top: 2px solid var(--primary);
		border-radius: 16px 16px 0 0;
	}

	.handle {
		display: block;
		width: 40px;
		height: 4px;
		margin: 10px auto 0;
		border-radius: 2px;
		background: var(--dark-light-1);
	}

	.panel-head,
	.panel-body {
		padding-left: 1.25rem;
		padding-right: 1.25rem;
	}

	.panel-head {
		padding-top: 0.5rem;
		padding-bottom: 0.75rem;
	}

	.panel-foot {
		padding: 1rem 1.25rem 1.5rem;
	}

	.panel-foot .btn {
		flex: 1;
	}
}
</style>
