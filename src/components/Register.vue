<template>
  <div class="register">
    <div class="form-container">
      <h2>🌱 Register for Eco Pakalpojumi</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
      <form @submit.prevent="register">
        <input v-model="user.name" placeholder="Name" required>
        <input v-model="user.email" type="email" placeholder="Email" required>
        <input v-model="user.password" type="password" placeholder="Password (min 8 chars, uppercase, lowercase, number)" required>
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
        <button type="submit" :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
      </form>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      confirmPassword: '',
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.success = '';

      if (this.user.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Basic client-side validation (backend will do final validation)
      if (this.user.password.length < 8) {
        this.error = 'Password must be at least 8 characters';
        return;
      }

      if (this.user.name.trim().length < 2) {
        this.error = 'Name must be at least 2 characters';
        return;
      }

      this.loading = true;

      const authStore = useAuthStore()
      const result = await authStore.register(this.user.name, this.user.email, this.user.password)

      if (result.success) {
        this.success = result.message + ' Redirecting to login...';
        setTimeout(() => this.$router.push('/login'), 2000);
      } else {
        this.error = result.error;
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.register {
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

.success {
  color: green;
  margin-bottom: 10px;
  text-align: center;
}
</style>