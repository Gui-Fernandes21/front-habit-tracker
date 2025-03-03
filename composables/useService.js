export const useService = (route, options = {}) => {
	const config = useRuntimeConfig();
	const { isLoggedIn } = useAuth();
	
	let BaseUrl = config.public.apiUrl;

	if (!BaseUrl) {
		throw new Error("Base URL is not defined");
	}

	if (isLoggedIn.value) {
		options.headers = {
			Authorization: `Bearer ${useCookie("auth-token").value}`,
			...options.headers,
		};	
	}	

	return useFetch(route, {
		baseURL: BaseUrl,
		...options,
	});
};
