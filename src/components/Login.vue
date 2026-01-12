<template>
  <div class="login">
    <div class="form-container">
      <h2>🌱 Login to Eco Pakalpojumi</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <form @submit.prevent="login">
        <input v-model="credentials.email" type="email" placeholder="Email" required>
        <input v-model="credentials.password" type="password" placeholder="Password" required>
        <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
      </form>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: '',
      loading: false
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      this.$router.push('/products');
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = '';

      const authStore = useAuthStore()
      const result = await authStore.login(this.credentials.email, this.credentials.password)

      if (result.success) {
        this.$router.push('/products');
      } else {
        this.error = result.error;
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.form-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  width: 300px;
}

h2 {
  text-align: center;
  color: var(--button-bg);
  margin-bottom: 20px;
}

.demo-info {
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid #2ecc71;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 0.9em;
  text-align: center;
  color: var(--text-color);
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background: var(--bg-color);
  color: var(--text-color);
}

button {
  background: var(--button-bg);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: var(--button-hover);
}

p {
  text-align: center;
  margin-top: 15px;
}

.error {
  color: red;
  margin-bottom: 10px;
  text-align: center;
}
</style>