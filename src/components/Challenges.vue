<template>
  <div class="challenges-page">
    <!-- Hero Section -->
    <div class="challenges-hero">
      <div class="hero-content">
        <h1>🎯 {{ t('challenges.title') }}</h1>
        <p>{{ t('challenges.subtitle') }}</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">{{ completedCount }}</span>
          <span class="stat-label">{{ t('challenges.completed') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ totalPoints }}</span>
          <span class="stat-label">{{ t('challenges.pointsEarned') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ currentStreak }}</span>
          <span class="stat-label">{{ t('challenges.dayStreak') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ userRank }}</span>
          <span class="stat-label">{{ t('challenges.yourRank') }}</span>
        </div>
      </div>
    </div>

    <div class="challenges-container">
      <!-- Main Content -->
      <div class="challenges-main">
        <!-- Featured Challenge -->
        <div class="featured-challenge" v-if="featuredChallenge">
          <div class="featured-badge">⭐ Featured Challenge</div>
          <div class="featured-content">
            <div class="featured-icon">{{ featuredChallenge.icon }}</div>
            <div class="featured-info">
              <h2>{{ featuredChallenge.title }}</h2>
              <p>{{ featuredChallenge.description }}</p>
              <div class="featured-meta">
                <span class="meta-item">
                  <span class="meta-icon">🏆</span>
                  {{ featuredChallenge.points }} points
                </span>
                <span class="meta-item">
                  <span class="meta-icon">👥</span>
                  {{ featuredChallenge.participants }} participating
                </span>
                <span class="meta-item">
                  <span class="meta-icon">⏰</span>
                  {{ featuredChallenge.duration }}
                </span>
              </div>
              <div class="featured-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: featuredChallenge.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ featuredChallenge.progress }}% complete</span>
              </div>
            </div>
            <button 
              class="featured-btn"
              :class="{ joined: featuredChallenge.joined }"
              @click="toggleJoin(featuredChallenge)"
            >
              {{ featuredChallenge.joined ? '✓ Joined' : 'Join Challenge' }}
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-section">
          <div class="filter-tabs">
            <button 
              v-for="tab in filterTabs" 
              :key="tab.id"
              :class="['filter-tab', { active: activeFilter === tab.id }]"
              @click="activeFilter = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>
          <div class="sort-dropdown">
            <select v-model="sortBy">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="points">Highest Points</option>
            </select>
          </div>
        </div>

        <!-- Challenge Categories -->
        <div class="category-chips">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['category-chip', { active: activeCategory === cat.id }]"
            @click="activeCategory = activeCategory === cat.id ? 'all' : cat.id"
          >
            <span>{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        </div>

        <!-- Challenges Grid -->
        <div class="challenges-grid">
          <div 
            v-for="challenge in filteredChallenges" 
            :key="challenge.id" 
            :class="['challenge-card', { completed: challenge.completed, joined: challenge.joined }]"
          >
            <div class="card-header" :style="{ background: challenge.gradient }">
              <span class="challenge-icon">{{ challenge.icon }}</span>
              <div class="card-badges">
                <span v-if="challenge.isNew" class="badge new">NEW</span>
                <span v-if="challenge.isHot" class="badge hot">🔥 HOT</span>
                <span class="badge difficulty" :class="challenge.difficulty">
                  {{ challenge.difficulty }}
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="card-category">{{ getCategoryName(challenge.category) }}</div>
              <h3>{{ challenge.title }}</h3>
              <p>{{ challenge.description }}</p>
              
              <div class="card-stats">
                <div class="stat">
                  <span class="stat-icon">🏆</span>
                  <span>{{ challenge.points }} pts</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">👥</span>
                  <span>{{ challenge.participants }}</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">⏰</span>
                  <span>{{ challenge.daysLeft }}d left</span>
                </div>
              </div>

              <div v-if="challenge.joined && !challenge.completed" class="challenge-progress">
                <div class="progress-header">
                  <span>Progress</span>
                  <span>{{ challenge.currentProgress }}/{{ challenge.targetProgress }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: (challenge.currentProgress / challenge.targetProgress * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <div class="card-actions">
                <button 
                  v-if="challenge.completed"
                  class="action-btn completed"
                  disabled
                >
                  ✅ Completed
                </button>
                <button 
                  v-else-if="challenge.joined"
                  class="action-btn progress-btn"
                  @click="updateProgress(challenge)"
                >
                  📝 {{ t('challenges.logProgress') }}
                </button>
                <button 
                  v-else
                  class="action-btn join-btn"
                  @click="toggleJoin(challenge)"
                >
                  🚀 {{ t('challenges.joinChallenge') }}
                </button>
                <button class="share-btn" @click="shareChallenge(challenge)">
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredChallenges.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No challenges found</h3>
          <p>Try adjusting your filters or check back later for new challenges!</p>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="challenges-sidebar">
        <!-- Your Active Challenges -->
        <div class="sidebar-card">
          <h3>🎯 {{ t('challenges.yourActiveChallenges') }}</h3>
          <div v-if="activeChallenges.length === 0" class="no-active">
            <p>{{ t('challenges.noActiveYet') }}</p>
            <span class="hint">{{ t('challenges.browseAndJoin') }}</span>
          </div>
          <div v-else class="active-list">
            <div 
              v-for="challenge in activeChallenges" 
              :key="challenge.id"
              class="active-item"
            >
              <span class="active-icon">{{ challenge.icon }}</span>
              <div class="active-info">
                <span class="active-title">{{ challenge.title }}</span>
                <div class="mini-progress">
                  <div 
                    class="mini-fill" 
                    :style="{ width: (challenge.currentProgress / challenge.targetProgress * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <span class="active-days">{{ challenge.daysLeft }}d</span>
            </div>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="sidebar-card">
          <h3>🏅 {{ t('challenges.leaderboard') }}</h3>
          <div class="leaderboard">
            <div 
              v-for="(user, index) in leaderboard" 
              :key="user.id"
              :class="['leader-item', { 'is-you': user.isYou }]"
            >
              <span class="leader-rank" :class="'rank-' + (index + 1)">
                {{ index + 1 }}
              </span>
              <div class="leader-avatar" :style="{ background: user.avatarColor }">
                {{ user.initials }}
              </div>
              <div class="leader-info">
                <span class="leader-name">{{ user.name }}</span>
                <span class="leader-challenges">{{ user.completed }} challenges</span>
              </div>
              <span class="leader-points">{{ user.points }} pts</span>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="sidebar-card">
          <h3>🏆 Challenge Badges</h3>
          <div class="badges-grid">
            <div 
              v-for="badge in badges" 
              :key="badge.id"
              :class="['badge-item', { unlocked: badge.unlocked }]"
              :title="badge.description"
            >
              <span class="badge-icon">{{ badge.icon }}</span>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>

        <!-- Community Impact -->
        <div class="sidebar-card impact-card">
          <h3>🌍 {{ t('challenges.communityImpact') }}</h3>
          <div class="impact-stats">
            <div class="impact-item">
              <span class="impact-value">12,450</span>
              <span class="impact-label">{{ t('challenges.kgCo2Saved') }}</span>
            </div>
            <div class="impact-item">
              <span class="impact-value">3,200</span>
              <span class="impact-label">{{ t('challenges.treesPlanted') }}</span>
            </div>
            <div class="impact-item">
              <span class="impact-value">8,900</span>
              <span class="impact-label">{{ t('challenges.challengesDone') }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="modal-overlay" @click.self="showProgressModal = false">
      <div class="progress-modal">
        <button class="modal-close" @click="showProgressModal = false">✕</button>
        <div class="modal-header">
          <span class="modal-icon">{{ selectedChallenge?.icon }}</span>
          <h2>{{ selectedChallenge?.title }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ t('challenges.todaysProgress') }}:</p>
          <div class="progress-input-group">
            <label>{{ t('challenges.todaysProgress') }}</label>
            <div class="progress-input-row">
              <button class="increment-btn" @click="progressIncrement--">−</button>
              <input type="number" v-model.number="progressIncrement" min="1">
              <button class="increment-btn" @click="progressIncrement++">+</button>
            </div>
            <span class="input-hint">
              Current: {{ selectedChallenge?.currentProgress }}/{{ selectedChallenge?.targetProgress }}
            </span>
          </div>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showProgressModal = false">{{ t('common.cancel') }}</button>
            <button class="modal-btn confirm" @click="confirmProgress">{{ t('challenges.logProgress') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Challenges',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      activeFilter: 'all',
      activeCategory: 'all',
      sortBy: 'popular',
      showProgressModal: false,
      selectedChallenge: null,
      progressIncrement: 1,
      currentStreak: 5,
      userRank: '#12'
    }
  },
  computed: {
    filterTabs() {
      return [
        { id: 'all', icon: '📋', label: this.t('forum.all') },
        { id: 'active', icon: '🎯', label: this.t('challenges.active') },
        { id: 'completed', icon: '✅', label: this.t('challenges.completed') },
        { id: 'available', icon: '🆕', label: this.t('challenges.available') }
      ]
    },
    categories() {
      return [
        { id: 'transport', name: this.t('footprint.categories.transport'), icon: '🚲' },
        { id: 'energy', name: this.t('footprint.categories.energy'), icon: '⚡' },
        { id: 'waste', name: this.t('footprint.categories.waste'), icon: '♻️' },
        { id: 'food', name: this.t('footprint.categories.food'), icon: '🥗' },
        { id: 'nature', name: this.t('footprint.categories.nature'), icon: '🌳' },
        { id: 'lifestyle', name: this.t('calculator.lifestyle'), icon: '🛍️' }
      ]
    },
    challenges() {
      return [
        {
          id: 1,
          title: this.t('challenges.challengesList.plasticFreeTitle'),
          description: this.t('challenges.challengesList.plasticFreeDesc'),
          icon: '🚫',
          category: 'waste',
          points: 150,
          participants: 1234,
          daysLeft: 5,
          duration: `7 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          isNew: false,
          isHot: true,
          joined: true,
          completed: false,
          currentProgress: 4,
          targetProgress: 7,
          progress: 57
        },
        {
          id: 2,
          title: this.t('challenges.challengesList.bikeTitle'),
          description: this.t('challenges.challengesList.bikeDesc'),
          icon: '🚲',
          category: 'transport',
          points: 200,
          participants: 856,
          daysLeft: 12,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.hard'),
          gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          isNew: true,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 10,
          progress: 0
        },
        {
          id: 3,
          title: this.t('challenges.challengesList.meatlessTitle'),
          description: this.t('challenges.challengesList.meatlessDesc'),
          icon: '🥬',
          category: 'food',
          points: 100,
          participants: 2341,
          daysLeft: 18,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.easy'),
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          isNew: false,
          isHot: true,
          joined: true,
          completed: false,
          currentProgress: 2,
          targetProgress: 4,
          progress: 50
        },
        {
          id: 4,
          title: this.t('challenges.challengesList.energySaverTitle'),
          description: this.t('challenges.challengesList.energySaverDesc'),
          icon: '💡',
          category: 'energy',
          points: 175,
          participants: 678,
          daysLeft: 8,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 1,
          progress: 0
        },
        {
          id: 5,
          title: this.t('challenges.challengesList.zeroWasteTitle'),
          description: this.t('challenges.challengesList.zeroWasteDesc'),
          icon: '🛒',
          category: 'waste',
          points: 125,
          participants: 1567,
          daysLeft: 15,
          duration: `14 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.easy'),
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          isNew: true,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 5,
          progress: 0
        },
        {
          id: 6,
          title: this.t('challenges.challengesList.plantTreeTitle'),
          description: this.t('challenges.challengesList.plantTreeDesc'),
          icon: '🌱',
          category: 'nature',
          points: 300,
          participants: 432,
          daysLeft: 25,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: true,
          currentProgress: 1,
          targetProgress: 1,
          progress: 100
        },
        {
          id: 7,
          title: this.t('challenges.challengesList.coldShowerTitle'),
          description: this.t('challenges.challengesList.coldShowerDesc'),
          icon: '🚿',
          category: 'energy',
          points: 80,
          participants: 234,
          daysLeft: 3,
          duration: `5 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.hard'),
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 5,
          progress: 0
        },
        {
          id: 8,
          title: this.t('challenges.challengesList.secondhandTitle'),
          description: this.t('challenges.challengesList.secondhandDesc'),
          icon: '👕',
          category: 'lifestyle',
          points: 200,
          participants: 789,
          daysLeft: 20,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          isNew: true,
          isHot: true,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 30,
          progress: 0
        }
      ]
    },
    leaderboard() {
      return [
        { id: 1, name: 'EcoWarrior', initials: 'EW', avatarColor: '#2ecc71', points: 2450, completed: 18, isYou: false },
        { id: 2, name: 'GreenQueen', initials: 'GQ', avatarColor: '#9b59b6', points: 2280, completed: 16, isYou: false },
        { id: 3, name: 'NatureLover', initials: 'NL', avatarColor: '#3498db', points: 2150, completed: 15, isYou: false },
        { id: 4, name: 'Tomass', initials: 'T', avatarColor: '#e74c3c', points: 1820, completed: 12, isYou: true },
        { id: 5, name: 'EarthFirst', initials: 'EF', avatarColor: '#f39c12', points: 1650, completed: 11, isYou: false }
      ]
    },
    badges() {
      return [
        { id: 1, name: this.t('challenges.badges.firstStepName'), icon: '👣', description: this.t('challenges.badges.firstStepDesc'), unlocked: true },
        { id: 2, name: this.t('challenges.badges.weekWarriorName'), icon: '📅', description: this.t('challenges.badges.weekWarriorDesc'), unlocked: true },
        { id: 3, name: this.t('challenges.badges.ecoMasterName'), icon: '🌟', description: this.t('challenges.badges.ecoMasterDesc'), unlocked: true },
        { id: 4, name: this.t('challenges.badges.communityHeroName'), icon: '🦸', description: this.t('challenges.badges.communityHeroDesc'), unlocked: false },
        { id: 5, name: this.t('challenges.badges.planetSaverName'), icon: '🌍', description: this.t('challenges.badges.planetSaverDesc'), unlocked: false },
        { id: 6, name: this.t('challenges.badges.legendName'), icon: '👑', description: this.t('challenges.badges.legendDesc'), unlocked: false }
      ]
    },
    completedCount() {
      return this.challenges.filter(c => c.completed).length;
    },
    totalPoints() {
      return this.challenges
        .filter(c => c.completed)
        .reduce((sum, c) => sum + c.points, 0);
    },
    featuredChallenge() {
      return this.challenges.find(c => c.isHot && !c.completed) || this.challenges[0];
    },
    activeChallenges() {
      return this.challenges.filter(c => c.joined && !c.completed);
    },
    filteredChallenges() {
      let filtered = [...this.challenges];

      // Apply filter tab
      if (this.activeFilter === 'active') {
        filtered = filtered.filter(c => c.joined && !c.completed);
      } else if (this.activeFilter === 'completed') {
        filtered = filtered.filter(c => c.completed);
      } else if (this.activeFilter === 'available') {
        filtered = filtered.filter(c => !c.joined && !c.completed);
      }

      // Apply category filter
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(c => c.category === this.activeCategory);
      }

      // Apply sorting
      if (this.sortBy === 'popular') {
        filtered.sort((a, b) => b.participants - a.participants);
      } else if (this.sortBy === 'newest') {
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else if (this.sortBy === 'ending') {
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
      } else if (this.sortBy === 'points') {
        filtered.sort((a, b) => b.points - a.points);
      }

      return filtered;
    }
  },
  mounted() {
    this.fetchChallenges();
  },
  methods: {
    async fetchChallenges() {
      try {
        const response = await fetch('http://localhost:3000/api/challenges');
        const data = await response.json();
        // Merge fetched challenges with our rich demo data
        if (data.challenges && data.challenges.length > 0) {
          // In real app, use fetched data properly
          console.log('Fetched challenges:', data.challenges);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    },
    getCategoryName(categoryId) {
      const cat = this.categories.find(c => c.id === categoryId);
      return cat ? `${cat.icon} ${cat.name}` : categoryId;
    },
    toggleJoin(challenge) {
      challenge.joined = !challenge.joined;
      if (challenge.joined) {
        challenge.participants++;
      } else {
        challenge.participants--;
        challenge.currentProgress = 0;
      }
    },
    updateProgress(challenge) {
      this.selectedChallenge = challenge;
      this.progressIncrement = 1;
      this.showProgressModal = true;
    },
    confirmProgress() {
      if (this.selectedChallenge) {
        this.selectedChallenge.currentProgress += this.progressIncrement;
        if (this.selectedChallenge.currentProgress >= this.selectedChallenge.targetProgress) {
          this.selectedChallenge.currentProgress = this.selectedChallenge.targetProgress;
          this.selectedChallenge.completed = true;
          this.selectedChallenge.progress = 100;
          // Could show celebration here
        } else {
          this.selectedChallenge.progress = Math.round(
            (this.selectedChallenge.currentProgress / this.selectedChallenge.targetProgress) * 100
          );
        }
      }
      this.showProgressModal = false;
    },
    shareChallenge(challenge) {
      if (navigator.share) {
        navigator.share({
          title: challenge.title,
          text: `Join me in the "${challenge.title}" eco challenge! 🌍`,
          url: window.location.href
        });
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(
          `Join me in the "${challenge.title}" eco challenge! 🌍 ${window.location.href}`
        );
        alert('Challenge link copied to clipboard!');
      }
    }
  }
}
</script>

<style scoped>
.challenges-page {
  min-height: 100vh;
  padding: 80px 20px 60px;
  background: var(--bg-color);
}

/* Hero Section */
.challenges-hero {
  max-width: 1200px;
  margin: 0 auto 30px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.hero-content h1 {
  margin: 0 0 10px;
  font-size: 2.2em;
}

.hero-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.hero-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 25px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.85em;
  opacity: 0.9;
}

/* Container Layout */
.challenges-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

/* Featured Challenge */
.featured-challenge {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.featured-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.featured-content {
  display: flex;
  align-items: center;
  gap: 25px;
}

.featured-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
  flex-shrink: 0;
}

.featured-info {
  flex: 1;
}

.featured-info h2 {
  margin: 0 0 8px;
  color: var(--text-color);
}

.featured-info p {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.featured-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
  color: var(--text-color);
}

.meta-icon {
  font-size: 1.1em;
}

.featured-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.85em;
  color: var(--text-secondary);
  min-width: 80px;
}

.featured-btn {
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.featured-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.featured-btn.joined {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.dark .filter-tabs {
  background: rgba(255, 255, 255, 0.05);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9em;
  transition: all 0.2s;
}

.filter-tab:hover {
  background: rgba(102, 126, 234, 0.1);
}

.filter-tab.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .filter-tab.active {
  background: var(--card-bg);
}

.tab-icon {
  font-size: 1.1em;
}

.sort-dropdown select {
  padding: 10px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9em;
  cursor: pointer;
}

/* Category Chips */
.category-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 25px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.2s;
}

.category-chip:hover {
  border-color: #667eea;
}

.category-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* Challenges Grid */
.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.challenge-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.challenge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.challenge-card.completed {
  opacity: 0.8;
}

.card-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.challenge-icon {
  font-size: 2.5em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.new {
  background: #2ecc71;
  color: white;
}

.badge.hot {
  background: #e74c3c;
  color: white;
}

.badge.difficulty {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.badge.difficulty.easy {
  color: #27ae60;
}

.badge.difficulty.medium {
  color: #f39c12;
}

.badge.difficulty.hard {
  color: #e74c3c;
}

.card-body {
  padding: 0 20px 20px;
}

.card-category {
  font-size: 0.8em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.card-body h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1em;
}

.card-body p {
  margin: 0 0 15px;
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.card-stats .stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
  color: var(--text-color);
}

.stat-icon {
  font-size: 1em;
}

.challenge-progress {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.join-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.progress-btn {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.progress-btn:hover {
  background: #2ecc71;
  color: white;
}

.action-btn.completed {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  cursor: default;
}

.share-btn {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.2s;
  flex-shrink: 0;
}

.share-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 10px;
  color: var(--text-color);
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary);
}

/* Sidebar */
.challenges-sidebar {
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

/* Active Challenges */
.no-active {
  text-align: center;
  padding: 20px 10px;
}

.no-active p {
  margin: 0 0 5px;
  color: var(--text-color);
}

.no-active .hint {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.active-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.dark .active-item {
  background: rgba(255, 255, 255, 0.05);
}

.active-icon {
  font-size: 1.5em;
}

.active-info {
  flex: 1;
}

.active-title {
  display: block;
  font-size: 0.9em;
  color: var(--text-color);
  margin-bottom: 6px;
}

.mini-progress {
  height: 4px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.active-days {
  font-size: 0.85em;
  color: var(--text-secondary);
}

/* Leaderboard */
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leader-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.2s;
}

.leader-item.is-you {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.leader-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.85em;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.dark .leader-rank {
  background: rgba(255, 255, 255, 0.1);
}

.leader-rank.rank-1 {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
}

.leader-rank.rank-2 {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
  color: white;
}

.leader-rank.rank-3 {
  background: linear-gradient(135deg, #d68910 0%, #b9770e 100%);
  color: white;
}

.leader-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85em;
  font-weight: 600;
}

.leader-info {
  flex: 1;
}

.leader-name {
  display: block;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--text-color);
}

.leader-challenges {
  font-size: 0.75em;
  color: var(--text-secondary);
}

.leader-points {
  font-size: 0.9em;
  font-weight: 700;
  color: #667eea;
}

/* Badges */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  opacity: 0.4;
  filter: grayscale(1);
  transition: all 0.3s;
}

.dark .badge-item {
  background: rgba(255, 255, 255, 0.05);
}

.badge-item.unlocked {
  opacity: 1;
  filter: none;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.badge-icon {
  font-size: 1.8em;
  margin-bottom: 5px;
}

.badge-name {
  font-size: 0.7em;
  color: var(--text-color);
  text-align: center;
}

/* Impact Card */
.impact-card {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
}

.impact-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.impact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.impact-value {
  font-size: 1.2em;
  font-weight: 700;
  color: #2ecc71;
}

.impact-label {
  font-size: 0.9em;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.progress-modal {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1em;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.dark .modal-close {
  background: rgba(255, 255, 255, 0.1);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.modal-icon {
  font-size: 2em;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.3em;
}

.modal-body p {
  margin: 0 0 20px;
  color: var(--text-secondary);
}

.progress-input-group {
  margin-bottom: 25px;
}

.progress-input-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-color);
  font-weight: 600;
}

.progress-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.increment-btn {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 10px;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.2s;
}

.increment-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.progress-input-row input {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1.2em;
  text-align: center;
}

.input-hint {
  display: block;
  margin-top: 8px;
  font-size: 0.85em;
  color: var(--text-secondary);
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.dark .modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .challenges-container {
    grid-template-columns: 1fr;
  }

  .challenges-hero {
    flex-direction: column;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .featured-content {
    flex-direction: column;
    text-align: center;
  }

  .featured-meta {
    justify-content: center;
  }

  .featured-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .challenges-hero {
    padding: 25px;
  }

  .hero-content h1 {
    font-size: 1.6em;
  }

  .hero-stat {
    padding: 12px 18px;
  }

  .stat-number {
    font-size: 1.4em;
  }

  .filter-tabs {
    width: 100%;
    justify-content: center;
  }

  .filter-tab span:last-child {
    display: none;
  }

  .challenges-grid {
    grid-template-columns: 1fr;
  }

  .badges-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>