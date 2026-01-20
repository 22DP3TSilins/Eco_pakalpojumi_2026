<template>
  <div class="register-page">
    <!-- Background Elements -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="register-container">
      <!-- Left Panel - Form -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>{{ t('register.title') }} 🌱</h2>
            <p>{{ t('register.subtitle') }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="success-message">
            <span class="success-icon">✅</span>
            <span>{{ success }}</span>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
            <button class="error-close" @click="error = ''">×</button>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="register" class="register-form">
            <div class="input-group">
              <label for="name">{{ t('register.fullName') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  id="name"
                  v-model="user.name" 
                  type="text" 
                  :placeholder="t('register.namePlaceholder')"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="email">{{ t('register.email') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input 
                  id="email"
                  v-model="user.email" 
                  type="email" 
                  :placeholder="t('register.emailPlaceholder')"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="phone">{{ t('register.phone') }} <span class="optional">({{ t('register.optional') }})</span></label>
              <div class="input-wrapper">
                <span class="input-icon">📱</span>
                <input 
                  id="phone"
                  v-model="user.phone" 
                  type="tel" 
                  :placeholder="t('register.phonePlaceholder')"
                  @input="formatPhoneNumber"
                  :class="{ 'phone-valid': isPhoneValid, 'phone-invalid': user.phone && !isPhoneValid }"
                />
              </div>
              <span v-if="user.phone && !isPhoneValid" class="phone-hint">
                {{ t('register.phoneHint') }}
              </span>
            </div>

            <div class="input-group">
              <label for="password">{{ t('register.password') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="password"
                  v-model="user.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  :placeholder="t('register.passwordPlaceholder')"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <!-- Password Strength Indicator -->
              <div class="password-strength" v-if="user.password">
                <div class="strength-bar">
                  <div 
                    class="strength-fill" 
                    :style="{ width: passwordStrength.percent + '%' }"
                    :class="passwordStrength.level"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrength.level">
                  {{ t('register.strength.' + passwordStrength.level.replace('-', '')) }}
                </span>
              </div>
              <div class="password-requirements">
                <span :class="{ met: hasMinLength }">✓ {{ t('register.requirements.minLength') }}</span>
                <span :class="{ met: hasUpperCase }">✓ {{ t('register.requirements.uppercase') }}</span>
                <span :class="{ met: hasLowerCase }">✓ {{ t('register.requirements.lowercase') }}</span>
                <span :class="{ met: hasNumber }">✓ {{ t('register.requirements.number') }}</span>
              </div>
            </div>

            <div class="input-group">
              <label for="confirmPassword">{{ t('register.confirmPassword') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔐</span>
                <input 
                  id="confirmPassword"
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  :placeholder="t('register.confirmPlaceholder')"
                  required
                  :class="{ 'password-match': passwordsMatch && confirmPassword, 'password-mismatch': !passwordsMatch && confirmPassword }"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="confirmPassword && !passwordsMatch" class="match-error">
                {{ t('register.passwordsDontMatch') }}
              </span>
              <span v-if="confirmPassword && passwordsMatch" class="match-success">
                ✓ {{ t('register.passwordsMatch') }}
              </span>
            </div>

            <!-- Terms Checkbox -->
            <label class="terms-checkbox">
              <input type="checkbox" v-model="acceptTerms" required>
              <span class="checkbox-mark"></span>
              <span>{{ t('register.agreeToTerms') }} <a href="#">{{ t('register.termsOfService') }}</a> {{ t('register.and') }} <a href="#">{{ t('register.privacyPolicy') }}</a></span>
            </label>

            <button type="submit" class="register-btn" :disabled="loading || !isFormValid">
              <span v-if="loading" class="btn-loading">
                <span class="spinner"></span>
                {{ t('register.creatingAccount') }}
              </span>
              <span v-else class="btn-content">
                <span>{{ t('register.createAccount') }}</span>
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>{{ t('register.orSignUpWith') }}</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <div id="google-signup-btn" class="google-btn-wrapper"></div>
            <button type="button" class="social-btn github" @click="githubSignup">
              <span class="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              <span>GitHub</span>
            </button>
          </div>

          <!-- Login Link -->
          <div class="login-prompt">
            <p>{{ t('register.alreadyHaveAccount') }} 
              <router-link to="/login" class="login-link">
                {{ t('register.signInHere') }}
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Branding -->
      <div class="branding-panel">
        <div class="brand-content">
          <div class="brand-logo">🌍</div>
          <h1>{{ t('register.joinMovement') }}</h1>
          <p>{{ t('register.startMakingDifference') }}</p>
          
          <div class="benefits-list">
            <div class="benefit">
              <span class="benefit-icon">🛒</span>
              <div>
                <h4>{{ t('register.benefits.ecoShopping') }}</h4>
                <p>{{ t('register.benefits.accessProducts') }}</p>
              </div>
            </div>
            <div class="benefit">
              <span class="benefit-icon">📈</span>
              <div>
                <h4>{{ t('register.benefits.trackImpact') }}</h4>
                <p>{{ t('register.benefits.monitorFootprint') }}</p>
              </div>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🎯</span>
              <div>
                <h4>{{ t('register.benefits.earnRewards') }}</h4>
                <p>{{ t('register.benefits.completeChallenges') }}</p>
              </div>
            </div>
            <div class="benefit">
              <span class="benefit-icon">👥</span>
              <div>
                <h4>{{ t('register.benefits.community') }}</h4>
                <p>{{ t('register.benefits.connectPeople') }}</p>
              </div>
            </div>
          </div>

          <div class="testimonial-mini">
            <p>"{{ t('register.testimonial.quote') }}"</p>
            <div class="testimonial-author">
              <span class="author-avatar">🧑</span>
              <span>{{ t('register.testimonial.author') }}</span>
            </div>
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
  name: 'RegisterPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        phone: '',
        password: ''
      },
      confirmPassword: '',
      error: '',
      success: '',
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      googleClientId: '374788513993-g2eej9cpmrv8a7ddgth9fhvn7t1rshkq.apps.googleusercontent.com'
    }
  },
  mounted() {
    // Initialize Google Sign-In
    this.initGoogleSignIn();
  },
  computed: {
    hasMinLength() {
      return this.user.password.length >= 8;
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.user.password);
    },
    hasLowerCase() {
      return /[a-z]/.test(this.user.password);
    },
    hasNumber() {
      return /\d/.test(this.user.password);
    },
    passwordsMatch() {
      return this.user.password === this.confirmPassword && this.user.password.length > 0;
    },
    isPhoneValid() {
      // Latvian phone numbers: +371 XXXXXXXX (8 digits after country code)
      // Or just 8 digits starting with 2, 6, or 7 (mobile) or 6 (landline)
      if (!this.user.phone) return true; // Phone is optional
      const cleaned = this.user.phone.replace(/[\s\-\(\)]/g, '');
      // +371 followed by 8 digits
      if (/^\+371[267]\d{7}$/.test(cleaned)) return true;
      // Just 8 digits starting with 2, 6, or 7
      if (/^[267]\d{7}$/.test(cleaned)) return true;
      return false;
    },
    passwordStrength() {
      let score = 0;
      if (this.hasMinLength) score++;
      if (this.hasUpperCase) score++;
      if (this.hasLowerCase) score++;
      if (this.hasNumber) score++;
      if (this.user.password.length >= 12) score++;
      if (/[!@#$%^&*]/.test(this.user.password)) score++;

      if (score <= 2) return { level: 'weak', text: 'Weak', percent: 25 };
      if (score <= 4) return { level: 'medium', text: 'Medium', percent: 50 };
      if (score <= 5) return { level: 'strong', text: 'Strong', percent: 75 };
      return { level: 'very-strong', text: 'Very Strong', percent: 100 };
    },
    isFormValid() {
      return this.user.name.trim().length >= 2 &&
             this.user.email &&
             this.hasMinLength &&
             this.hasUpperCase &&
             this.hasLowerCase &&
             this.hasNumber &&
             this.passwordsMatch &&
             this.acceptTerms &&
             this.isPhoneValid;
    }
  },
  methods: {
    formatPhoneNumber() {
      // Auto-format Latvian phone numbers
      let phone = this.user.phone.replace(/[^\d+]/g, '');
      
      // If starts with just digits and is 8 chars, add +371
      if (/^[267]\d{7}$/.test(phone)) {
        this.user.phone = '+371 ' + phone;
        return;
      }
      
      // Format +371 XXXX XXXX
      if (phone.startsWith('+371') && phone.length > 4) {
        const digits = phone.substring(4);
        if (digits.length <= 4) {
          this.user.phone = '+371 ' + digits;
        } else {
          this.user.phone = '+371 ' + digits.substring(0, 4) + ' ' + digits.substring(4);
        }
      }
    },
    async register() {
      this.error = '';
      this.success = '';

      // Check password confirmation first
      if (this.user.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Client-side validation
      if (this.user.name.trim().length < 2) {
        this.error = 'Name must be at least 2 characters long';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.error = 'Please enter a valid email address';
        return;
      }

      if (this.user.password.length < 8) {
        this.error = 'Password must be at least 8 characters long';
        return;
      }

      if (!this.hasUpperCase) {
        this.error = 'Password must contain at least one uppercase letter';
        return;
      }
      if (!this.hasLowerCase) {
        this.error = 'Password must contain at least one lowercase letter';
        return;
      }
      if (!this.hasNumber) {
        this.error = 'Password must contain at least one number';
        return;
      }

      this.loading = true;

      const authStore = useAuthStore()
      const result = await authStore.register(this.user.name.trim(), this.user.email.trim(), this.user.password)

      if (result.success) {
        this.success = result.message + ' Redirecting to login...';
        setTimeout(() => this.$router.push('/login'), 2000);
      } else {
        // Display the specific error from backend
        this.error = result.error || 'Registration failed. Please try again.';
        console.error('Registration error:', result.error);
      }

      this.loading = false;
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
      if (window.google && document.getElementById('google-signup-btn')) {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleCallback,
          auto_select: false
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
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
            this.success = 'Account created successfully! Redirecting...';
            setTimeout(() => {
              window.location.href = '/products?welcome=true';
            }, 1500);
          } else {
            // User already exists, just log them in
            window.location.href = '/products';
          }
        } else {
          this.error = result.error || 'Google signup failed. Please try again.';
        }
      } catch (err) {
        this.error = 'Google signup failed. Please try again.';
        console.error('Google signup error:', err);
      }
      
      this.loading = false;
    },
    githubSignup() {
      // GitHub OAuth would require backend setup similar to Google
      this.error = 'GitHub signup coming soon! Please use Google or email registration.';
    }
  }
}
</script>

<style scoped>
.register-page {
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
  left: -100px;
  animation: float 20s infinite ease-in-out;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -50px;
  animation: float 15s infinite ease-in-out reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 30%;
  animation: float 25s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(5deg); }
  50% { transform: translate(-20px, 20px) rotate(-5deg); }
  75% { transform: translate(30px, 10px) rotate(3deg); }
}

/* Register Container */
.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1050px;
  width: 100%;
  background: var(--card-bg);
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

/* Form Panel */
.form-panel {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  max-height: 95vh;
}

.form-container {
  max-width: 380px;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 25px;
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

/* Messages */
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

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #059669;
  font-size: 0.9em;
  animation: slideIn 0.3s ease;
}

.dark .success-message {
  background: rgba(5, 150, 105, 0.1);
  border-color: rgba(5, 150, 105, 0.3);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon, .success-icon {
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

/* Register Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.input-wrapper input.password-match {
  border-color: #2ecc71;
}

.input-wrapper input.password-mismatch {
  border-color: #e74c3c;
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

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.dark .strength-bar {
  background: rgba(255, 255, 255, 0.1);
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s;
}

.strength-fill.weak { background: #e74c3c; }
.strength-fill.medium { background: #f39c12; }
.strength-fill.strong { background: #27ae60; }
.strength-fill.very-strong { background: #2ecc71; }

.strength-text {
  font-size: 0.8em;
  font-weight: 600;
}

.strength-text.weak { color: #e74c3c; }
.strength-text.medium { color: #f39c12; }
.strength-text.strong { color: #27ae60; }
.strength-text.very-strong { color: #2ecc71; }

/* Password Requirements */
.password-requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.password-requirements span {
  font-size: 0.75em;
  color: var(--text-secondary);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  transition: all 0.2s;
}

.dark .password-requirements span {
  background: rgba(255, 255, 255, 0.05);
}

.password-requirements span.met {
  color: #27ae60;
  background: rgba(46, 204, 113, 0.1);
}

/* Phone input styling */
.phone-valid {
  border-color: #27ae60 !important;
}

.phone-invalid {
  border-color: #e74c3c !important;
}

.phone-hint {
  font-size: 0.8em;
  color: #e74c3c;
  margin-top: 4px;
}

.optional {
  font-weight: normal;
  color: var(--text-secondary);
  font-size: 0.9em;
}

/* Match indicators */
.match-error {
  font-size: 0.8em;
  color: #e74c3c;
  margin-top: 4px;
}

.match-success {
  font-size: 0.8em;
  color: #27ae60;
  margin-top: 4px;
}

/* Terms Checkbox */
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.85em;
  color: var(--text-secondary);
  line-height: 1.4;
}

.terms-checkbox input {
  display: none;
}

.terms-checkbox .checkbox-mark {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 2px;
}

.terms-checkbox input:checked + .checkbox-mark {
  background: #2ecc71;
  border-color: #2ecc71;
}

.terms-checkbox input:checked + .checkbox-mark::after {
  content: '✓';
  color: white;
  font-size: 0.8em;
}

.terms-checkbox a {
  color: #2ecc71;
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

/* Register Button */
.register-btn {
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
  margin-top: 5px;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

.register-btn:hover:not(:disabled) .btn-arrow {
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
  margin: 20px 0;
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

/* Login Prompt */
.login-prompt {
  text-align: center;
  margin-top: 20px;
}

.login-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.login-link {
  color: #2ecc71;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* Branding Panel */
.branding-panel {
  background: linear-gradient(135deg, #1abc9c 0%, #2ecc71 50%, #27ae60 100%);
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
  font-size: 2em;
  font-weight: 700;
  margin: 0 0 10px;
}

.branding-panel > .brand-content > p {
  font-size: 1.1em;
  opacity: 0.9;
  margin: 0 0 35px;
}

/* Benefits List */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 35px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 15px;
}

.benefit-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  flex-shrink: 0;
}

.benefit h4 {
  margin: 0;
  font-size: 1em;
}

.benefit p {
  margin: 2px 0 0;
  font-size: 0.85em;
  opacity: 0.8;
}

/* Mini Testimonial */
.testimonial-mini {
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.testimonial-mini > p {
  margin: 0 0 12px;
  font-style: italic;
  font-size: 0.95em;
  line-height: 1.5;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85em;
  opacity: 0.9;
}

.author-avatar {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 900px) {
  .register-container {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .branding-panel {
    display: none;
  }

  .form-panel {
    padding: 30px 20px;
  }
}

@media (max-width: 400px) {
  .form-header h2 {
    font-size: 1.5em;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .password-requirements {
    flex-direction: column;
  }
}


</style>