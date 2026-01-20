<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <nav class="navbar">
      <!-- Desktop Layout -->
      <div class="nav-left desktop-only">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🌱</span>
          <span class="brand-text">Eco Pakalpojumi</span>
        </router-link>
      </div>

      <div class="nav-center desktop-only">
        <!-- Search Bar -->
        <div class="search-container" :class="{ expanded: searchExpanded }">
          <button class="search-toggle" @click="toggleSearch" v-if="!searchExpanded">
            <span>🔍</span>
          </button>
          <div class="search-box" v-if="searchExpanded">
            <span class="search-icon">🔍</span>
            <input 
              ref="searchInput"
              v-model="searchQuery" 
              type="text" 
              :placeholder="t('navbar.searchPlaceholder')"
              @keyup.enter="performSearch"
              @keyup.escape="closeSearch"
            />
            <button class="search-close" @click="closeSearch">×</button>
          </div>
        </div>

        <div class="nav-links" v-show="!searchExpanded">
          <router-link to="/" class="nav-link">
            <span class="nav-icon">🏠</span>
            {{ t('common.home') }}
          </router-link>
          <router-link to="/products" class="nav-link">
            <span class="nav-icon">🛍️</span>
            {{ t('common.products') }}
          </router-link>
          <router-link to="/calculator" class="nav-link">
            <span class="nav-icon">🧮</span>
            {{ t('common.calculator') }}
          </router-link>

          <!-- Community Dropdown -->
          <div class="dropdown" :class="{ active: communityDropdownOpen }" @mouseenter="openCommunityDropdown" @mouseleave="closeCommunityDropdown">
            <button class="nav-link dropdown-toggle" @click="toggleCommunityDropdown">
              <span class="nav-icon">👥</span>
              {{ t('common.community') }}
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <div class="dropdown-header">{{ t('navbar.connectLearn') }}</div>
              <router-link to="/forum" class="dropdown-item" @click="closeCommunityDropdown">
                <span class="dropdown-icon">💬</span>
                <div class="dropdown-item-content">
                  <span class="dropdown-item-title">{{ t('common.forum') }}</span>
                  <span class="dropdown-item-desc">{{ t('navbar.joinDiscussions') }}</span>
                </div>
              </router-link>
              <router-link to="/education" class="dropdown-item" @click="closeCommunityDropdown">
                <span class="dropdown-icon">📚</span>
                <div class="dropdown-item-content">
                  <span class="dropdown-item-title">{{ t('common.education') }}</span>
                  <span class="dropdown-item-desc">{{ t('navbar.learnEcoLiving') }}</span>
                </div>
              </router-link>
            </div>
          </div>

          <!-- More Dropdown -->
          <div class="dropdown" :class="{ active: moreDropdownOpen }" @mouseenter="openMoreDropdown" @mouseleave="closeMoreDropdown">
            <button class="nav-link dropdown-toggle" @click="toggleMoreDropdown">
              <span class="nav-icon">⚡</span>
              {{ t('common.more') }}
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu dropdown-menu-wide">
              <div class="dropdown-header">{{ t('navbar.ecoTools') }}</div>
              <div class="dropdown-grid">
                <router-link to="/calculator" class="dropdown-item-card" @click="closeMoreDropdown">
                  <span class="card-icon">🧮</span>
                  <span class="card-title">{{ t('common.calculator') }}</span>
                </router-link>
                <router-link v-if="user" to="/footprint" class="dropdown-item-card" @click="closeMoreDropdown">
                  <span class="card-icon">🌍</span>
                  <span class="card-title">{{ t('common.footprint') }}</span>
                </router-link>
                <router-link v-if="user" to="/challenges" class="dropdown-item-card" @click="closeMoreDropdown">
                  <span class="card-icon">🏆</span>
                  <span class="card-title">{{ t('common.challenges') }}</span>
                </router-link>
                <router-link v-if="user && user.role === 'admin'" to="/admin" class="dropdown-item-card admin-card" @click="closeMoreDropdown">
                  <span class="card-icon">⚙️</span>
                  <span class="card-title">{{ t('common.admin') }}</span>
                </router-link>
              </div>
              <div v-if="!user" class="dropdown-footer">
                <span class="footer-icon">🔐</span>
                <span>{{ t('navbar.loginToAccess') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-right desktop-only">
        <!-- Notifications -->
        <div v-if="user" class="notification-wrapper">
          <button class="notification-btn" @click="toggleNotifications" :class="{ active: notificationsOpen }">
            <span class="notif-icon">🔔</span>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </button>
          <div class="notification-dropdown" :class="{ active: notificationsOpen }">
            <div class="notif-header">
              <h4>{{ t('notifications.title') }}</h4>
              <button v-if="notifications.length > 0" class="mark-read" @click="markAllRead">{{ t('notifications.markAllRead') }}</button>
            </div>
            <div class="notif-list" v-if="notifications.length > 0">
              <div 
                v-for="notif in notifications" 
                :key="notif.id" 
                class="notif-item"
                :class="{ unread: !notif.read }"
                @click="handleNotification(notif)"
              >
                <span class="notif-item-icon">{{ notif.icon }}</span>
                <div class="notif-content">
                  <p class="notif-text">{{ notif.message }}</p>
                  <span class="notif-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
            <div v-else class="notif-empty">
              <span>🎉</span>
              <p>You're all caught up!</p>
            </div>
          </div>
        </div>

        <!-- Cart Button with Badge -->
        <router-link v-if="user" to="/cart" class="cart-button" title="Shopping Cart">
          <span class="cart-icon">🛒</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 9 ? '9+' : cartCount }}</span>
        </router-link>

        <div v-if="user" class="user-menu">
          <button class="user-button" @click="toggleUserDropdown">
            <div class="user-avatar" :class="getUserLevel()">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
              <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-level">{{ getUserLevelName() }}</span>
            </div>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" :class="{ active: userDropdownOpen }">
            <div class="user-dropdown-header">
              <div class="user-avatar-large" :class="getUserLevel()">
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
                <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-dropdown-info">
                <span class="user-dropdown-name">{{ user.name }}</span>
                <span class="user-dropdown-email">{{ user.email }}</span>
              </div>
            </div>
            <div class="user-dropdown-stats">
              <div class="stat-item">
                <span class="stat-value">{{ userStats.ecoPoints || 0 }}</span>
                <span class="stat-label">{{ t('navbar.ecoPoints') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ userStats.challengesCompleted || 0 }}</span>
                <span class="stat-label">{{ t('navbar.challenges') }}</span>
              </div>
            </div>
            <div class="user-dropdown-links">
              <router-link to="/profile" class="dropdown-item" @click="closeUserDropdown">
                <span class="dropdown-icon">👤</span>
                {{ t('navbar.myProfile') }}
              </router-link>
              <router-link to="/cart" class="dropdown-item" @click="closeUserDropdown">
                <span class="dropdown-icon">🛒</span>
                {{ t('navbar.myCart') }}
              </router-link>
              <router-link to="/footprint" class="dropdown-item" @click="closeUserDropdown">
                <span class="dropdown-icon">🌍</span>
                {{ t('navbar.myFootprint') }}
              </router-link>
            </div>
            <div class="user-dropdown-footer">
              <button class="dropdown-item logout-btn" @click="handleLogout">
                <span class="dropdown-icon">🚪</span>
                {{ t('common.signOut') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="auth-links">
          <router-link to="/login" class="auth-link">{{ t('common.login') }}</router-link>
          <router-link to="/register" class="auth-link primary">{{ t('common.signUp') }}</router-link>
        </div>

        <!-- Language Toggle -->
        <button @click="toggleLanguage" class="lang-toggle" :title="currentLanguage === 'lv' ? 'Switch to English' : 'Pārslēgties uz latviešu'">
          <span class="lang-icon">{{ currentLanguage === 'lv' ? '🇱🇻' : '🇬🇧' }}</span>
        </button>

        <button @click="toggleTheme" class="theme-toggle" :title="theme === 'light' ? t('navbar.darkMode') : t('navbar.lightMode')">
          <span class="theme-icon">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
        </button>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-header mobile-only">
        <router-link to="/" class="mobile-brand">
          <span class="brand-icon">🌱</span>
          <span class="brand-text">Eco</span>
        </router-link>
        
        <div class="mobile-actions">
          <!-- Mobile Search Toggle -->
          <button class="mobile-search-btn" @click="toggleMobileSearch">🔍</button>
          
          <!-- Mobile Cart -->
          <router-link v-if="user" to="/cart" class="mobile-cart-btn">
            <span>🛒</span>
            <span v-if="cartCount > 0" class="mobile-cart-badge">{{ cartCount }}</span>
          </router-link>
          
          <!-- Mobile Notifications -->
          <button v-if="user" class="mobile-notif-btn" @click="toggleNotifications">
            <span>🔔</span>
            <span v-if="unreadCount > 0" class="mobile-notif-badge"></span>
          </button>
          
          <button @click="toggleMobileMenu" class="hamburger mobile-only" :class="{ active: mobileMenuOpen }">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Search Bar -->
      <div class="mobile-search-overlay" v-if="mobileSearchOpen">
        <div class="mobile-search-container">
          <span class="search-icon">🔍</span>
          <input 
            ref="mobileSearchInput"
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products, posts..."
            @keyup.enter="performSearch"
          />
          <button class="search-close" @click="closeMobileSearch">×</button>
        </div>
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
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
              <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
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
            <router-link v-if="user" to="/cart" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">🛒</span>
              <span class="link-text">Cart</span>
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
              <span class="btn-text">{{ t('common.login') }}</span>
            </router-link>
            <router-link to="/register" @click="closeMobileMenu" class="mobile-auth-btn primary">
              <span class="btn-icon">📝</span>
              <span class="btn-text">{{ t('common.signUp') }}</span>
            </router-link>
          </div>

          <!-- Theme Toggle -->
          <div class="mobile-theme-toggle">
            <button @click="toggleTheme" class="theme-toggle-btn">
              <span class="toggle-icon">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
              <span class="toggle-text">{{ theme === 'light' ? t('navbar.darkMode') : t('navbar.lightMode') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'Navbar',
  emits: ['theme-changed'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const router = useRouter()
    const authStore = useAuthStore()
    const mobileMenuOpen = ref(false)
    const theme = ref(localStorage.getItem('theme') || 'light')
    const user = computed(() => authStore.user)
    
    // Language switcher
    const currentLanguage = ref(localStorage.getItem('language') || 'lv')
    const toggleLanguage = () => {
      currentLanguage.value = currentLanguage.value === 'lv' ? 'en' : 'lv'
      locale.value = currentLanguage.value
      localStorage.setItem('language', currentLanguage.value)
    }
    
    // User avatar from customizations
    const userAvatar = ref('')
    
    // User stats from backend
    const userStats = ref({
      ecoPoints: 0,
      challengesCompleted: 0,
      cartCount: 0,
      level: 1
    })
    
    // Fetch user stats from backend
    const fetchUserStats = async () => {
      if (!user.value) return
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          userStats.value = data
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }
    
    // Load user customizations (avatar)
    const loadUserCustomizations = () => {
      if (user.value && user.value.id) {
        const saved = localStorage.getItem(`customizations_${user.value.id}`)
        if (saved) {
          const customizations = JSON.parse(saved)
          userAvatar.value = customizations.avatar || ''
        } else {
          userAvatar.value = ''
        }
      } else {
        userAvatar.value = ''
      }
    }
    
    // Watch for user changes to reload customizations
    watch(user, () => {
      loadUserCustomizations()
      if (user.value) {
        fetchUserStats()
      } else {
        userStats.value = { ecoPoints: 0, challengesCompleted: 0, cartCount: 0, level: 1 }
      }
    }, { immediate: true })
    
    // Scroll detection
    const isScrolled = ref(false)
    
    // Search
    const searchExpanded = ref(false)
    const searchQuery = ref('')
    const searchInput = ref(null)
    const mobileSearchOpen = ref(false)
    const mobileSearchInput = ref(null)
    
    // Notifications
    const notificationsOpen = ref(false)
    const notifications = ref([])  // Will be populated from backend in future
    
    // Cart count from userStats
    const cartCount = computed(() => userStats.value.cartCount || 0)

    // Dropdown states
    const communityDropdownOpen = ref(false)
    const moreDropdownOpen = ref(false)
    const userDropdownOpen = ref(false)
    
    // Computed
    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

    // Scroll handler
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20
    }

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
    
    // Search functions
    const toggleSearch = () => {
      searchExpanded.value = true
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
    
    const closeSearch = () => {
      searchExpanded.value = false
      searchQuery.value = ''
    }
    
    const toggleMobileSearch = () => {
      mobileSearchOpen.value = !mobileSearchOpen.value
      if (mobileSearchOpen.value) {
        nextTick(() => {
          mobileSearchInput.value?.focus()
        })
      }
    }
    
    const closeMobileSearch = () => {
      mobileSearchOpen.value = false
      searchQuery.value = ''
    }
    
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/products', query: { search: searchQuery.value } })
        closeSearch()
        closeMobileSearch()
      }
    }
    
    // Notification functions
    const toggleNotifications = () => {
      notificationsOpen.value = !notificationsOpen.value
      if (notificationsOpen.value) {
        communityDropdownOpen.value = false
        moreDropdownOpen.value = false
        userDropdownOpen.value = false
      }
    }
    
    const markAllRead = () => {
      notifications.value.forEach(n => n.read = true)
    }
    
    const handleNotification = (notif) => {
      notif.read = true
      notificationsOpen.value = false
      // Navigate based on notification type
    }
    
    // User level functions
    const getUserLevel = () => {
      const level = userStats.value.level || 1
      if (level >= 10) return 'level-master'
      if (level >= 5) return 'level-pro'
      return 'level-eco'
    }
    
    const getUserLevelName = () => {
      const level = userStats.value.level || 1
      const titles = ['Beginner', 'Explorer', 'Advocate', 'Champion', 'Master', 'Legend', 'Guardian', 'Champion', 'Hero', 'Legend']
      return titles[Math.min(level - 1, titles.length - 1)] || 'Eco Warrior'
    }

    // Dropdown functions
    const toggleCommunityDropdown = () => {
      communityDropdownOpen.value = !communityDropdownOpen.value
      moreDropdownOpen.value = false
      userDropdownOpen.value = false
      notificationsOpen.value = false
    }

    const openCommunityDropdown = () => {
      if (window.innerWidth > 768) {
        communityDropdownOpen.value = true
        moreDropdownOpen.value = false
        userDropdownOpen.value = false
        notificationsOpen.value = false
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
      notificationsOpen.value = false
    }

    const openMoreDropdown = () => {
      if (window.innerWidth > 768) {
        moreDropdownOpen.value = true
        communityDropdownOpen.value = false
        userDropdownOpen.value = false
        notificationsOpen.value = false
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
      notificationsOpen.value = false
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
      // Listen for theme changes
      const currentTheme = localStorage.getItem('theme') || 'light'
      theme.value = currentTheme
      document.documentElement.setAttribute('data-theme', currentTheme)
      
      // Load user customizations
      loadUserCustomizations()
      
      // Fetch user stats
      if (user.value) {
        fetchUserStats()
      }
      
      // Add scroll listener
      window.addEventListener('scroll', handleScroll)
      
      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-wrapper')) {
          notificationsOpen.value = false
        }
      })
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      t,
      currentLanguage,
      toggleLanguage,
      mobileMenuOpen,
      theme,
      user,
      userAvatar,
      userStats,
      isScrolled,
      searchExpanded,
      searchQuery,
      searchInput,
      mobileSearchOpen,
      mobileSearchInput,
      notificationsOpen,
      notifications,
      unreadCount,
      cartCount,
      communityDropdownOpen,
      moreDropdownOpen,
      userDropdownOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toggleTheme,
      toggleSearch,
      closeSearch,
      toggleMobileSearch,
      closeMobileSearch,
      performSearch,
      toggleNotifications,
      markAllRead,
      handleNotification,
      getUserLevel,
      getUserLevelName,
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
  transition: all 0.3s ease;
}

.app-header.scrolled {
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.navbar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  gap: 30px;
}

/* Desktop Layout */
.nav-left {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color) !important;
  text-decoration: none;
  font-size: 1.3em;
  font-weight: 700;
  transition: all 0.3s ease;
}

.brand-link:hover {
  color: #2ecc71 !important;
  transform: scale(1.02);
}

.brand-icon {
  font-size: 1.5em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.brand-text {
  font-size: 1.1em;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

/* Search Bar */
.search-container {
  display: flex;
  align-items: center;
}

.search-toggle {
  background: rgba(46, 204, 113, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-toggle:hover {
  background: rgba(46, 204, 113, 0.2);
  transform: scale(1.1);
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 25px;
  padding: 8px 16px;
  gap: 10px;
  min-width: 300px;
  animation: expandSearch 0.3s ease;
}

@keyframes expandSearch {
  from { width: 40px; opacity: 0; }
  to { width: 300px; opacity: 1; }
}

.search-box:focus-within {
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}

.search-icon {
  font-size: 1.1em;
  opacity: 0.6;
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-color);
  font-size: 0.95em;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-secondary);
}

.search-close {
  background: none;
  border: none;
  font-size: 1.3em;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.search-close:hover {
  color: #e74c3c;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95em;
}

.nav-icon {
  font-size: 1.1em;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #2ecc71;
  border-radius: 3px;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 0.95em;
}

.dropdown-toggle:hover {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.dropdown-arrow {
  font-size: 0.7em;
  transition: transform 0.3s ease;
  opacity: 0.6;
}

.dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 240px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-bottom-color: var(--card-bg);
}

.dropdown.active .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-header {
  padding: 12px 16px;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.dropdown-item-content {
  display: flex;
  flex-direction: column;
}

.dropdown-item-title {
  font-weight: 500;
}

.dropdown-item-desc {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.dropdown-icon {
  font-size: 1.3em;
  width: 28px;
  text-align: center;
}

/* Wide dropdown with grid */
.dropdown-menu-wide {
  min-width: 280px;
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px;
}

.dropdown-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: rgba(46, 204, 113, 0.05);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;
}

.dropdown-item-card:hover {
  background: rgba(46, 204, 113, 0.15);
  transform: translateY(-2px);
}

.dropdown-item-card.admin-card {
  background: rgba(155, 89, 182, 0.1);
}

.dropdown-item-card.admin-card:hover {
  background: rgba(155, 89, 182, 0.2);
}

.card-icon {
  font-size: 1.8em;
}

.card-title {
  font-size: 0.85em;
  font-weight: 500;
}

.dropdown-footer {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.03);
  font-size: 0.85em;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark .dropdown-footer {
  background: rgba(255, 255, 255, 0.03);
}

.footer-icon {
  font-size: 1.1em;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Notifications */
.notification-wrapper {
  position: relative;
}

.notification-btn {
  background: none;
  border: 2px solid var(--border-color);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover,
.notification-btn.active {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 0.65em;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badgePop 0.3s ease;
}

@keyframes badgePop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.notification-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.notif-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h4 {
  margin: 0;
  color: var(--text-color);
}

.mark-read {
  background: none;
  border: none;
  color: #2ecc71;
  font-size: 0.85em;
  cursor: pointer;
  font-weight: 500;
}

.mark-read:hover {
  text-decoration: underline;
}

.notif-list {
  max-height: 300px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: rgba(46, 204, 113, 0.05);
}

.notif-item.unread {
  background: rgba(46, 204, 113, 0.08);
}

.notif-item-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-text {
  margin: 0 0 4px;
  color: var(--text-color);
  font-size: 0.9em;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.notif-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.notif-empty span {
  font-size: 2.5em;
  display: block;
  margin-bottom: 10px;
}

.notif-empty p {
  margin: 0;
}

/* Cart Button */
.cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 12px;
  font-size: 1.2em;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
  position: relative;
}

.cart-button:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.5);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 0.65em;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border: 2px solid var(--border-color);
  cursor: pointer;
  padding: 6px 12px 6px 6px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.user-button:hover {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.05);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.9em;
  overflow: hidden;
}

.user-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar.level-eco {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.user-avatar.level-pro {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.user-avatar.level-master {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9em;
  line-height: 1;
}

.user-level {
  font-size: 0.7em;
  color: #2ecc71;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 280px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
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

.user-dropdown-header {
  padding: 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid var(--border-color);
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.2em;
  overflow: hidden;
}

.user-avatar-large .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-dropdown-info {
  flex: 1;
}

.user-dropdown-name {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.user-dropdown-email {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.user-dropdown-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 12px 20px;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  color: #2ecc71;
}

.stat-label {
  font-size: 0.75em;
  color: var(--text-secondary);
}

.user-dropdown-links {
  padding: 8px 0;
}

.user-dropdown-footer {
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #e74c3c !important;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.1) !important;
}

/* Auth Links */
.auth-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-link {
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95em;
}

.auth-link:not(.primary) {
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.auth-link:not(.primary):hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

.auth-link.primary {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.auth-link.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
}

/* Language Toggle */
.lang-toggle {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 0;
  border-radius: 12px;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.lang-icon {
  font-size: 1.3em;
  transition: transform 0.3s ease;
}

.lang-toggle:hover {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
}

.lang-toggle:hover .lang-icon {
  transform: scale(1.1);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 0;
  border-radius: 12px;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
}

.theme-toggle:hover .theme-icon {
  transform: rotate(20deg) scale(1.1);
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
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-search-btn,
.mobile-cart-btn,
.mobile-notif-btn {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  cursor: pointer;
  position: relative;
  color: var(--text-color);
  text-decoration: none;
}

.mobile-search-btn:hover,
.mobile-cart-btn:hover,
.mobile-notif-btn:hover {
  background: rgba(46, 204, 113, 0.1);
}

.mobile-cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #e74c3c;
  color: white;
  font-size: 0.6em;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-notif-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
}

/* Mobile Search Overlay */
.mobile-search-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-search-container {
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 14px;
  gap: 10px;
}

.mobile-search-container:focus-within {
  border-color: #2ecc71;
}

.mobile-search-container input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-color);
  font-size: 1em;
  outline: none;
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
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
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

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-weight: 600;
  color: var(--text-color);
}

.user-details .user-email {
  font-size: 0.85em;
  color: var(--text-secondary);
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
  text-decoration: none;
  justify-content: center;
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
@media (max-width: 1024px) {
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

@media (min-width: 1025px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: flex !important;
  }
}

@media (max-width: 1280px) and (min-width: 1025px) {
  .navbar {
    padding: 0 20px;
    gap: 15px;
  }

  .nav-links {
    gap: 2px;
  }

  .nav-link,
  .dropdown-toggle {
    padding: 8px 12px;
    font-size: 0.85em;
  }

  .nav-link .nav-icon {
    display: none;
  }

  .auth-link {
    padding: 8px 14px;
    font-size: 0.85em;
  }

  .brand-text {
    font-size: 0.95em;
  }

  .search-box {
    min-width: 200px;
  }
}
</style>