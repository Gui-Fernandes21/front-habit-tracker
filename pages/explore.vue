<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
	layout: "app",
});

const config = useRuntimeConfig();

const topics = [
	{ label: "All", query: "habits" },
	{ label: "Sleep", query: "sleep habits" },
	{ label: "Fitness", query: "exercise habits" },
	{ label: "Focus", query: "focus productivity habits" },
	{ label: "Mindfulness", query: "mindfulness habits" },
];

const activeTopic = ref("All");
const search = ref("");
const searchedFor = ref("");
const articles = ref([]);
const loading = ref(true);
const error = ref("");

const query = computed(() =>
	searchedFor.value
		? `${searchedFor.value} habits`
		: topics.find((t) => t.label === activeTopic.value).query
);

const fetchArticles = async () => {
	loading.value = true;
	error.value = "";
	try {
		const params = new URLSearchParams({
			q: query.value,
			language: "en",
			sortBy: "publishedAt",
			pageSize: "24",
			apiKey: config.public.newsApiKey,
		});
		const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
		const data = await response.json();
		if (data.status !== "ok") throw new Error(data.message || "News API error");
		// NewsAPI returns "[Removed]" placeholders for deleted articles
		articles.value = (data.articles || []).filter((a) => a.title && a.title !== "[Removed]");
	} catch (err) {
		console.error("Error fetching articles:", err);
		articles.value = [];
		error.value = "We couldn't load articles right now. Please try again later.";
	} finally {
		loading.value = false;
	}
};

const pickTopic = (label) => {
	activeTopic.value = label;
	searchedFor.value = "";
	search.value = "";
	fetchArticles();
};

const submitSearch = () => {
	searchedFor.value = search.value.trim();
	if (searchedFor.value) activeTopic.value = "";
	else activeTopic.value = "All";
	fetchArticles();
};

const formatDate = (iso) =>
	iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

onMounted(fetchArticles);
</script>

<template>
	<section class="explore">
		<header class="page-head">
			<div class="heading">
				<h1>Explore</h1>
				<p class="subtitle">Reading on building better habits</p>
			</div>
			<form class="search" role="search" @submit.prevent="submitSearch">
				<label class="visually-hidden" for="article-search">Search articles</label>
				<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
				<input
					id="article-search"
					v-model="search"
					class="form-input"
					type="search"
					placeholder="Search articles"
				/>
			</form>
		</header>

		<div class="topics" role="group" aria-label="Topics">
			<button
				v-for="topic in topics"
				:key="topic.label"
				type="button"
				:class="['chip', { active: activeTopic === topic.label }]"
				:aria-pressed="activeTopic === topic.label"
				@click="pickTopic(topic.label)"
			>
				{{ topic.label }}
			</button>
		</div>

		<p v-if="searchedFor" class="results-for">
			Results for "{{ searchedFor }}"
			<button type="button" class="link-btn" @click="pickTopic('All')">Clear</button>
		</p>

		<div v-if="loading" class="grid" aria-busy="true">
			<div v-for="n in 6" :key="n" class="card skeleton"></div>
		</div>
		<p v-else-if="error" class="form-error" role="alert">{{ error }}</p>
		<p v-else-if="!articles.length" class="empty">No articles found. Try another topic or search.</p>
		<div v-else class="grid">
			<article v-for="article in articles" :key="article.url" class="card">
				<div class="thumb">
					<img v-if="article.urlToImage" :src="article.urlToImage" alt="" loading="lazy" />
					<svg v-else viewBox="0 0 24 24" aria-hidden="true">
						<rect x="3" y="4" width="18" height="16" rx="2" />
						<circle cx="9" cy="10" r="2" />
						<path d="M21 16l-5-5-9 9" />
					</svg>
				</div>
				<div class="card-body">
					<span class="meta">{{ article.source?.name }}<template v-if="article.publishedAt"> · {{ formatDate(article.publishedAt) }}</template></span>
					<h2>{{ article.title }}</h2>
					<p v-if="article.description" class="summary">{{ article.description }}</p>
					<a :href="article.url" target="_blank" rel="noopener" class="read">
						Read article
						<span class="visually-hidden">(opens in a new tab)</span>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
					</a>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped>
.explore {
	padding: 2rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	font-family: "Open Sans", sans-serif;
	color: var(--dark);
}

.page-head {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 1rem;
}

h1 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 1.9rem;
	font-weight: 600;
}

.subtitle {
	margin: 0.25rem 0 0;
	color: var(--muted);
	font-size: 0.9rem;
}

.search {
	position: relative;
	width: 20rem;
}

.search svg {
	position: absolute;
	left: 0.8rem;
	top: 50%;
	width: 18px;
	height: 18px;
	transform: translateY(-50%);
	fill: none;
	stroke: var(--muted);
	stroke-width: 2;
	stroke-linecap: round;
}

.search .form-input {
	padding-left: 2.5rem;
}

.topics {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.chip {
	min-height: 36px;
	padding: 0 1rem;
	border: 2px solid var(--dark-light-1);
	border-radius: 999px;
	background: #fff;
	font: 600 0.85rem "Open Sans", sans-serif;
	color: var(--dark);
	cursor: pointer;
}

.chip:hover {
	border-color: var(--primary);
}

.chip.active {
	border-color: var(--primary-dark);
	background: var(--primary-dark);
	color: #fff;
}

.chip:focus-visible,
.read:focus-visible {
	outline: 2px solid var(--primary-dark);
	outline-offset: 2px;
}

.results-for {
	margin: 0;
	font-size: 0.9rem;
	color: var(--muted);
}

.link-btn {
	margin-left: 0.5rem;
	border: 0;
	background: transparent;
	color: var(--primary-dark);
	font: 600 0.9rem "Open Sans", sans-serif;
	text-decoration: underline;
	cursor: pointer;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	gap: 1.25rem;
}

.card {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	background: #fff;
}

.skeleton {
	height: 18rem;
	background: linear-gradient(90deg, #f5f5f5, #fafafa, #f5f5f5);
}

.thumb {
	height: 9rem;
	display: grid;
	place-items: center;
	background: var(--primary-soft);
}

.thumb img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.thumb svg {
	width: 28px;
	height: 28px;
	fill: none;
	stroke: var(--primary);
	stroke-width: 1.5;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.card-body {
	flex: 1;
	padding: 0.9rem 1rem 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.meta {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--muted);
}

.card h2 {
	margin: 0;
	font-family: "Montserrat", sans-serif;
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.35;
}

.summary {
	margin: 0;
	font-size: 0.8rem;
	line-height: 1.5;
	color: var(--muted);
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.read {
	margin-top: auto;
	padding-top: 0.35rem;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--primary-dark);
	text-decoration: none;
}

.read:hover {
	text-decoration: underline;
}

.read svg {
	width: 14px;
	height: 14px;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.empty {
	margin: 0;
	padding: 3rem 1rem;
	border: 2px dashed var(--dark-light-1);
	border-radius: 12px;
	text-align: center;
	color: var(--muted);
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

@media (max-width: 768px) {
	.explore {
		padding: 1rem 1.25rem 2rem;
		gap: 1rem;
	}

	.page-head {
		flex-direction: column;
		align-items: stretch;
	}

	h1 {
		font-size: 1.4rem;
	}

	.search {
		width: 100%;
	}

	.topics {
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	.chip {
		flex-shrink: 0;
	}

	/* Compact list on phones: small thumbnail beside the text */
	.grid {
		grid-template-columns: minmax(0, 1fr);
		gap: 0;
	}

	.card {
		flex-direction: row;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border: 0;
		border-bottom: 1px solid #f0f0f0;
		border-radius: 0;
	}

	.skeleton {
		height: 5.5rem;
	}

	.thumb {
		width: 5.25rem;
		height: 4.5rem;
		flex-shrink: 0;
		border-radius: 8px;
		overflow: hidden;
	}

	.card-body {
		padding: 0;
		gap: 0.25rem;
	}

	.card h2 {
		font-size: 0.875rem;
	}

	.summary {
		-webkit-line-clamp: 1;
	}
}
</style>
