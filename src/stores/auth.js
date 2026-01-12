import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!user.value)

  // Set axios default authorization header
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data

      token.value = newToken
      user.value = userData

      // Store token in localStorage
      localStorage.setItem('token', newToken)

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        // Decode token to get user info (simple decode, not verify)
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        user.value = {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }
        token.value = storedToken
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch (error) {
        // Invalid token, clear it
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth
  }
})