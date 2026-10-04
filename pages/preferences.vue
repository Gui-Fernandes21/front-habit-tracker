<script setup>
import { ref, computed } from "vue";

definePageMeta({
	layout: "app",
	middleware: "auth",
});

const loading = useState("loading");
const { logout } = useAuth();

const username = ref("");
const email = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const profilePicUrl = ref("");
const fileInput = ref(null);

// One message per card: { type: "success" | "error", text }
const photoStatus = ref(null);
const detailsStatus = ref(null);
const passwordStatus = ref(null);

const initial = computed(() => (username.value || "?").trim().charAt(0).toUpperCase());

const messageFrom = (result, fallback) => result.error.value?.data?.message || fallback;

// ===============================================================================
// ==============================LOAD=============================================
// ===============================================================================
const { data: profile, error: profileError } = await useService("/user-profile");
if (profile.value?.user) {
	username.value = profile.value.user.name || "";
	email.value = profile.value.user.email || "";
	profilePicUrl.value = profile.value.user.profilePicture || "";
} else if (profileError.value) {
	console.error("LOG[useService]: Error fetching user data ->", profileError.value);
	detailsStatus.value = { type: "error", text: "We couldn't load your details. Refresh to try again." };
}
loading.value = false;

// ===============================================================================
// ==============================PHOTO============================================
// ===============================================================================
const readAsDataUrl = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const uploadPhoto = async (event) => {
	const file = event.target.files?.[0];
	event.target.value = "";
	if (!file) return;

	if (file.size > MAX_PHOTO_BYTES) {
		photoStatus.value = { type: "error", text: "That image is over 2 MB. Please pick a smaller one." };
		return;
	}

	const previous = profilePicUrl.value;
	loading.value = true;
	try {
		const dataUrl = await readAsDataUrl(file);
		profilePicUrl.value = dataUrl;
		const result = await useService("/upload-profile-picture", {
			method: "POST",
			body: { path: dataUrl },
		});
		if (result.error.value) throw new Error(messageFrom(result, "Upload failed."));
		photoStatus.value = { type: "success", text: "Photo updated." };
	} catch (err) {
		console.error("LOG[uploadPhoto]: Error uploading profile picture:", err);
		profilePicUrl.value = previous;
		photoStatus.value = { type: "error", text: "We couldn't upload that photo. Please try again." };
	} finally {
		loading.value = false;
	}
};

const removePhoto = async () => {
	loading.value = true;
	const result = await useService("/delete-profile-picture", { method: "DELETE" });
	if (result.error.value) {
		console.error("Error deleting profile picture:", result.error.value);
		photoStatus.value = { type: "error", text: messageFrom(result, "We couldn't remove your photo.") };
	} else {
		profilePicUrl.value = "";
		photoStatus.value = { type: "success", text: "Photo removed." };
	}
	loading.value = false;
};

// ===============================================================================
// ==============================DETAILS + PASSWORD===============================
// ===============================================================================
const updateDetails = async () => {
	loading.value = true;
	const result = await useService("/update-user-details", {
		method: "PATCH",
		body: JSON.stringify({ name: username.value, email: email.value }),
	});
	detailsStatus.value = result.error.value
		? { type: "error", text: messageFrom(result, "We couldn't save your details.") }
		: { type: "success", text: "Details saved." };
	loading.value = false;
};

const updatePassword = async () => {
	loading.value = true;
	const result = await useService("/update-password", {
		method: "PATCH",
		body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value }),
	});
	passwordStatus.value = result.error.value
		? { type: "error", text: messageFrom(result, "We couldn't change your password.") }
		: { type: "success", text: "Password updated." };
	currentPassword.value = "";
	newPassword.value = "";
	loading.value = false;
};
</script>

<template>
	<section class="settings">
		<h1>Settings</h1>

		<div class="columns">
			<div class="column">
				<section class="card photo-card" aria-labelledby="photo-title">
					<h2 id="photo-title">Profile photo</h2>
					<div class="photo-row">
						<div class="avatar">
							<img v-if="profilePicUrl" :src="profilePicUrl" alt="Your profile photo" />
							<span v-else aria-hidden="true">{{ initial }}</span>
						</div>
						<div class="photo-actions">
							<span class="form-hint">PNG or JPG, up to 2 MB</span>
							<div class="button-row">
								<button type="button" class="btn" @click="fileInput.click()">Upload</button>
								<button v-if="profilePicUrl" type="button" class="btn btn-sand" @click="removePhoto">Remove</button>
							</div>
						</div>
					</div>
					<input
						ref="fileInput"
						class="visually-hidden"
						type="file"
						accept=".png,.jpg,.jpeg"
						tabindex="-1"
						aria-hidden="true"
						@change="uploadPhoto"
					/>
					<p v-if="photoStatus" :class="['status', photoStatus.type]" role="status">{{ photoStatus.text }}</p>
				</section>

				<section class="card session-card" aria-labelledby="session-title">
					<h2 id="session-title">Session</h2>
					<p class="muted">You're logged in as {{ email || username }}.</p>
					<button type="button" class="btn btn-sand" @click="logout">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<path d="M16 17l5-5-5-5" />
							<path d="M21 12H9" />
						</svg>
						Log out
					</button>
				</section>
			</div>

			<div class="column">
				<form class="card" aria-labelledby="details-title" @submit.prevent="updateDetails">
					<h2 id="details-title">Account details</h2>
					<div class="two-col">
						<div class="form-field">
							<label class="form-label" for="settings-name">Name</label>
							<input id="settings-name" v-model="username" class="form-input" type="text" autocomplete="name" required />
						</div>
						<div class="form-field">
							<label class="form-label" for="settings-email">Email</label>
							<input id="settings-email" v-model="email" class="form-input" type="email" autocomplete="email" required />
						</div>
					</div>
					<p v-if="detailsStatus" :class="['status', detailsStatus.type]" role="status">{{ detailsStatus.text }}</p>
					<div><button type="submit" class="btn">Save changes</button></div>
				</form>

				<form class="card" aria-labelledby="password-title" @submit.prevent="updatePassword">
					<h2 id="password-title">Password</h2>
					<div class="two-col">
						<div class="form-field">
							<label class="form-label" for="current-password">Current password</label>
							<input
								id="current-password"
								v-model="currentPassword"
								class="form-input"
								type="password"
								autocomplete="current-password"
								required
							/>
						</div>
						<div class="form-field">
							<label class="form-label" for="new-password">New password</label>
							<input
								id="new-password"
								v-model="newPassword"
								class="form-input"
								type="password"
								autocomplete="new-password"
								required
							/>
						</div>
					</div>
					<p v-if="passwordStatus" :class="['status', passwordStatus.type]" role="status">{{ passwordStatus.text }}</p>
					<div><button type="submit" class="btn btn-outline">Update password</button></div>
				</form>
			</div>
		</div>
	</section>
</template>

<style scoped>
.settings {
	max-width: 70rem;
	padding: 2rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
}

h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.9rem;
	font-weight: 600;
}

h2 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
}

.columns {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
	gap: 1.5rem;
	align-items: start;
}

.column {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1.5rem;
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	background: #fff;
}

.photo-row {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	text-align: center;
}

.photo-actions {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
}

.avatar {
	width: 7rem;
	height: 7rem;
	flex-shrink: 0;
	border-radius: 50%;
	overflow: hidden;
	display: grid;
	place-items: center;
	background: var(--accent);
	font: 600 2.5rem "Montserrat", sans-serif;
}

.avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.button-row {
	display: flex;
	gap: 0.6rem;
	flex-wrap: wrap;
}

.btn-sand {
	border-color: var(--accent);
	background: transparent;
	color: var(--dark);
}

.btn-sand:hover {
	border-color: var(--accent);
	background: var(--accent-soft);
}

.btn svg {
	width: 16px;
	height: 16px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.session-card .btn {
	align-self: flex-start;
}

.muted {
	margin: 0;
	font-size: 0.85rem;
	color: var(--muted);
	overflow-wrap: anywhere;
}

.two-col {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.status {
	margin: 0;
	padding: 0.6rem 0.8rem;
	border-radius: 8px;
	font-size: 0.85rem;
}

.status.success {
	border: 2px solid var(--primary);
	background: #f3f5ef;
	color: var(--primary-dark);
}

.status.error {
	border: 2px solid var(--accent);
	background: var(--accent-soft);
	color: #6b4a2f;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

@media (max-width: 1024px) {
	.columns {
		grid-template-columns: minmax(0, 1fr);
	}

	.photo-row {
		flex-direction: row;
		text-align: left;
	}

	.photo-actions {
		align-items: flex-start;
	}
}

@media (max-width: 768px) {
	.settings {
		padding: 1rem 1.25rem 2rem;
		gap: 1rem;
	}

	h1 {
		font-size: 1.4rem;
	}

	.columns,
	.column {
		gap: 1rem;
	}

	.card {
		padding: 1rem;
		gap: 0.85rem;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		font-size: 1.5rem;
	}

	.two-col {
		grid-template-columns: minmax(0, 1fr);
	}

	.card .btn {
		width: 100%;
	}

	.photo-actions .button-row .btn {
		width: auto;
		min-height: 40px;
		padding: 0 1rem;
	}
}
</style>
