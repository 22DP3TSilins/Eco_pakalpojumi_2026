<template>
  <div class="login-page">
    <!-- Background Elements -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-container">
      <!-- Left Panel - Branding -->
      <div class="branding-panel">
        <div class="brand-content">
          <div class="brand-logo">🌿</div>
          <h1>Eco Pakalpojumi</h1>
          <p>{{ t('login.brandTagline') }}</p>
          
          <div class="brand-features">
            <div class="feature">
              <span class="feature-icon">🛍️</span>
              <span>{{ t('login.features.shop') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span>{{ t('login.features.track') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🏆</span>
              <span>{{ t('login.features.challenges') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🌍</span>
              <span>{{ t('login.features.community') }}</span>
            </div>
          </div>

          <div class="brand-stats">
            <div class="stat">
              <span class="stat-number">{{ formatNumber(globalStats.totalUsers) }}+</span>
              <span class="stat-label">{{ t('login.stats.ecoWarriors') }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ formatNumber(globalStats.totalCo2Saved) }}</span>
              <span class="stat-label">{{ t('login.stats.co2Saved') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Login Form -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>{{ t('login.welcomeBack') }} 👋</h2>
            <p>{{ t('login.subtitle') }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
            <button class="error-close" @click="error = ''">×</button>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="login" class="login-form">
            <div class="input-group">
              <label for="email">{{ t('login.email') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input 
                  id="email"
                  v-model="credentials.email" 
                  type="email" 
                  :placeholder="t('login.emailPlaceholder')"
                  required
                  :class="{ 'has-value': credentials.email }"
                />
              </div>
            </div>

            <div class="input-group">
              <label for="password">{{ t('login.password') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="password"
                  v-model="credentials.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  :placeholder="t('login.passwordPlaceholder')"
                  required
                  :class="{ 'has-value': credentials.password }"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe">
                <span class="checkbox-mark"></span>
                <span>{{ t('login.rememberMe') }}</span>
              </label>
              <a href="#" class="forgot-link">{{ t('login.forgotPassword') }}</a>
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              <span v-if="loading" class="btn-loading">
                <span class="spinner"></span>
                {{ t('login.signingIn') }}
              </span>
              <span v-else class="btn-content">
                <span>{{ t('login.signIn') }}</span>
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>{{ t('login.orContinueWith') }}</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <div id="google-signin-btn" class="google-btn-wrapper"></div>
            <button type="button" class="social-btn github" @click="githubLogin">
              <span class="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              <span>GitHub</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="register-prompt">
            <p>{{ t('login.noAccount') }} 
              <router-link to="/register" class="register-link">
                {{ t('login.createOne') }}
              </router-link>
            </p>
          </div>

          <!-- Demo Credentials -->
          <div class="demo-hint">
            <span class="hint-icon">💡</span>
            <span>{{ t('login.demo') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LoginPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: '',
      loading: false,
      showPassword: false,
      rememberMe: false,
      googleClientId: '374788513993-g2eej9cpmrv8a7ddgth9fhvn7t1rshkq.apps.googleusercontent.com',
      globalStats: {
        totalUsers: 0,
        totalCo2Saved: 0
      }
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/products';
    }
    
    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.credentials.email = rememberedEmail;
      this.rememberMe = true;
    }
    
    // Initialize Google Sign-In
    this.initGoogleSignIn();
    
    // Fetch global stats
    this.fetchGlobalStats();
  },
  methods: {
    async fetchGlobalStats() {
      try {
        const response = await fetch('http://localhost:3000/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          this.globalStats = {
            totalUsers: data.totalUsers || 0,
            totalCo2Saved: data.totalCo2Saved || 0
          };
        }
      } catch (error) {
        console.error('Error fetching global stats:', error);
        // Use fallback values if API fails
        this.globalStats = { totalUsers: 150, totalCo2Saved: 2500 };
      }
    },
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    },
    initGoogleSignIn() {
      // Load Google Identity Services script
      if (!document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.renderGoogleButton();
        document.head.appendChild(script);
      } else if (window.google) {
        this.renderGoogleButton();
      }
    },
    renderGoogleButton() {
      if (window.google && document.getElementById('google-signin-btn')) {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleCallback,
          auto_select: false
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      }
    },
    async handleGoogleCallback(response) {
      this.loading = true;
      this.error = '';
      
      try {
        const authStore = useAuthStore();
        const result = await authStore.googleLogin(response.credential, this.googleClientId);
        
        if (result.success) {
          if (result.isNewUser) {
            // New user created via Google
            window.location.href = '/products?welcome=true';
          } else {
            window.location.href = '/products';
          }
        } else {
          this.error = result.error || 'Google login failed. Please try again.';
        }
      } catch (err) {
        this.error = 'Google login failed. Please try again.';
        console.error('Google login error:', err);
      }
      
      this.loading = false;
    },
    githubLogin() {
      // GitHub OAuth would require backend setup similar to Google
      this.error = 'GitHub login coming soon! Please use Google or email login.';
    },
    async login() {
      this.loading = true;
      this.error = '';

      if (!this.credentials.email.trim()) {
        this.error = 'Please enter your email address';
        this.loading = false;
        return;
      }

      if (!this.credentials.password) {
        this.error = 'Please enter your password';
        this.loading = false;
        return;
      }

      // Remember email if checked
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const authStore = useAuthStore()
      const result = await authStore.login(this.credentials.email.trim(), this.credentials.password)

      if (result.success) {
        window.location.href = '/products';
      } else {
        this.error = result.error || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', result.error);
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Background Shapes */
.bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
}

.shape-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -100px;
  animation: float 20s infinite ease-in-out;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  left: -50px;
  animation: float 15s infinite ease-in-out reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 30%;
  animation: float 25s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(5deg); }
  50% { transform: translate(-20px, 20px) rotate(-5deg); }
  75% { transform: translate(30px, 10px) rotate(3deg); }
}

/* Login Container */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--card-bg);
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

/* Branding Panel */
.branding-panel {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 50%, #1abc9c 100%);
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.branding-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  font-size: 4em;
  margin-bottom: 20px;
}

.branding-panel h1 {
  font-size: 2.2em;
  font-weight: 700;
  margin: 0 0 10px;
}

.branding-panel > .brand-content > p {
  font-size: 1.1em;
  opacity: 0.9;
  margin: 0 0 40px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95em;
}

.feature-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

.brand-stats {
  display: flex;
  gap: 30px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85em;
  opacity: 0.8;
}

/* Form Panel */
.form-panel {
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  max-width: 360px;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.8em;
}

.form-header p {
  margin: 0;
  color: var(--text-secondary);
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #dc2626;
  font-size: 0.9em;
}

.dark .error-message {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
}

.error-icon {
  flex-shrink: 0;
}

.error-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.3em;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
}

.error-close:hover {
  opacity: 1;
}

/* Login Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 1.1em;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}

.input-wrapper input::placeholder {
  color: var(--text-secondary);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1em;
  padding: 5px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9em;
  color: var(--text-color);
}

.remember-me input {
  display: none;
}

.checkbox-mark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remember-me input:checked + .checkbox-mark {
  background: #2ecc71;
  border-color: #2ecc71;
}

.remember-me input:checked + .checkbox-mark::after {
  content: '✓';
  color: white;
  font-size: 0.8em;
}

.forgot-link {
  font-size: 0.9em;
  color: #2ecc71;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Login Button */
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-arrow {
  transition: transform 0.2s;
}

.login-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  font-size: 0.85em;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* Social Login */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 44px;
}

.google-btn-wrapper > div {
  width: 100% !important;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.2s;
  height: 44px;
}

.social-btn:hover {
  border-color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.02);
}

.dark .social-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

.social-btn.github {
  background: #24292e;
  border-color: #24292e;
  color: white;
}

.social-btn.github:hover {
  background: #2f363d;
  border-color: #2f363d;
}

/* Register Prompt */
.register-prompt {
  text-align: center;
  margin-top: 25px;
}

.register-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.register-link {
  color: #2ecc71;
  font-weight: 600;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Demo Hint */
.demo-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px;
  background: rgba(46, 204, 113, 0.08);
  border-radius: 10px;
  font-size: 0.85em;
  color: var(--text-secondary);
}

.hint-icon {
  font-size: 1.1em;
}

/* Responsive */
@media (max-width: 800px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 450px;
  }

  .branding-panel {
    display: none;
  }

  .form-panel {
    padding: 40px 25px;
  }
}

@media (max-width: 400px) {
  .form-header h2 {
    font-size: 1.5em;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>