<script setup>
import { ref } from "vue";

definePageMeta({
	middleware: "auth",
});

const username = ref("");
const email = ref("");
const newPassword = ref("");
const oldPassword = ref("");

const profilePicUrl = ref("");

const clickUpload = () => {
	const fileInput = document.querySelector("input[type='file']");
	fileInput.click();
};

useService("/user-profile")
	.then(({ data }) => {
		console.log(data);
	})
	.catch((error) => {
		console.error("Error fetching user data:", error);
	})
	.finally(() => {
		useState("loading").value = false;
	});

const captureFile = (event) => {
	const file = event.target.files[0];
	const formData = new FormData();
	formData.append("file", file);

	useService("/upload-profile-picture", {
		method: "POST",
		body: formData,
	})
		.then(({ data }) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error uploading profile picture:", error);
		});
};

const updatePassword = () => {
	const body = {
		oldPassword: oldPassword.value,
		newPassword: newPassword.value,
	};

	useService("/update-password", {
		method: "POST",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error updating password:", error);
		});
};

const updateDetails = () => {
	const body = {
		username: username.value,
		email: email.value,
	};

	useService("/update-user-details", {
		method: "POST",
		body: JSON.stringify(body),
	})
		.then(({ data }) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error updating user details:", error);
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
					<button class="primary-btn" @click="updateDetails">Update Details</button>
				</div>
			</section>
			<section class="password">
				<h2>Change Password</h2>
				<div class="input-area">
					<input
						class="primary-input"
						type="password"
						placeholder="Old Password"
						v-model="oldPassword"
					/>
					<input
						class="primary-input"
						type="password"
						placeholder="New Password"
						v-model="newPassword"
					/>
				</div>
				<div class="action">
					<button class="primary-btn" @click="updatePassword">Update Password</button>
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
