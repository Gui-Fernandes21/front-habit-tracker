import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth();
  
  useState("loading").value = true;

  if (!isLoggedIn.value) return navigateTo('/');
});
