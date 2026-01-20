<template>
  <div class="profile-page">
    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="hero-bg"></div>
      <div class="profile-avatar-section">
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <img v-if="customizations.avatar" :src="customizations.avatar" alt="Avatar" class="avatar-img" />
            <div v-else class="avatar-placeholder">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
          </div>
          <button class="avatar-edit-btn" @click="triggerAvatarUpload">📷</button>
          <input type="file" ref="avatarInput" @change="handleAvatarUpload" accept="image/*" hidden />
        </div>
        <div class="profile-info">
          <h1>{{ user?.name || 'User' }}</h1>
          <p class="email">{{ user?.email }}</p>
          <div class="member-badge">
            <span class="badge-icon">🌱</span>
            <span>{{ t('profile.memberSince') }} {{ memberSince }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <!-- Stats Overview -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon green">🌍</div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.co2Saved }}</span>
            <span class="stat-label">{{ t('profile.stats.co2Saved') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">🎯</div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.challengesCompleted }}</span>
            <span class="stat-label">{{ t('profile.stats.challengesDone') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">🛒</div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.ecoOrders }}</span>
            <span class="stat-label">{{ t('profile.stats.ecoOrders') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">🔥</div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.streak }}</span>
            <span class="stat-label">{{ t('profile.stats.streak') }}</span>
          </div>
        </div>
      </div>

      <div class="profile-grid">
        <!-- Main Content -->
        <div class="profile-main">
          <!-- Quick Actions -->
          <div class="section-card">
            <h2>⚡ {{ t('profile.quickActions') }}</h2>
            <div class="quick-actions">
              <router-link to="/calculator" class="action-btn">
                <span class="action-icon">🧮</span>
                <span class="action-text">{{ t('profile.calculateFootprint') }}</span>
              </router-link>
              <router-link to="/challenges" class="action-btn">
                <span class="action-icon">🎯</span>
                <span class="action-text">{{ t('profile.joinChallenges') }}</span>
              </router-link>
              <router-link to="/footprint" class="action-btn">
                <span class="action-icon">📊</span>
                <span class="action-text">{{ t('profile.logActivity') }}</span>
              </router-link>
              <router-link to="/products" class="action-btn">
                <span class="action-icon">🛍️</span>
                <span class="action-text">{{ t('profile.shopProducts') }}</span>
              </router-link>
            </div>
          </div>

          <!-- Edit Profile Section -->
          <div class="section-card">
            <div class="section-header">
              <h2>👤 {{ t('profile.profileInfo') }}</h2>
              <button class="toggle-edit" @click="showEdit = !showEdit">
                {{ showEdit ? '✕ ' + t('common.cancel') : '✏️ ' + t('common.edit') }}
              </button>
            </div>

            <div v-if="!showEdit" class="profile-display">
              <div class="info-row">
                <span class="info-label">{{ t('profile.name') }}</span>
                <span class="info-value">{{ user?.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('profile.email') }}</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('profile.bio') }}</span>
                <span class="info-value">{{ customizations.bio || t('profile.noBioYet') }}</span>
              </div>
            </div>

            <form v-else @submit.prevent="updateProfile" class="edit-form">
              <div class="form-group">
                <label>{{ t('profile.name') }}</label>
                <input v-model="editData.name" type="text" required />
              </div>
              <div class="form-group">
                <label>{{ t('profile.bio') }}</label>
                <textarea v-model="customizations.bio" :placeholder="t('profile.bioPlaceholder')" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>{{ t('profile.newPassword') }}</label>
                <input v-model="editData.password" type="password" placeholder="••••••••" />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="loading">
                  {{ loading ? '⏳ ' + t('common.loading') : '💾 ' + t('profile.saveChanges') }}
                </button>
              </div>
            </form>
          </div>

          <!-- Achievements Section -->
          <div class="section-card">
            <h2>🏆 {{ t('profile.achievements') }}</h2>
            <div class="achievements-grid">
              <div 
                v-for="badge in achievements" 
                :key="badge.id"
                :class="['achievement', { unlocked: badge.unlocked }]"
                :title="badge.description"
              >
                <span class="achievement-icon">{{ badge.icon }}</span>
                <span class="achievement-name">{{ badge.name }}</span>
                <div v-if="!badge.unlocked" class="achievement-progress">
                  <div class="progress-fill" :style="{ width: badge.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <!-- Level Progress -->
          <div class="sidebar-card level-card">
            <div class="level-header">
              <span class="level-badge">{{ t('profile.level') }} {{ userLevel }}</span>
              <span class="level-title">{{ levelTitle }}</span>
            </div>
            <div class="level-progress">
              <div class="level-bar">
                <div class="level-fill" :style="{ width: levelProgress + '%' }"></div>
              </div>
              <span class="level-text">{{ currentXP }} / {{ nextLevelXP }} XP</span>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="sidebar-card">
            <h3>📅 {{ t('profile.recentActivity') }}</h3>
            <div class="activity-list">
              <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
                <span class="activity-icon">{{ activity.icon }}</span>
                <div class="activity-content">
                  <span class="activity-text">{{ activity.text }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="sidebar-card danger-zone">
            <h3>⚠️ {{ t('profile.accountSettings') }}</h3>
            <p class="danger-text">{{ t('profile.dangerZone') }}</p>
            <button class="btn-logout" @click="logout">
              🚪 {{ t('common.logout') }}
            </button>
            <button class="btn-delete" @click="deleteAccount">
              🗑️ {{ t('profile.deleteAccount') }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Profile',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      showEdit: false,
      editData: {
        name: '',
        password: ''
      },
      loading: false,
      customizations: {
        avatar: '',
        bio: ''
      },
      userStats: {
        co2Saved: 0,
        challengesCompleted: 0,
        ecoOrders: 0,
        streak: 0
      },
      userLevel: 1,
      currentXP: 0,
      nextLevelXP: 100,
      memberSinceDate: null,
      achievementsData: [
        { id: 1, key: 'firstStep', icon: '👣', unlocked: false, progress: 0 },
        { id: 2, key: 'ecoShopper', icon: '🛒', unlocked: false, progress: 0 },
        { id: 3, key: 'carbonCutter', icon: '✂️', unlocked: false, progress: 0 },
        { id: 4, key: 'challengeMaster', icon: '🎯', unlocked: false, progress: 0 },
        { id: 5, key: 'streakHero', icon: '🔥', unlocked: false, progress: 0 },
        { id: 6, key: 'planetGuardian', icon: '🌍', unlocked: false, progress: 0 }
      ],
      recentActivity: []
    }
  },
  computed: {
    achievements() {
      return this.achievementsData.map(a => ({
        ...a,
        name: this.t(`profile.achievementsList.${a.key}Name`),
        description: this.t(`profile.achievementsList.${a.key}Desc`)
      }));
    },
    user() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return { id: payload.id, email: payload.email, name: payload.name };
        } catch (e) {
          return null;
        }
      }
      return null;
    },
    memberSince() {
      if (this.memberSinceDate) {
        const date = new Date(this.memberSinceDate);
        return date.toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' });
      }
      return this.t('common.recently') || 'Nesen';
    },
    levelProgress() {
      return (this.currentXP / this.nextLevelXP) * 100;
    },
    levelTitle() {
      const keys = ['beginner', 'explorer', 'advocate', 'champion', 'master', 'legend'];
      const key = keys[Math.min(this.userLevel - 1, keys.length - 1)];
      return this.t(`profile.levelTitles.${key}`);
    }
  },
  async mounted() {
    if (this.user) {
      this.editData.name = this.user.name;
      // Load customizations using user-specific key
      const saved = localStorage.getItem(`customizations_${this.user.id}`);
      if (saved) {
        this.customizations = JSON.parse(saved);
      }
      // Fetch real stats from backend
      await this.fetchUserStats();
    }
  },
  methods: {
    async fetchUserStats() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Update stats
          this.userStats = {
            co2Saved: data.totalCo2Saved || 0,
            challengesCompleted: data.challengesCompleted || 0,
            ecoOrders: data.ordersCount || 0,
            streak: data.streak || 0
          };
          this.userLevel = data.level || 1;
          this.currentXP = data.currentXP || 0;
          this.nextLevelXP = data.nextLevelXP || 100;
          this.memberSinceDate = data.userCreatedAt;
          
          // Update achievements based on real data
          this.updateAchievements(data);
          
          // Update recent activity
          if (data.recentActivities && data.recentActivities.length > 0) {
            this.recentActivity = data.recentActivities.map(a => ({
              icon: this.getActivityIcon(a.activity),
              text: a.activity,
              time: this.formatActivityTime(a.date)
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    },
    updateAchievements(data) {
      // First Step - has any activity
      this.achievementsData[0].progress = data.activitiesCount > 0 ? 100 : 0;
      this.achievementsData[0].unlocked = data.activitiesCount > 0;
      
      // Eco Shopper - 5 orders
      this.achievementsData[1].progress = Math.min((data.ordersCount / 5) * 100, 100);
      this.achievementsData[1].unlocked = data.ordersCount >= 5;
      
      // Carbon Cutter - 50kg CO2
      this.achievementsData[2].progress = Math.min((data.totalCo2Saved / 50) * 100, 100);
      this.achievementsData[2].unlocked = data.totalCo2Saved >= 50;
      
      // Challenge Master - 10 challenges
      this.achievementsData[3].progress = Math.min((data.challengesCompleted / 10) * 100, 100);
      this.achievementsData[3].unlocked = data.challengesCompleted >= 10;
      
      // Streak Hero - 30 day streak
      this.achievementsData[4].progress = Math.min((data.streak / 30) * 100, 100);
      this.achievementsData[4].unlocked = data.streak >= 30;
      
      // Planet Guardian - 500kg CO2
      this.achievementsData[5].progress = Math.min((data.totalCo2Saved / 500) * 100, 100);
      this.achievementsData[5].unlocked = data.totalCo2Saved >= 500;
    },
    getActivityIcon(activity) {
      const lower = activity.toLowerCase();
      if (lower.includes('bike') || lower.includes('cycling')) return '🚲';
      if (lower.includes('recycle')) return '♻️';
      if (lower.includes('walk')) return '🚶';
      if (lower.includes('public') || lower.includes('bus') || lower.includes('train')) return '🚌';
      if (lower.includes('plant')) return '🌱';
      if (lower.includes('solar') || lower.includes('energy')) return '☀️';
      if (lower.includes('water')) return '💧';
      return '🌍';
    },
    formatActivityTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return this.t('common.today');
      if (diffDays === 1) return this.t('common.yesterday');
      if (diffDays < 7) return `${diffDays} ${this.t('common.daysAgo')}`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${this.t('common.weeksAgo')}`;
      }
      return date.toLocaleDateString();
    },
    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.customizations.avatar = e.target.result;
          this.saveCustomizations();
        };
        reader.readAsDataURL(file);
      }
    },
    async updateProfile() {
      this.loading = true;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.editData)
        });
        if (response.ok) {
          this.saveCustomizations();
          alert('Profile updated successfully!');
          this.showEdit = false;
          location.reload();
        } else {
          const data = await response.json();
          alert(data.error);
        }
      } catch (error) {
        alert('Error updating profile');
      } finally {
        this.loading = false;
      }
    },
    async deleteAccount() {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          localStorage.removeItem('token');
          this.$router.push('/');
          location.reload();
        } else {
          alert('Error deleting account');
        }
      } catch (error) {
        alert('Error deleting account');
      }
    },
    saveCustomizations() {
      if (this.user) {
        // Save customizations with user-specific key
        localStorage.setItem(`customizations_${this.user.id}`, JSON.stringify(this.customizations));
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
      location.reload();
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
}

/* Hero Section */
.profile-hero {
  position: relative;
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.profile-avatar-section {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-ring {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  font-weight: 700;
  color: white;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 1em;
  transition: transform 0.2s;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.profile-info {
  color: white;
}

.profile-info h1 {
  margin: 0 0 8px;
  font-size: 2.2em;
  font-weight: 700;
}

.profile-info .email {
  margin: 0 0 12px;
  opacity: 0.9;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.9em;
}

.badge-icon {
  font-size: 1.1em;
}

/* Container */
.profile-container {
  max-width: 1100px;
  margin: -30px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
}

.stat-icon.green { background: rgba(46, 204, 113, 0.15); }
.stat-icon.blue { background: rgba(52, 152, 219, 0.15); }
.stat-icon.purple { background: rgba(155, 89, 182, 0.15); }
.stat-icon.orange { background: rgba(243, 156, 18, 0.15); }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5em;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.85em;
  color: var(--text-secondary);
}

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 25px;
}

/* Section Cards */
.section-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.section-card h2 {
  margin: 0 0 20px;
  color: var(--text-color);
  font-size: 1.2em;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
}

.toggle-edit {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.2s;
}

.toggle-edit:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s;
}

.dark .action-btn {
  background: rgba(255, 255, 255, 0.05);
}

.action-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  transform: translateX(5px);
}

.action-icon {
  font-size: 1.5em;
}

.action-text {
  font-weight: 500;
}

/* Profile Display */
.profile-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.info-label {
  color: var(--text-secondary);
}

.info-value {
  color: var(--text-color);
  font-weight: 500;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.form-group input,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #667eea;
  outline: none;
}

.form-actions {
  margin-top: 10px;
}

.btn-save {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.achievement {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  opacity: 0.5;
  filter: grayscale(1);
  transition: all 0.3s;
}

.dark .achievement {
  background: rgba(255, 255, 255, 0.05);
}

.achievement.unlocked {
  opacity: 1;
  filter: none;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.achievement-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.achievement-name {
  font-size: 0.8em;
  color: var(--text-color);
  text-align: center;
}

.achievement-progress {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.dark .achievement-progress {
  background: rgba(255, 255, 255, 0.1);
}

.achievement-progress .progress-fill {
  height: 100%;
  background: #667eea;
  border-radius: 2px;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.sidebar-card h3 {
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 1.1em;
}

/* Level Card */
.level-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.level-badge {
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  font-weight: 600;
}

.level-title {
  font-weight: 600;
}

.level-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: white;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.level-text {
  text-align: right;
  font-size: 0.85em;
  opacity: 0.9;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

.dark .activity-icon {
  background: rgba(255, 255, 255, 0.05);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-text {
  font-size: 0.9em;
  color: var(--text-color);
}

.activity-time {
  font-size: 0.75em;
  color: var(--text-secondary);
}

/* Danger Zone */
.danger-zone {
  border: 2px solid rgba(231, 76, 60, 0.3);
}

.danger-text {
  margin: 0 0 15px;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.btn-logout,
.btn-delete {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
}

.btn-logout {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
}

.btn-delete {
  background: transparent;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  margin-bottom: 0;
}

.btn-delete:hover {
  background: #e74c3c;
  color: white;
}

/* Responsive */
@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 600px) {
  .profile-hero {
    padding: 100px 15px 50px;
  }

  .profile-info h1 {
    font-size: 1.6em;
  }

  .stats-section {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 15px;
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>