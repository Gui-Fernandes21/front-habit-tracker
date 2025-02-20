<template>
  <!-- Only render the modal when "show" is true -->
  <div v-if="show" class="loading-modal">
    <div class="loading-modal-overlay"></div>
    <div class="loading-modal-content">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
/* 
   The outer container that covers the entire viewport 
   and centers its child (.loading-modal-content) 
*/
.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

	font-family: "Montserrat", sans-serif;
}

/* Semi-transparent dark overlay */
.loading-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(34, 34, 34, 0.316);
}

/* 
   The white "card" in the center. 
   Adjust width, height, border-radius, box-shadow as needed. 
*/
.loading-modal-content {
  position: relative;
  z-index: 10000;
  width: 200px;
  height: 250px;
  background-color: #fff;
  border-radius: 10px;
	border: 2px solid var(--primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  /* 
    Flex layout to center the spinner and text within the card
  */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 
   Circular spinner: 
   - Base border color (#ccc)
   - Top border color (#8cc63f) 
   - Adjust thickness and size to match your design 
*/
.spinner {
  width: 80px;
  height: 80px;
  border: 4px solid #ccc;
  border-top: 4px solid #8cc63f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* 
   Simple rotating animation 
*/
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Loading text styling */
p {
  margin: 0;
  color: #8cc63f;
  font-size: 1.2rem;
  text-align: center;
}
</style>
