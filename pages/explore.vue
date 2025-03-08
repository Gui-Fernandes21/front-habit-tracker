<script setup>
import { ref, onMounted } from "vue";

const articles = ref([]);
const loading = ref(true);
const config = useRuntimeConfig();

const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await fetch(
        `https://newsapi.org/v2/everything?q=habits&language=en&apiKey=${config.public.newsApiKey}`
    );
    const data = await response.json();
    if (data.articles) {
      articles.value = data.articles;
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticles);
</script>

<template>
  <section class="explore">
    <TheNav />
	<SideNav />
    <div class="content">
        <h1>Explore Articles</h1>
        <div class="top-nav-divider"></div>

        <div v-if="loading" class="loading">Loading articles...</div>

        <div v-else class="articles">
        <div v-for="article in articles" :key="article.url" class="article-card">
            <img :src="article.urlToImage" alt="Article Image" class="article-image" />
            <div class="article-content">
            <h2>{{ article.title }}</h2>
            <p>{{ article.description || "No description available." }}</p>
            <a :href="article.url" target="_blank" class="read-more">Read More</a>
            </div>
        </div>
        </div>
    </div>
  </section>
</template>

<style scoped>
.explore {
	display: grid;
	grid-template-columns: 4rem calc(100% - 4rem);
	grid-template-rows: 5rem 1fr;
	height: 100%;
}

.content {
	grid-column: 2;
	grid-row: 2;
	font-family: "Open Sans", sans-serif;
	padding: 1rem;
	width: 100%;
	justify-self: center;
}

h1 {
	font-size: 1.3rem;
    font-weight: 500;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    padding: 1rem;
    margin-left: -0.7rem;
}

.top-nav-divider {
	width: 100%;
	height: 0.1rem;
	background-color: var(--accent);
	margin-top: 1rem;
}

.loading {
  font-size: 1rem;
  color: var(--primary);
  margin-top: 3rem;
  text-align: center;
}

.articles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  margin-top: 4rem;
  padding: 2.5rem;
}

.article-card {
  background: var(--light);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  transition: transform 0.2s ease-in-out;
}

.article-card:hover {
  transform: scale(1.02);
}

.article-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.article-content h2 {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.article-content p {
  font-size: 0.9rem;
  color: var(--dark);
}

.read-more {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--primary);
  font-weight: bold;
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}
</style>