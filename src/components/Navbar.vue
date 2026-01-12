<template>
  <header class="app-header">
    <nav class="navbar">
      <!-- Desktop Layout -->
      <div class="nav-left desktop-only">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🌱</span>
          <span class="brand-text">Eco Pakalpojumi</span>
        </router-link>
      </div>

      <div class="nav-center desktop-only">
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/products" class="nav-link">Products</router-link>
          <router-link to="/calculator" class="nav-link">Calculator</router-link>

          <!-- Community Dropdown -->
          <div class="dropdown" :class="{ active: communityDropdownOpen }" @mouseenter="openCommunityDropdown" @mouseleave="closeCommunityDropdown">
            <button class="nav-link dropdown-toggle" @click="toggleCommunityDropdown">
              Community
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <router-link to="/forum" class="dropdown-item" @click="closeCommunityDropdown">
                <span class="dropdown-icon">💬</span>
                Forum
              </router-link>
              <router-link to="/education" class="dropdown-item" @click="closeCommunityDropdown">
                <span class="dropdown-icon">📚</span>
                Education
              </router-link>
            </div>
          </div>

          <!-- More Dropdown -->
          <div class="dropdown" :class="{ active: moreDropdownOpen }" @mouseenter="openMoreDropdown" @mouseleave="closeMoreDropdown">
            <button class="nav-link dropdown-toggle" @click="toggleMoreDropdown">
              More
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <router-link to="/calculator" class="dropdown-item" @click="closeMoreDropdown">
                <span class="dropdown-icon">🧮</span>
                Carbon Calculator
              </router-link>
              <router-link v-if="user" to="/footprint" class="dropdown-item" @click="closeMoreDropdown">
                <span class="dropdown-icon">🌍</span>
                Footprint Tracker
              </router-link>
              <router-link v-if="user" to="/challenges" class="dropdown-item" @click="closeMoreDropdown">
                <span class="dropdown-icon">🏆</span>
                Eco Challenges
              </router-link>
              <router-link v-if="user && user.role === 'admin'" to="/admin" class="dropdown-item" @click="closeMoreDropdown">
                <span class="dropdown-icon">⚙️</span>
                Admin Panel
              </router-link>
              <div v-if="!user" class="dropdown-divider"></div>
              <div v-if="!user" class="dropdown-message">
                <span class="dropdown-icon">🔐</span>
                Login for more features
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-right desktop-only">
        <div v-if="user" class="user-menu">
          <button class="user-button" @click="toggleUserDropdown">
            <div class="user-avatar">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ user.name }}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" :class="{ active: userDropdownOpen }">
            <router-link to="/profile" class="dropdown-item" @click="closeUserDropdown">
              <span class="dropdown-icon">👤</span>
              Profile
            </router-link>
            <button class="dropdown-item logout-btn" @click="handleLogout">
              <span class="dropdown-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        <div v-else class="auth-links">
          <router-link to="/login" class="auth-link">Login</router-link>
          <router-link to="/register" class="auth-link primary">Sign Up</router-link>
        </div>

        <button @click="toggleTheme" class="theme-toggle">
          {{ theme === 'light' ? '🌙' : '☀️' }}
        </button>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-header">
        <router-link to="/" class="mobile-brand">
          <span class="brand-icon">🌱</span>
          <span class="brand-text">Eco</span>
        </router-link>
        <button @click="toggleMobileMenu" class="hamburger mobile-only" :class="{ active: mobileMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
      <div class="mobile-menu" @click.stop>
        <div class="mobile-menu-header">
          <div class="mobile-brand-full">
            <span class="brand-icon">🌱</span>
            <span class="brand-text">Eco Pakalpojumi</span>
          </div>
          <button @click="closeMobileMenu" class="mobile-close">×</button>
        </div>

        <div class="mobile-menu-content">
          <!-- User Info -->
          <div v-if="user" class="mobile-user-info">
            <div class="user-avatar-large">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="mobile-nav-links">
            <router-link to="/" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🏠</span>
              <span class="link-text">Home</span>
            </router-link>
            <router-link to="/products" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🛍️</span>
              <span class="link-text">Products</span>
            </router-link>
            <router-link to="/calculator" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🧮</span>
              <span class="link-text">Calculator</span>
            </router-link>
            <router-link to="/forum" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">💬</span>
              <span class="link-text">Forum</span>
            </router-link>
            <router-link to="/education" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">📚</span>
              <span class="link-text">Education</span>
            </router-link>
            <router-link v-if="user" to="/footprint" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🌍</span>
              <span class="link-text">Footprint</span>
            </router-link>
            <router-link v-if="user" to="/challenges" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🏆</span>
              <span class="link-text">Challenges</span>
            </router-link>
            <router-link v-if="user && user.role === 'admin'" to="/admin" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">⚙️</span>
              <span class="link-text">Admin</span>
            </router-link>
          </nav>

          <!-- Auth Actions -->
          <div v-if="!user" class="mobile-auth-actions">
            <router-link to="/login" @click="closeMobileMenu" class="mobile-auth-btn">
              <span class="btn-icon">🔐</span>
              <span class="btn-text">Login</span>
            </router-link>
            <router-link to="/register" @click="closeMobileMenu" class="mobile-auth-btn primary">
              <span class="btn-icon">📝</span>
              <span class="btn-text">Sign Up</span>
            </router-link>
          </div>

          <!-- Theme Toggle -->
          <div class="mobile-theme-toggle">
            <button @click="toggleTheme" class="theme-toggle-btn">
              <span class="toggle-icon">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
              <span class="toggle-text">{{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Navbar',
  emits: ['theme-changed'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    const mobileMenuOpen = ref(false)
    const theme = ref(localStorage.getItem('theme') || 'light')
    const user = computed(() => authStore.user)

    // Dropdown states
    const communityDropdownOpen = ref(false)
    const moreDropdownOpen = ref(false)
    const userDropdownOpen = ref(false)

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', theme.value)
      document.documentElement.setAttribute('data-theme', theme.value)
      emit('theme-changed', theme.value)
    }

    // Dropdown functions
    const toggleCommunityDropdown = () => {
      communityDropdownOpen.value = !communityDropdownOpen.value
      moreDropdownOpen.value = false
      userDropdownOpen.value = false
    }

    const openCommunityDropdown = () => {
      if (window.innerWidth > 768) {
        communityDropdownOpen.value = true
        moreDropdownOpen.value = false
        userDropdownOpen.value = false
      }
    }

    const closeCommunityDropdown = () => {
      if (window.innerWidth > 768) {
        communityDropdownOpen.value = false
      }
    }

    const toggleMoreDropdown = () => {
      moreDropdownOpen.value = !moreDropdownOpen.value
      communityDropdownOpen.value = false
      userDropdownOpen.value = false
    }

    const openMoreDropdown = () => {
      if (window.innerWidth > 768) {
        moreDropdownOpen.value = true
        communityDropdownOpen.value = false
        userDropdownOpen.value = false
      }
    }

    const closeMoreDropdown = () => {
      if (window.innerWidth > 768) {
        moreDropdownOpen.value = false
      }
    }

    const toggleUserDropdown = () => {
      userDropdownOpen.value = !userDropdownOpen.value
      communityDropdownOpen.value = false
      moreDropdownOpen.value = false
    }

    const closeUserDropdown = () => {
      userDropdownOpen.value = false
    }

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    const handleLogout = () => {
      logout()
      closeMobileMenu()
      closeUserDropdown()
    }

    onMounted(() => {
      // Initialize auth state
      authStore.initializeAuth()

      // Listen for theme changes
      const currentTheme = localStorage.getItem('theme') || 'light'
      theme.value = currentTheme
      document.documentElement.setAttribute('data-theme', currentTheme)
    })

    return {
      mobileMenuOpen,
      theme,
      user,
      communityDropdownOpen,
      moreDropdownOpen,
      userDropdownOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toggleTheme,
      toggleCommunityDropdown,
      openCommunityDropdown,
      closeCommunityDropdown,
      toggleMoreDropdown,
      openMoreDropdown,
      closeMoreDropdown,
      toggleUserDropdown,
      closeUserDropdown,
      logout,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-header {
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 40px;
}

/* Desktop Layout */
.nav-left {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color) !important;
  text-decoration: none;
  font-size: 1.4em;
  font-weight: 700;
  transition: color 0.3s ease;
}

.brand-link:hover {
  color: #2ecc71 !important;
}

.brand-icon {
  font-size: 1.6em;
}

.brand-text {
  font-size: 1.2em;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.dropdown.active .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.dropdown-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--text-secondary);
  font-size: 0.9em;
  font-style: italic;
  cursor: default;
}

.dropdown-item:hover {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  transform: translateX(4px);
}

.dropdown-icon {
  font-size: 1.2em;
  width: 20px;
  text-align: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.user-button:hover {
  background: rgba(46, 204, 113, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.9em;
}

.user-name {
  font-weight: 500;
  color: var(--text-color);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 180px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #e74c3c;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #c0392b;
}

/* Auth Links */
.auth-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-link {
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-link:not(.primary) {
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.auth-link:not(.primary):hover {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.auth-link.primary {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.auth-link.primary:hover {
  background: linear-gradient(135deg, #27ae60, #229954);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--border-color);
  transform: scale(1.05);
}

/* Mobile Layout */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.2em;
  font-weight: 700;
}

.mobile-brand .brand-icon {
  font-size: 1.4em;
}

.mobile-brand .brand-text {
  font-size: 1em;
}

/* Hamburger Menu */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.3s ease;
}

.mobile-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-brand-full {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3em;
  font-weight: 700;
  color: var(--text-color);
}

.mobile-brand-full .brand-icon {
  font-size: 1.5em;
}

.mobile-brand-full .brand-text {
  font-size: 1.1em;
}

.mobile-close {
  background: none;
  border: none;
  font-size: 2em;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.mobile-close:hover {
  background: rgba(127, 140, 141, 0.1);
}

.mobile-menu-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px 24px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.1em;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
  padding-left: 20px;
}

.mobile-nav-link .link-icon {
  font-size: 1.4em;
  width: 28px;
  text-align: center;
}

.mobile-nav-link .link-text {
  font-weight: 500;
}

.mobile-auth-actions {
  padding: 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 24px;
}

.mobile-auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.mobile-auth-btn:last-child {
  margin-bottom: 0;
}

.mobile-auth-btn:hover {
  background: linear-gradient(135deg, #27ae60, #229954);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.mobile-auth-btn .btn-icon {
  font-size: 1.4em;
  width: 28px;
  text-align: center;
}

.mobile-auth-btn .btn-text {
  font-weight: 500;
}

.mobile-theme-toggle {
  padding: 0 24px 24px;
}

.theme-toggle-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
  color: var(--text-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  background: #2ecc71;
  color: white;
}

.theme-toggle-btn .toggle-icon {
  font-size: 1.4em;
  width: 28px;
  text-align: center;
}

.theme-toggle-btn .toggle-text {
  font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }

  .navbar {
    padding: 0 20px;
    height: 70px;
  }

  .mobile-menu-overlay {
    top: 70px;
    height: calc(100vh - 70px);
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: flex !important;
  }
}

@media (max-width: 1024px) {
  .navbar {
    padding: 0 20px;
    gap: 20px;
  }

  .nav-links {
    gap: 4px;
  }

  .nav-link,
  .dropdown-toggle {
    padding: 10px 16px;
    font-size: 0.9em;
  }

  .auth-link {
    padding: 8px 16px;
    font-size: 0.9em;
  }
}
</style>