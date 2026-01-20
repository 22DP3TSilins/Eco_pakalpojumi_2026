<template>
  <div class="tracker-page">
    <!-- Hero Stats Section -->
    <div class="tracker-hero">
      <div class="hero-left">
        <h1>🌍 {{ t('footprint.title') }}</h1>
        <p>{{ t('footprint.subtitle') }}</p>
      </div>
      <div class="hero-stats">
        <div class="stat-card main-stat">
          <div class="stat-icon">🌱</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalImpact.toFixed(1) }}</span>
            <span class="stat-label">{{ t('footprint.kgCo2') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ activities.length }}</span>
            <span class="stat-label">{{ t('footprint.activities') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <span class="stat-value">{{ currentStreak }}</span>
            <span class="stat-label">{{ t('footprint.streak') }} {{ t('footprint.days') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ achievementsCount }}</span>
            <span class="stat-label">{{ t('footprint.achievements') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tracker-container">
      <!-- Left Column - Log Activity -->
      <div class="tracker-main">
        <!-- Quick Log Section -->
        <div class="quick-log-section">
          <h2>⚡ {{ t('footprint.quickLog') }}</h2>
          <p class="section-desc">{{ t('footprint.quickLogDesc') }}</p>
          <div class="quick-activities">
            <button 
              v-for="qa in quickActivities" 
              :key="qa.id"
              class="quick-activity-btn"
              @click="quickLog(qa)"
            >
              <span class="qa-icon">{{ qa.icon }}</span>
              <span class="qa-name">{{ qa.name }}</span>
              <span class="qa-impact">+{{ qa.impact }}kg</span>
            </button>
          </div>
        </div>

        <!-- Custom Log Section -->
        <div class="custom-log-section">
          <div class="section-header">
            <h2>📝 {{ t('footprint.logCustomActivity') }}</h2>
            <button class="toggle-btn" @click="showCustomForm = !showCustomForm">
              {{ showCustomForm ? '✕ ' + t('common.close') : '+ ' + t('footprint.addCustom') }}
            </button>
          </div>
          
          <div v-if="showCustomForm" class="custom-form">
            <form @submit.prevent="addActivity">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ t('footprint.activityCategory') }}</label>
                  <select v-model="newActivity.category" required>
                    <option value="">{{ t('footprint.selectCategory') }}</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.icon }} {{ cat.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t('footprint.activityName') }}</label>
                  <input v-model="newActivity.activity" type="text" :placeholder="t('footprint.whatDidYouDo')" required>
                </div>
                <div class="form-group">
                  <label>{{ t('footprint.co2Saved') }}</label>
                  <input v-model.number="newActivity.impact" type="number" step="0.1" min="0" placeholder="0.0" required>
                </div>
                <div class="form-group">
                  <label>{{ t('footprint.date') }}</label>
                  <input v-model="newActivity.date" type="date" required>
                </div>
              </div>
              <div class="form-group full-width">
                <label>{{ t('footprint.notes') }}</label>
                <textarea v-model="newActivity.notes" :placeholder="t('footprint.additionalDetails')"></textarea>
              </div>
              <button type="submit" class="submit-btn">🌱 {{ t('footprint.logActivity') }}</button>
            </form>
          </div>
        </div>

        <!-- Weekly Progress -->
        <div class="weekly-section">
          <h2>📈 {{ t('footprint.weeklyProgress') }}</h2>
          <div class="week-chart">
            <div 
              v-for="(day, index) in weekData" 
              :key="index"
              class="day-bar"
            >
              <div class="bar-container">
                <div 
                  class="bar-fill" 
                  :style="{ height: (day.impact / maxDayImpact * 100) + '%' }"
                  :class="{ today: day.isToday }"
                ></div>
              </div>
              <span class="day-label">{{ day.name }}</span>
              <span class="day-value">{{ day.impact.toFixed(1) }}</span>
            </div>
          </div>
          <div class="week-summary">
            <div class="summary-item">
              <span class="summary-label">{{ t('footprint.thisWeek') }}</span>
              <span class="summary-value">{{ weeklyTotal.toFixed(1) }} kg</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ t('footprint.dailyAverage') }}</span>
              <span class="summary-value">{{ dailyAverage.toFixed(1) }} kg</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ t('footprint.bestDay') }}</span>
              <span class="summary-value">{{ bestDay.toFixed(1) }} kg</span>
            </div>
          </div>
        </div>

        <!-- Activity History -->
        <div class="history-section">
          <div class="section-header">
            <h2>📋 {{ t('footprint.activityHistory') }}</h2>
            <div class="filter-btns">
              <button 
                :class="['filter-btn', { active: historyFilter === 'all' }]"
                @click="historyFilter = 'all'"
              >{{ t('footprint.all') }}</button>
              <button 
                :class="['filter-btn', { active: historyFilter === 'week' }]"
                @click="historyFilter = 'week'"
              >{{ t('footprint.thisWeek') }}</button>
              <button 
                :class="['filter-btn', { active: historyFilter === 'month' }]"
                @click="historyFilter = 'month'"
              >{{ t('footprint.thisMonth') }}</button>
            </div>
          </div>

          <div v-if="filteredActivities.length === 0" class="empty-history">
            <div class="empty-icon">🌿</div>
            <h3>{{ t('footprint.noActivitiesYet') }}</h3>
            <p>{{ t('footprint.startLogging') }}</p>
          </div>

          <div class="activity-list">
            <div 
              v-for="activity in filteredActivities" 
              :key="activity.id" 
              class="activity-card"
            >
              <div class="activity-icon" :style="{ background: getCategoryColor(activity.activity) }">
                {{ getCategoryIcon(activity.activity) }}
              </div>
              <div class="activity-info">
                <h4>{{ activity.activity }}</h4>
                <span class="activity-date">{{ formatDate(activity.date) }}</span>
              </div>
              <div class="activity-impact">
                <span class="impact-value">+{{ activity.impact }}</span>
                <span class="impact-unit">kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Sidebar -->
      <aside class="tracker-sidebar">
        <!-- Impact Breakdown -->
        <div class="sidebar-card">
          <h3>🥧 {{ t('footprint.impactByCategory') }}</h3>
          <div class="category-breakdown">
            <div 
              v-for="cat in categoryBreakdown" 
              :key="cat.name"
              class="category-item"
            >
              <div class="cat-header">
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-value">{{ cat.total.toFixed(1) }} kg</span>
              </div>
              <div class="cat-bar">
                <div 
                  class="cat-fill" 
                  :style="{ 
                    width: (cat.total / totalImpact * 100) + '%',
                    background: cat.color 
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="sidebar-card">
          <h3>🏆 {{ t('footprint.achievements') }}</h3>
          <div class="achievements-grid">
            <div 
              v-for="badge in achievements" 
              :key="badge.id"
              :class="['badge', { unlocked: badge.unlocked }]"
              :title="badge.description"
            >
              <span class="badge-icon">{{ badge.icon }}</span>
              <span class="badge-name">{{ badge.name }}</span>
              <div class="badge-progress" v-if="!badge.unlocked">
                <div class="progress-fill" :style="{ width: badge.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Eco Goals -->
        <div class="sidebar-card">
          <h3>🎯 {{ t('footprint.monthlyGoal') }}</h3>
          <div class="goal-progress">
            <div class="goal-circle">
              <svg viewBox="0 0 100 100">
                <circle class="goal-bg" cx="50" cy="50" r="45"/>
                <circle 
                  class="goal-fill" 
                  cx="50" cy="50" r="45"
                  :style="{ strokeDashoffset: goalOffset }"
                />
              </svg>
              <div class="goal-text">
                <span class="goal-current">{{ monthlyTotal.toFixed(0) }}</span>
                <span class="goal-target">/ {{ monthlyGoal }} kg</span>
              </div>
            </div>
            <p class="goal-message">{{ goalMessage }}</p>
          </div>
        </div>

        <!-- Tips -->
        <div class="sidebar-card tips-card">
          <h3>💡 {{ t('footprint.dailyTip') }}</h3>
          <div class="daily-tip">
            <span class="tip-icon">{{ currentTip.icon }}</span>
            <p>{{ currentTip.text }}</p>
          </div>
          <button class="refresh-tip" @click="refreshTip">🔄 {{ t('footprint.newTip') }}</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Footprint',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      activities: [],
      showCustomForm: false,
      historyFilter: 'all',
      newActivity: {
        activity: '',
        impact: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      },
      monthlyGoal: 100,
      currentTipIndex: 0
    }
  },
  computed: {
    categories() {
      return [
        { id: 'transport', name: this.t('footprint.categories.transport'), icon: '🚲', color: '#3498db' },
        { id: 'energy', name: this.t('footprint.categories.energy'), icon: '⚡', color: '#f39c12' },
        { id: 'waste', name: this.t('footprint.categories.waste'), icon: '♻️', color: '#2ecc71' },
        { id: 'food', name: this.t('footprint.categories.food'), icon: '🥗', color: '#e74c3c' },
        { id: 'water', name: this.t('footprint.categories.water'), icon: '💧', color: '#9b59b6' },
        { id: 'nature', name: this.t('footprint.categories.nature'), icon: '🌳', color: '#1abc9c' }
      ]
    },
    quickActivities() {
      return [
        { id: 1, name: this.t('footprint.quickActivities.bikedToWork'), icon: '🚲', impact: 2.5, category: 'transport' },
        { id: 2, name: this.t('footprint.quickActivities.recycledWaste'), icon: '♻️', impact: 1.0, category: 'waste' },
        { id: 3, name: this.t('footprint.quickActivities.meatlessMeal'), icon: '🥗', impact: 1.5, category: 'food' },
        { id: 4, name: this.t('footprint.quickActivities.publicTransit'), icon: '🚌', impact: 1.8, category: 'transport' },
        { id: 5, name: this.t('footprint.quickActivities.coldWash'), icon: '👕', impact: 0.5, category: 'energy' },
        { id: 6, name: this.t('footprint.quickActivities.composted'), icon: '🌱', impact: 0.8, category: 'waste' },
        { id: 7, name: this.t('footprint.quickActivities.shortShower'), icon: '🚿', impact: 0.3, category: 'water' },
        { id: 8, name: this.t('footprint.quickActivities.noCarToday'), icon: '🚗', impact: 3.0, category: 'transport' }
      ]
    },
    achievements() {
      return [
        { id: 1, name: this.t('footprint.achievementsList.firstStepName'), icon: '👣', description: this.t('footprint.achievementsList.firstStepDesc'), unlocked: false, progress: 0 },
        { id: 2, name: this.t('footprint.achievementsList.weekWarriorName'), icon: '🗓️', description: this.t('footprint.achievementsList.weekWarriorDesc'), unlocked: false, progress: 0 },
        { id: 3, name: this.t('footprint.achievementsList.carbonCutterName'), icon: '✂️', description: this.t('footprint.achievementsList.carbonCutterDesc'), unlocked: false, progress: 0 },
        { id: 4, name: this.t('footprint.achievementsList.ecoChampionName'), icon: '🏆', description: this.t('footprint.achievementsList.ecoChampionDesc'), unlocked: false, progress: 0 },
        { id: 5, name: this.t('footprint.achievementsList.greenMasterName'), icon: '🌿', description: this.t('footprint.achievementsList.greenMasterDesc'), unlocked: false, progress: 0 },
        { id: 6, name: this.t('footprint.achievementsList.planetHeroName'), icon: '🌍', description: this.t('footprint.achievementsList.planetHeroDesc'), unlocked: false, progress: 0 }
      ]
    },
    tips() {
      return [
        { icon: '🚲', text: this.t('footprint.tipsList.cycling') },
        { icon: '💡', text: this.t('footprint.tipsList.led') },
        { icon: '🥗', text: this.t('footprint.tipsList.meatless') },
        { icon: '🚿', text: this.t('footprint.tipsList.shower') },
        { icon: '♻️', text: this.t('footprint.tipsList.recycle') },
        { icon: '🌳', text: this.t('footprint.tipsList.tree') },
        { icon: '👕', text: this.t('footprint.tipsList.coldWash') },
        { icon: '📦', text: this.t('footprint.tipsList.orders') }
      ]
    },
    totalImpact() {
      return this.activities.reduce((sum, act) => sum + (act.impact || 0), 0);
    },
    currentStreak() {
      // Calculate streak of consecutive days with activities
      if (this.activities.length === 0) return 0;
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i <= 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasActivity = this.activities.some(a => 
          a.date && a.date.startsWith(dateStr)
        );
        if (hasActivity) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      return streak;
    },
    achievementsCount() {
      return this.achievements.filter(a => a.unlocked).length;
    },
    weekData() {
      const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const today = new Date();
      const data = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayActivities = this.activities.filter(a => 
          a.date && a.date.startsWith(dateStr)
        );
        const impact = dayActivities.reduce((sum, a) => sum + (a.impact || 0), 0);
        
        data.push({
          name: this.t(`common.days.${dayKeys[date.getDay()]}`),
          impact: impact,
          isToday: i === 0
        });
      }
      return data;
    },
    maxDayImpact() {
      const max = Math.max(...this.weekData.map(d => d.impact));
      return max > 0 ? max : 10;
    },
    weeklyTotal() {
      return this.weekData.reduce((sum, d) => sum + d.impact, 0);
    },
    dailyAverage() {
      return this.weeklyTotal / 7;
    },
    bestDay() {
      return Math.max(...this.weekData.map(d => d.impact));
    },
    monthlyTotal() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return this.activities
        .filter(a => a.date && new Date(a.date) >= monthStart)
        .reduce((sum, a) => sum + (a.impact || 0), 0);
    },
    goalOffset() {
      const circumference = 2 * Math.PI * 45;
      const progress = Math.min(this.monthlyTotal / this.monthlyGoal, 1);
      return circumference * (1 - progress);
    },
    goalMessage() {
      const percent = (this.monthlyTotal / this.monthlyGoal * 100).toFixed(0);
      if (percent >= 100) return '🎉 ' + this.t('footprint.goalMessages.achieved');
      if (percent >= 75) return '🔥 ' + this.t('footprint.goalMessages.almost');
      if (percent >= 50) return '💪 ' + this.t('footprint.goalMessages.halfWay');
      if (percent >= 25) return '🌱 ' + this.t('footprint.goalMessages.goodStart');
      return '🚀 ' + this.t('footprint.goalMessages.justStarted');
    },
    filteredActivities() {
      let filtered = [...this.activities];
      const now = new Date();
      
      if (this.historyFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(a => a.date && new Date(a.date) >= weekAgo);
      } else if (this.historyFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(a => a.date && new Date(a.date) >= monthAgo);
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    categoryBreakdown() {
      return this.categories.map(cat => {
        const total = this.activities
          .filter(a => this.getActivityCategory(a.activity) === cat.id)
          .reduce((sum, a) => sum + (a.impact || 0), 0);
        return {
          ...cat,
          total
        };
      }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
    },
    currentTip() {
      return this.tips[this.currentTipIndex];
    }
  },
  mounted() {
    this.fetchActivities();
    this.updateAchievements();
  },
  methods: {
    async fetchActivities() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/footprint', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.activities = data.activities || [];
        this.updateAchievements();
      } catch (error) {
        console.error('Error fetching activities:', error);
        this.activities = [];
      }
    },
    async addActivity() {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3000/api/footprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newActivity)
        });
        this.newActivity = { 
          activity: '', 
          impact: 0, 
          category: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        };
        this.showCustomForm = false;
        this.fetchActivities();
      } catch (error) {
        console.error('Error adding activity:', error);
      }
    },
    async quickLog(qa) {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3000/api/footprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            activity: qa.name,
            impact: qa.impact,
            category: qa.category,
            date: new Date().toISOString().split('T')[0]
          })
        });
        this.fetchActivities();
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    },
    updateAchievements() {
      // First Step
      this.achievements[0].unlocked = this.activities.length > 0;
      this.achievements[0].progress = this.activities.length > 0 ? 100 : 0;
      
      // Week Warrior
      this.achievements[1].unlocked = this.currentStreak >= 7;
      this.achievements[1].progress = Math.min(this.currentStreak / 7 * 100, 100);
      
      // Carbon Cutter (50kg)
      this.achievements[2].unlocked = this.totalImpact >= 50;
      this.achievements[2].progress = Math.min(this.totalImpact / 50 * 100, 100);
      
      // Eco Champion (100kg)
      this.achievements[3].unlocked = this.totalImpact >= 100;
      this.achievements[3].progress = Math.min(this.totalImpact / 100 * 100, 100);
      
      // Green Master (50 activities)
      this.achievements[4].unlocked = this.activities.length >= 50;
      this.achievements[4].progress = Math.min(this.activities.length / 50 * 100, 100);
      
      // Planet Hero (500kg)
      this.achievements[5].unlocked = this.totalImpact >= 500;
      this.achievements[5].progress = Math.min(this.totalImpact / 500 * 100, 100);
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const now = new Date();
      const diff = now - d;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      return d.toLocaleDateString();
    },
    getCategoryIcon(activityName) {
      const iconMap = {
        'bike': '🚲', 'cycl': '🚲', 'transport': '🚌', 'bus': '🚌',
        'recycl': '♻️', 'compost': '🌱', 'waste': '🗑️',
        'meat': '🥗', 'vegan': '🥗', 'food': '🍽️',
        'water': '💧', 'shower': '🚿',
        'energy': '⚡', 'light': '💡', 'laundry': '👕',
        'tree': '🌳', 'plant': '🌱', 'car': '🚗'
      };
      
      const lower = (activityName || '').toLowerCase();
      for (const [key, icon] of Object.entries(iconMap)) {
        if (lower.includes(key)) return icon;
      }
      return '🌍';
    },
    getCategoryColor(activityName) {
      const cat = this.getActivityCategory(activityName);
      const category = this.categories.find(c => c.id === cat);
      return category ? category.color : '#2ecc71';
    },
    getActivityCategory(activityName) {
      const lower = (activityName || '').toLowerCase();
      if (lower.includes('bike') || lower.includes('bus') || lower.includes('car') || lower.includes('transit')) return 'transport';
      if (lower.includes('energy') || lower.includes('light') || lower.includes('laundry')) return 'energy';
      if (lower.includes('recycl') || lower.includes('compost') || lower.includes('waste')) return 'waste';
      if (lower.includes('meat') || lower.includes('food') || lower.includes('meal')) return 'food';
      if (lower.includes('water') || lower.includes('shower')) return 'water';
      if (lower.includes('tree') || lower.includes('plant')) return 'nature';
      return 'waste';
    },
    refreshTip() {
      this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
    }
  }
}
</script>

<style scoped>
.tracker-page {
  min-height: 100vh;
  padding: 80px 20px 60px;
  background: var(--bg-color);
}

/* Hero Section */
.tracker-hero {
  max-width: 1200px;
  margin: 0 auto 30px;
  padding: 40px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.hero-left h1 {
  margin: 0 0 10px;
  font-size: 2.2em;
}

.hero-left p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.hero-stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card.main-stat {
  background: rgba(255, 255, 255, 0.25);
}

.stat-icon {
  font-size: 1.8em;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85em;
  opacity: 0.9;
}

/* Container */
.tracker-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
}

/* Quick Log Section */
.quick-log-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.quick-log-section h2 {
  margin: 0 0 5px;
  color: var(--text-color);
}

.section-desc {
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.quick-activities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.quick-activity-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 12px;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
}

.quick-activity-btn:hover {
  border-color: #2ecc71;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.2);
}

.qa-icon {
  font-size: 2em;
}

.qa-name {
  font-size: 0.9em;
  text-align: center;
}

.qa-impact {
  padding: 4px 10px;
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
}

/* Custom Log Section */
.custom-log-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: var(--text-color);
}

.toggle-btn {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

.custom-form {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2ecc71;
  outline: none;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

/* Weekly Section */
.weekly-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.weekly-section h2 {
  margin: 0 0 20px;
  color: var(--text-color);
}

.week-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
  gap: 10px;
  margin-bottom: 20px;
}

.day-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-container {
  width: 100%;
  height: 100px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 8px 8px 0 0;
  transition: height 0.5s ease;
  min-height: 4px;
}

.bar-fill.today {
  background: linear-gradient(180deg, #f39c12 0%, #e67e22 100%);
}

.day-label {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.day-value {
  font-size: 0.75em;
  color: var(--text-color);
  font-weight: 600;
}

.week-summary {
  display: flex;
  justify-content: space-around;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.summary-item {
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 1.1em;
  font-weight: 700;
  color: #2ecc71;
}

/* History Section */
.history-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.filter-btns {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 14px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85em;
  transition: all 0.2s;
}

.dark .filter-btn {
  background: rgba(255, 255, 255, 0.08);
}

.filter-btn.active {
  background: #2ecc71;
  color: white;
}

.empty-history {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.empty-history h3 {
  margin: 0 0 8px;
  color: var(--text-color);
}

.empty-history p {
  margin: 0;
  color: var(--text-secondary);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  transition: all 0.2s;
}

.dark .activity-card {
  background: rgba(255, 255, 255, 0.05);
}

.activity-card:hover {
  background: rgba(46, 204, 113, 0.1);
}

.activity-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  margin: 0 0 4px;
  color: var(--text-color);
  font-size: 1em;
}

.activity-date {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.activity-impact {
  text-align: right;
}

.impact-value {
  display: block;
  font-size: 1.1em;
  font-weight: 700;
  color: #2ecc71;
}

.impact-unit {
  font-size: 0.8em;
  color: var(--text-secondary);
}

/* Sidebar */
.tracker-sidebar {
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

/* Category Breakdown */
.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-icon {
  font-size: 1.2em;
}

.cat-name {
  flex: 1;
  color: var(--text-color);
  font-size: 0.9em;
}

.cat-value {
  color: var(--text-secondary);
  font-size: 0.85em;
  font-weight: 600;
}

.cat-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.dark .cat-bar {
  background: rgba(255, 255, 255, 0.1);
}

.cat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  opacity: 0.5;
  filter: grayscale(1);
  transition: all 0.3s;
}

.dark .badge {
  background: rgba(255, 255, 255, 0.05);
}

.badge.unlocked {
  opacity: 1;
  filter: none;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(39, 174, 96, 0.1) 100%);
}

.badge-icon {
  font-size: 1.8em;
  margin-bottom: 5px;
}

.badge-name {
  font-size: 0.8em;
  color: var(--text-color);
  text-align: center;
}

.badge-progress {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.dark .badge-progress {
  background: rgba(255, 255, 255, 0.1);
}

.badge-progress .progress-fill {
  height: 100%;
  background: #2ecc71;
  border-radius: 2px;
}

/* Goal Progress */
.goal-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goal-circle {
  position: relative;
  width: 140px;
  height: 140px;
}

.goal-circle svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.goal-bg {
  fill: none;
  stroke: rgba(46, 204, 113, 0.2);
  stroke-width: 8;
}

.goal-fill {
  fill: none;
  stroke: #2ecc71;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s ease;
}

.goal-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.goal-current {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
  color: var(--text-color);
}

.goal-target {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.goal-message {
  margin: 15px 0 0;
  text-align: center;
  color: var(--text-color);
  font-size: 0.95em;
}

/* Tips Card */
.tips-card {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
}

.daily-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
}

.tip-icon {
  font-size: 2em;
}

.daily-tip p {
  margin: 0;
  color: var(--text-color);
  line-height: 1.5;
}

.refresh-tip {
  width: 100%;
  padding: 10px;
  border: none;
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.refresh-tip:hover {
  background: #2ecc71;
  color: white;
}

/* Responsive */
@media (max-width: 900px) {
  .tracker-container {
    grid-template-columns: 1fr;
  }
  
  .tracker-hero {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .tracker-hero {
    padding: 25px;
  }
  
  .hero-left h1 {
    font-size: 1.6em;
  }
  
  .stat-card {
    padding: 10px 15px;
  }
  
  .stat-value {
    font-size: 1.2em;
  }
  
  .quick-activities {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>