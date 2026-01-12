import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      const { useAuthStore } = await import('../stores/auth.js')
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axios