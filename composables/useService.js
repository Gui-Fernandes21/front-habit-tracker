export const useService = (route, options) => {
	const config = useRuntimeConfig();
	let BaseUrl = config.public.apiUrl;

	if (!BaseUrl) {
		throw new Error("Base URL is not defined");
	}

	return useFetch(route, {
		baseURL: BaseUrl,
		...options,
	});
};
