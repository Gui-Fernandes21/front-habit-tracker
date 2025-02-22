import { jwtDecode } from 'jwt-decode';
import { ref, computed } from 'vue';

export const useAuth = () => {
  const loggedIn = ref(false);
  const token = useCookie('auth-token');

  const isLoggedIn = computed(() => {
    if (!token.value || !isTokenValid(token.value)) {
      token.value = null;
      loggedIn.value = false;
    } else {
      loggedIn.value = true;
    }
    return loggedIn.value;
  });

  function isTokenValid(token) {
    try {
      const decodedToken = jwtDecode(token);
      return !isExpired(decodedToken.exp);
    } catch (err) {
      console.error('Invalid token', err);
      return false;
    }
  }

  function isExpired(expTime) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > expTime;
  }

  return {
    isLoggedIn
  };
};

/*
- Composable to be available globally to check if user is authenticated
- Also used in the route auth guard (middleware)
- Should only 
*/
