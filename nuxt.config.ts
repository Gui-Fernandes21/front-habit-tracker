// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: false },
	css: ["~/assets/css/main.css"],
	app: {
		head: {
			title: "Habit Tracker",
		},
	},
	runtimeConfig: {
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL || "https://htk-api-414059395729.us-central1.run.app",
		},
	},
	nitro: {
		preset: "firebase",
		firebase: {
			gen: 2,
			nodeVersion: "18",
		},
	}
});
