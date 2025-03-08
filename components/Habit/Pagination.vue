<script setup>
import { ref, defineEmits, computed } from "vue";

const username = ref("");
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const showDatePicker = ref(false);

onMounted(() => {
  useService("/user-profile")
    .then(({ data }) => {
      username.value = data.value.user.name;
    })
    .catch((error) => {
      console.error("Error fetching username:", error);
    });
});

const currentDate = computed(() => {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${day}/${month}`;
});

const formattedDate = computed(() => {
  const [year, month, day] = selectedDate.value.split("-");
  return `${day}/${month}`;
});

const emit = defineEmits(["update-date"]);
const updateDate = () => {
  emit("update-date", selectedDate.value);
  showDatePicker.value = false;
};

const minYear = 2024;
const maxYear = 2026;
const minDate = `${minYear}-01-01`;
const maxDate = `${maxYear}-12-31`;
</script>

<template>
	<section>
		<div class="page">
      <h2 class="date" @click="showDatePicker = !showDatePicker">
        {{ formattedDate }}
      </h2>
      <input 
        v-if="showDatePicker"
        type="date"
        v-model="selectedDate"
        @change="updateDate"
        class="date-picker"
        :min="minDate"
        :max="maxDate"
      />
    </div>
    <div class="action">
			<h2 class="welcome-text">Welcome {{ username }}</h2>
		</div>
    <Clock />
	</section>

  <div class="top-nav-divider"></div>
</template>

<style scoped>
section {
	padding: 1rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	font-family: "Montserrat", sans-serif;
}

.page {
  font-size: 1.5rem;
}

.date {
  font-size: 1.2rem;
  letter-spacing: 2px;
  font-weight: 500;
  cursor: pointer;
}

.date-picker {
  border: 1px solid var(--primary);
	border-radius: 3px;
  padding: 0.2rem;
  font-size: 0.6rem;
  font-family: "Montserrat", sans-serif;
}

.actions {
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    cursor: pointer;
  }
}

.current-time {
	font-size: 2rem;
}

.top-nav-divider {
	width: 100%;
	height: 0.1rem;
	background-color: var(--accent);
	margin-top: 1rem;
}

.welcome-text {
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;

  font-family: "Montserrat", sans-serif;
}
</style>
