<script setup>
import { ref } from "vue";

definePageMeta({
	middleware: "auth",
});

const loading = useState("loading");

const username = ref("");
const email = ref("");
const newPassword = ref("");
const currentPassword = ref("");

const profilePicUrl = ref("");

const clickUpload = () => {
	const fileInput = document.querySelector("input[type='file']");
	fileInput.click();
};

useService("/user-profile")
	.then(({ data }) => {
		const user = data.value.user;

		username.value = user.name;
		email.value = user.email;
		profilePicUrl.value = user.profilePicture;
	})
	.catch((error) => {
		console.error("LOG[useService]: Error fetching user data ->", error);
	})
	.finally(() => {
		loading.value = false;
	});

const captureFile = (event) => {
	const file = event.target.files[0];
	const oldPicture = profilePicUrl.value;
	profilePicUrl.value = URL.createObjectURL(file);

	const fReader = new FileReader();
	fReader.readAsDataURL(file);
	fReader.onloadend = (parsed) => (profilePicUrl.value = parsed.target.result);

	useService("/upload-profile-picture", {
		method: "POST",
		body: { path: profilePicUrl },
	})
		.then(({ data }) => {
			console.log(data.value.message);
		})
		.catch((error) => {
			profilePicUrl.value = oldPicture;
			console.error(
				"LOG[captureFile(event)]:Error uploading profile picture:",
				error
			);
		});
};

const updatePassword = () => {
	loading.value = true;

	const body = {
		currentPassword: currentPassword.value,
		newPassword: newPassword.value,
	};

	useService("/update-password", {
		method: "PATCH",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data.value.message);
		})
		.catch((error) => {
			console.error("Error updating password:", error);
		})
		.finally(() => {
			loading.value = false;
			currentPassword.value = "";
			newPassword.value = "";
		});
};

const updateDetails = () => {
	loading.value = true;

	const body = {
		name: username.value,
		email: email.value,
	};

	useService("/update-user-details", {
		method: "PATCH",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data.value.message);
		})
		.catch((error) => {
			console.error("Error updating user details:", error);
		})
		.finally(() => {
			loading.value = false;
		});
};

const deleteProfilePicture = () => {
	loading.value = true;

	useService("/delete-profile-picture", {
		method: "DELETE",
	})
		.then(({ data }) => {
			console.log(data.value.message);
			profilePicUrl.value = "";
		})
		.catch((error) => {
			console.error("Error deleting profile picture:", error);
		})
		.finally(() => {
			loading.value = false;
		});
}
</script>

<template>
	<section class="preferences">
		<TheNav />
		<SideNav />
		<div class="content">
			<h1>User Settings</h1>
			<section class="picture">
				<div class="profile-container">
					<img :src="profilePicUrl || 'img/unknown-profile.jpg'" alt="Profile Picture" />
					<input type="file" class="input-file" @input="captureFile" accept=".png, .jpg, .jpeg" />
				</div>
				<div class="buttons-container">
					<button class="primary-btn btn-custom btn-custom-2" @click="clickUpload">Upload</button>
					<button class="accent-btn outline btn-custom btn-custom-2" @click="deleteProfilePicture">Delete</button>
				</div>
			</section>

			<section class="user-details">
				<h2>Update user details</h2>
				<div class="input-area">
					<input
						class="primary-input-form input-form"
						type="text"
						placeholder="Username"
						v-model="username"
					/>
					<input
						class="primary-input-form input-form"
						type="email"
						placeholder="Email"
						v-model="email"
					/>
				</div>
				<div class="action">
					<button class="primary-btn btn-custom" @click="updateDetails">
						Update details
					</button>
				</div>
			</section>
			<section class="password">
				<h2>Change password</h2>
				<div class="input-area">
					<input
						class="primary-input-form input-form"
						type="password"
						placeholder="Current password"
						v-model="currentPassword"
					/>
					<input
						class="primary-input-form input-form"
						type="password"
						placeholder="New password"
						v-model="newPassword"
					/>
				</div>
				<div class="action">
					<button class="primary-btn btn-custom" @click="updatePassword">
						Update password
					</button>
				</div>
			</section>
		</div>
	</section>
</template>

<style scoped>
.preferences {
	display: grid;

	grid-template-columns: 4rem calc(100% - 4rem);
	grid-template-rows: 5rem 1fr;

	height: 100%;
}

ul {
	list-style: none;
}

.content {
	grid-column: 2;
	grid-row: 2;

	font-family: "Open Sans", sans-serif;

	margin: 1rem;
	padding: 1rem;
	width: 85%;
	justify-self: center;
}

h1 {
	font-family: "Montserrat", sans-serif;
	font-size: 1.3rem;
  	font-weight: 500;
	margin-bottom: 1rem;
}

.content section {
	padding: 1rem 3rem;
	margin: 2rem 0;

	border: 2px solid var(--primary);
	border-radius: 5px;
	font-family: "Montserrat", sans-serif;

	h2 {
		font-size: 1rem;
		font-weight: 500;
		color: var(--dark-light);
		margin-bottom: 1rem;
	}
}

.picture {
	display: grid;
	grid-template-columns: 1fr 1fr;
	align-items: center;
	width: 100%;
	gap: 1rem;
}

.profile-container {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.profile-container img {
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	border: 1px solid var(--primary);
}

.buttons-container {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
}

.input-file {
	display: none;
}

.input-area {
	margin: 2rem 0;
	display: flex;
	gap: 2rem;

	input {
		width: 100%;
	}
}

.action {
	display: flex;
	justify-content: end;

	button {
		width: 15rem;
	}
}

.btn-custom {
	width: 19% !important;
	padding: 0.4rem 0;
	font-size: 0.7rem;
}

.btn-custom-2 {
	width: 40% !important;
}

.input-form {
	padding: 0.5rem 1rem;
}
</style>
