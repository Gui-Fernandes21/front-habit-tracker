<script setup>
import { ref } from "vue";

definePageMeta({
	middleware: "auth",
});

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
		useState("loading").value = false;
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
			console.log(data);
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
	useState("loading").value = true;

	const body = {
		currentPassword: currentPassword.value,
		newPassword: newPassword.value,
	};

	useService("/update-password", {
		method: "PATCH",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data); 
		})
		.catch((error) => {
			console.error("Error updating password:", error);
		})
		.finally(() => {
			useState("loading").value = false;
			currentPassword.value = "";
			newPassword.value = "";
		});
};

const updateDetails = () => {
	useState("loading").value = true;

	const body = {
		name: username.value,
		email: email.value,
	};

	useService("/update-user-details", {
		method: "PATCH",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error updating user details:", error);
		})
		.finally(() => {
			useState("loading").value = false;
		});
};
</script>

<template>
	<section class="preferences">
		<TheNav />
		<SideNav />
		<div class="content">
			<h1>User Settings</h1>
			<section class="picture">
				<img
					:src="profilePicUrl || 'img/unknown-profile.jpg'"
					alt="Profile Picture"
					accept=".png, .jpg, .jpeg"
				/>
				<input type="file" class="input-file" @input="captureFile" capture />
				<button class="primary-btn" @click="clickUpload">Upload</button>
				<button class="accent-btn outline" @click="deleteProfilePicture">
					Delete
				</button>
			</section>
			<section class="user-details">
				<h2>Update User Details</h2>
				<div class="input-area">
					<input
						class="primary-input"
						type="text"
						placeholder="Username"
						v-model="username"
					/>
					<input
						class="primary-input"
						type="email"
						placeholder="Email"
						v-model="email"
					/>
				</div>
				<div class="action">
					<button class="primary-btn" @click="updateDetails">
						Update Details
					</button>
				</div>
			</section>
			<section class="password">
				<h2>Change Password</h2>
				<div class="input-area">
					<input
						class="primary-input"
						type="password"
						placeholder="Current Password"
						v-model="currentPassword"
					/>
					<input
						class="primary-input"
						type="password"
						placeholder="New Password"
						v-model="newPassword"
					/>
				</div>
				<div class="action">
					<button class="primary-btn" @click="updatePassword">
						Update Password
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
}

h1 {
	font-family: "Montserrat", sans-serif;
	font-size: 2rem;
	font-weight: 400;
	color: var(--dark-light);

	margin-bottom: 1rem;
}

.content section {
	padding: 0.5rem;
	margin: 2rem 0;

	border: 2px solid var(--primary);
	border-radius: 5px;
	font-family: "Montserrat", sans-serif;

	h2 {
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--dark-light);
		margin-bottom: 1rem;
	}
}

.picture {
	width: 100%;

	display: flex;
	align-items: center;
	gap: 1rem;

	img {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		border: 1px solid var(--primary);
	}
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
</style>
