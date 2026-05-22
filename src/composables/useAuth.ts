import { computed } from 'vue'
import { useRouter } from 'vue-router'

const TOKEN_KEY = 'auth_token'

/**
 * Composable for authentication state management.
 * Centralizes token checks and auth guard logic.
 */
export function useAuth() {
  const router = useRouter()

  const token = computed(() => sessionStorage.getItem(TOKEN_KEY))
  const isLoggedIn = computed(() => !!token.value)

  /**
   * Redirect to login if not authenticated.
   * Returns true if authenticated, false if redirected.
   */
  function requireAuth(): boolean {
    if (!isLoggedIn.value) {
      router.push('/login')
      return false
    }
    return true
  }

  function getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  function setToken(newToken: string): void {
    sessionStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  }

  function logout(): void {
    clearToken()
    window.location.href = '/'
  }

  return {
    token,
    isLoggedIn,
    requireAuth,
    getToken,
    setToken,
    clearToken,
    logout
  }
}
