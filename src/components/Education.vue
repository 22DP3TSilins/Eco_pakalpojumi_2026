<template>
  <div class="education-page">
    <!-- Hero Section -->
    <div class="education-hero">
      <div class="hero-content">
        <h1>📚 {{ t('education.title') }}</h1>
        <p>{{ t('education.subtitle') }}</p>
        <div class="hero-search">
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="t('education.searchPlaceholder')"
            class="search-input"
          >
          <button class="search-btn">🔍</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-icon">📖</span>
          <span class="stat-value">{{ articles.length }}</span>
          <span class="stat-label">{{ t('education.articles') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-icon">🎬</span>
          <span class="stat-value">{{ videos.length }}</span>
          <span class="stat-label">{{ t('education.videos') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-icon">📋</span>
          <span class="stat-value">{{ guides.length }}</span>
          <span class="stat-label">{{ t('education.guides') }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Topics -->
    <div class="quick-topics">
      <h2>🎯 {{ t('education.quickTopics') }}</h2>
      <div class="topics-grid">
        <button 
          v-for="topic in topics" 
          :key="topic.id"
          :class="['topic-card', { active: selectedTopic === topic.id }]"
          @click="selectTopic(topic.id)"
        >
          <span class="topic-icon">{{ topic.icon }}</span>
          <span class="topic-name">{{ topic.name }}</span>
        </button>
      </div>
    </div>

    <!-- Featured Section -->
    <div class="featured-section" v-if="featuredContent">
      <div class="featured-card">
        <div class="featured-badge">⭐ {{ t('education.featured') }}</div>
        <div class="featured-image">
          <span class="featured-emoji">{{ featuredContent.icon }}</span>
        </div>
        <div class="featured-content">
          <span class="featured-type">{{ featuredContent.type }}</span>
          <h2>{{ featuredContent.title }}</h2>
          <p>{{ featuredContent.description }}</p>
          <div class="featured-meta">
            <span>⏱️ {{ featuredContent.readTime }}</span>
            <span>📅 {{ featuredContent.date }}</span>
          </div>
          <button class="featured-btn" @click="openContent(featuredContent)">
            {{ t('education.startLearning') }} →
          </button>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="content-section">
      <div class="section-header">
        <h2>📚 {{ t('education.learningResources') }}</h2>
        <div class="tab-buttons">
          <button 
            :class="['tab-btn', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            {{ t('education.all') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'articles' }]"
            @click="activeTab = 'articles'"
          >
            📖 {{ t('education.articles') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'videos' }]"
            @click="activeTab = 'videos'"
          >
            🎬 {{ t('education.videos') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'guides' }]"
            @click="activeTab = 'guides'"
          >
            📋 {{ t('education.guides') }}
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <article 
          v-for="item in filteredContent" 
          :key="item.id" 
          class="content-card"
          @click="openContent(item)"
        >
          <div class="card-image" :style="{ background: getGradient(item.type) }">
            <span class="card-emoji">{{ item.icon }}</span>
            <span class="card-type-badge">{{ getTypeBadge(item.type) }}</span>
          </div>
          <div class="card-body">
            <div class="card-tags">
              <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ truncate(item.description, 100) }}</p>
            <div class="card-footer">
              <span class="card-meta">⏱️ {{ item.readTime }}</span>
              <span class="card-difficulty" :class="item.difficulty">
                {{ item.difficulty }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="filteredContent.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>{{ t('education.noContentFound') }}</h3>
        <p>{{ t('education.tryAdjusting') }}</p>
      </div>
    </div>

    <!-- Learning Paths -->
    <div class="learning-paths">
      <h2>🛤️ {{ t('education.learningPaths') }}</h2>
      <p class="section-desc">{{ t('education.learningPathsDesc') }}</p>
      <div class="paths-grid">
        <div v-for="path in learningPaths" :key="path.id" class="path-card">
          <div class="path-header" :style="{ background: path.color }">
            <span class="path-icon">{{ path.icon }}</span>
            <span class="path-level">{{ path.level }}</span>
          </div>
          <div class="path-body">
            <h3>{{ path.title }}</h3>
            <p>{{ path.description }}</p>
            <div class="path-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getPathProgress(path.id) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getPathProgress(path.id) }}% {{ t('education.complete') }}</span>
            </div>
            <div class="path-modules">
              <span>📚 {{ path.modules }} {{ t('education.modules') }}</span>
              <span>⏱️ {{ path.duration }}</span>
            </div>
            <button class="path-btn" @click="startLearningPath(path)">
              {{ getPathProgress(path.id) > 0 ? t('education.continue') : t('education.startPath') }} →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips Carousel -->
    <div class="tips-section">
      <h2>💡 {{ t('education.dailyEcoTips') }}</h2>
      <div class="tips-carousel">
        <div class="tip-slide" v-for="(tip, index) in dailyTips" :key="index">
          <div class="tip-number">{{ index + 1 }}</div>
          <div class="tip-content">
            <span class="tip-icon">{{ tip.icon }}</span>
            <h4>{{ tip.title }}</h4>
            <p>{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Modal -->
    <div v-if="selectedContent" class="content-modal" @click.self="selectedContent = null">
      <div class="modal-content">
        <button class="modal-close" @click="selectedContent = null">✕</button>
        <div class="modal-header" :style="{ background: getGradient(selectedContent.type) }">
          <span class="modal-emoji">{{ selectedContent.icon }}</span>
        </div>
        <div class="modal-body">
          <span class="modal-type">{{ selectedContent.type }}</span>
          <h2>{{ selectedContent.title }}</h2>
          <div class="modal-meta">
            <span>⏱️ {{ selectedContent.readTime }}</span>
            <span>📅 {{ selectedContent.date }}</span>
            <span :class="['difficulty', selectedContent.difficulty]">{{ selectedContent.difficulty }}</span>
          </div>
          <div class="modal-text">
            {{ selectedContent.fullContent }}
          </div>
          <div class="modal-tags">
            <span v-for="tag in selectedContent.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="modal-actions">
            <button 
              class="action-btn" 
              :class="{ saved: isContentSaved(selectedContent.id) }"
              @click="toggleSaveContent(selectedContent)"
            >
              {{ isContentSaved(selectedContent.id) ? '✓' : '🔖' }} {{ t('education.save') }}
            </button>
            <button class="action-btn" @click="shareContent(selectedContent)">
              🔗 {{ t('education.share') }}
            </button>
            <button 
              class="action-btn primary" 
              :class="{ completed: isContentCompleted(selectedContent.id) }"
              @click="toggleCompleteContent(selectedContent)"
            >
              {{ isContentCompleted(selectedContent.id) ? '✓' : '✅' }} {{ t('education.markComplete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast-notification" :class="toastType">
        <span class="toast-icon">{{ toastType === 'success' ? '✓' : 'ℹ️' }}</span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Education',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      posts: [],
      searchQuery: '',
      selectedTopic: null,
      activeTab: 'all',
      selectedContent: null,
      savedContent: [],
      completedContent: [],
      pathProgress: {},
      toastMessage: '',
      toastType: 'success'
    }
  },
  computed: {
    topics() {
      return [
        { id: 'energy', name: this.t('education.topics.energy'), icon: '⚡' },
        { id: 'waste', name: this.t('education.topics.waste'), icon: '♻️' },
        { id: 'food', name: this.t('education.topics.food'), icon: '🥗' },
        { id: 'transport', name: this.t('education.topics.transport'), icon: '🚲' },
        { id: 'home', name: this.t('education.topics.home'), icon: '🏠' },
        { id: 'garden', name: this.t('education.topics.garden'), icon: '🌱' },
        { id: 'fashion', name: this.t('education.topics.fashion'), icon: '👕' },
        { id: 'water', name: this.t('education.topics.water'), icon: '💧' }
      ]
    },
    allContent() {
      return [
        {
          id: 1,
          type: 'article',
          icon: '🌍',
          title: this.t('education.content.carbonFootprintTitle'),
          description: this.t('education.content.carbonFootprintDesc'),
          fullContent: this.t('education.content.carbonFootprintFull'),
          readTime: `5 ${this.t('education.minRead')}`,
          date: 'Jan 15, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Climate', 'Basics'],
          topic: 'energy'
        },
        {
          id: 2,
          type: 'video',
          icon: '🎬',
          title: this.t('education.content.compostTitle'),
          description: this.t('education.content.compostDesc'),
          fullContent: this.t('education.content.compostFull'),
          readTime: `12 ${this.t('education.minWatch')}`,
          date: 'Jan 14, 2026',
          difficulty: this.t('education.intermediate'),
          tags: ['DIY', 'Garden'],
          topic: 'garden'
        },
        {
          id: 3,
          type: 'guide',
          icon: '📋',
          title: this.t('education.content.zeroWasteTitle'),
          description: this.t('education.content.zeroWasteDesc'),
          fullContent: this.t('education.content.zeroWasteFull'),
          readTime: `15 ${this.t('education.minRead')}`,
          date: 'Jan 13, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Zero Waste', 'Kitchen'],
          topic: 'waste'
        },
        {
          id: 4,
          type: 'article',
          icon: '🚲',
          title: this.t('education.content.cyclingTitle'),
          description: this.t('education.content.cyclingDesc'),
          fullContent: this.t('education.content.cyclingFull'),
          readTime: `6 ${this.t('education.minRead')}`,
          date: 'Jan 12, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Transport', 'Health'],
          topic: 'transport'
        },
        {
          id: 5,
          type: 'video',
          icon: '🌿',
          title: this.t('education.content.plantsTitle'),
          description: this.t('education.content.plantsDesc'),
          fullContent: this.t('education.content.plantsFull'),
          readTime: `8 ${this.t('education.minWatch')}`,
          date: 'Jan 11, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Home', 'Plants'],
          topic: 'home'
        },
        {
          id: 6,
          type: 'guide',
          icon: '👗',
          title: this.t('education.content.wardrobeTitle'),
          description: this.t('education.content.wardrobeDesc'),
          fullContent: this.t('education.content.wardrobeFull'),
          readTime: `10 ${this.t('education.minRead')}`,
          date: 'Jan 10, 2026',
          difficulty: this.t('education.intermediate'),
          tags: ['Fashion', 'Minimalism'],
          topic: 'fashion'
        },
        {
          id: 7,
          type: 'article',
          icon: '💧',
          title: this.t('education.content.waterTitle'),
          description: this.t('education.content.waterDesc'),
          fullContent: this.t('education.content.waterFull'),
          readTime: `7 ${this.t('education.minRead')}`,
          date: 'Jan 9, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Water', 'Home'],
          topic: 'water'
        },
        {
          id: 8,
          type: 'guide',
          icon: '🥕',
          title: this.t('education.content.seasonalTitle'),
          description: this.t('education.content.seasonalDesc'),
          fullContent: this.t('education.content.seasonalFull'),
          readTime: `12 ${this.t('education.minRead')}`,
          date: 'Jan 8, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Food', 'Seasonal'],
          topic: 'food'
        },
        {
          id: 9,
          type: 'video',
          icon: '☀️',
          title: this.t('education.content.solarTitle'),
          description: this.t('education.content.solarDesc'),
          fullContent: this.t('education.content.solarFull'),
          readTime: `15 ${this.t('education.minWatch')}`,
          date: 'Jan 7, 2026',
          difficulty: this.t('education.advanced'),
          tags: ['Energy', 'Home'],
          topic: 'energy'
        }
      ]
    },
    learningPaths() {
      return [
        {
          id: 1,
          icon: '🌱',
          title: this.t('education.paths.zeroWasteTitle'),
          description: this.t('education.paths.zeroWasteDesc'),
          level: this.t('education.beginner'),
          modules: 8,
          duration: `4 ${this.t('education.paths.weeks')}`,
          progress: 25,
          color: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
        },
        {
          id: 2,
          icon: '🏠',
          title: this.t('education.paths.ecoHomeTitle'),
          description: this.t('education.paths.ecoHomeDesc'),
          level: this.t('education.intermediate'),
          modules: 12,
          duration: `6 ${this.t('education.paths.weeks')}`,
          progress: 0,
          color: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
        },
        {
          id: 3,
          icon: '🥗',
          title: this.t('education.paths.sustainableEatingTitle'),
          description: this.t('education.paths.sustainableEatingDesc'),
          level: this.t('education.beginner'),
          modules: 10,
          duration: `5 ${this.t('education.paths.weeks')}`,
          progress: 60,
          color: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
        }
      ]
    },
    dailyTips() {
      return [
        {
          icon: '🚿',
          title: this.t('education.tips.shorterShowersTitle'),
          description: this.t('education.tips.shorterShowersDesc')
        },
        {
          icon: '🔌',
          title: this.t('education.tips.unplugTitle'),
          description: this.t('education.tips.unplugDesc')
        },
        {
          icon: '🛍️',
          title: this.t('education.tips.bagsTitle'),
          description: this.t('education.tips.bagsDesc')
        },
        {
          icon: '🌡️',
          title: this.t('education.tips.thermostatTitle'),
          description: this.t('education.tips.thermostatDesc')
        },
        {
          icon: '🥡',
          title: this.t('education.tips.mealPrepTitle'),
          description: this.t('education.tips.mealPrepDesc')
        }
      ]
    },
    articles() {
      return this.allContent.filter(c => c.type === 'article');
    },
    videos() {
      return this.allContent.filter(c => c.type === 'video');
    },
    guides() {
      return this.allContent.filter(c => c.type === 'guide');
    },
    featuredContent() {
      return this.allContent[0];
    },
    filteredContent() {
      let content = [...this.allContent];
      
      // Filter by tab
      if (this.activeTab !== 'all') {
        const typeMap = { articles: 'article', videos: 'video', guides: 'guide' };
        content = content.filter(c => c.type === typeMap[this.activeTab]);
      }
      
      // Filter by topic
      if (this.selectedTopic) {
        content = content.filter(c => c.topic === this.selectedTopic);
      }
      
      // Filter by search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        content = content.filter(c => 
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      
      return content;
    }
  },
  mounted() {
    this.fetchPosts();
    this.loadFromLocalStorage();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/education');
        const data = await response.json();
        this.posts = data.posts || [];
      } catch (error) {
        console.error('Error fetching education posts:', error);
      }
    },
    selectTopic(topicId) {
      this.selectedTopic = this.selectedTopic === topicId ? null : topicId;
    },
    openContent(item) {
      this.selectedContent = item;
    },
    truncate(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    getTypeBadge(type) {
      const badges = { article: '📖', video: '🎬', guide: '📋' };
      return badges[type] || '📄';
    },
    getGradient(type) {
      const gradients = {
        article: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        video: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        guide: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      };
      return gradients[type] || 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
    },
    isContentSaved(id) {
      return this.savedContent.includes(id);
    },
    isContentCompleted(id) {
      return this.completedContent.includes(id);
    },
    toggleSaveContent(content) {
      const index = this.savedContent.indexOf(content.id);
      if (index === -1) {
        this.savedContent.push(content.id);
        this.showToast(this.t('education.contentSaved') || 'Saturs saglabāts!', 'success');
      } else {
        this.savedContent.splice(index, 1);
        this.showToast(this.t('education.contentUnsaved') || 'Saturs noņemts no saglabātajiem', 'info');
      }
      this.saveTolocalStorage();
    },
    toggleCompleteContent(content) {
      const index = this.completedContent.indexOf(content.id);
      if (index === -1) {
        this.completedContent.push(content.id);
        this.showToast(this.t('education.contentCompleted') || 'Apsveicam! Saturs atzīmēts kā pabeigts!', 'success');
      } else {
        this.completedContent.splice(index, 1);
        this.showToast(this.t('education.contentIncomplete') || 'Saturs atzīmēts kā nepabeigts', 'info');
      }
      this.saveTolocalStorage();
    },
    async shareContent(content) {
      const shareData = {
        title: content.title,
        text: content.description,
        url: window.location.href
      };
      
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          this.showToast(this.t('education.shareSuccess') || 'Paldies par dalīšanos!', 'success');
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(`${content.title}\n\n${content.description}\n\n${window.location.href}`);
          this.showToast(this.t('education.copiedToClipboard') || 'Saite nokopēta starpliktuvē!', 'success');
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Try clipboard as fallback
        try {
          await navigator.clipboard.writeText(window.location.href);
          this.showToast(this.t('education.copiedToClipboard') || 'Saite nokopēta starpliktuvē!', 'success');
        } catch (e) {
          this.showToast(this.t('education.shareError') || 'Neizdevās dalīties', 'error');
        }
      }
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    saveTolocalStorage() {
      localStorage.setItem('education_saved', JSON.stringify(this.savedContent));
      localStorage.setItem('education_completed', JSON.stringify(this.completedContent));
      localStorage.setItem('education_pathProgress', JSON.stringify(this.pathProgress));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('education_saved');
      const completed = localStorage.getItem('education_completed');
      const pathProgress = localStorage.getItem('education_pathProgress');
      if (saved) this.savedContent = JSON.parse(saved);
      if (completed) this.completedContent = JSON.parse(completed);
      if (pathProgress) this.pathProgress = JSON.parse(pathProgress);
    },
    getPathProgress(pathId) {
      return this.pathProgress[pathId] || 0;
    },
    startLearningPath(path) {
      // Increment progress by 10-15% each time (simulating module completion)
      const currentProgress = this.pathProgress[path.id] || 0;
      if (currentProgress >= 100) {
        this.showToast(this.t('education.pathCompleted') || 'Apsveicam! Ceļš pabeigts!', 'success');
        return;
      }
      
      const increment = Math.min(Math.floor(100 / path.modules), 100 - currentProgress);
      this.pathProgress[path.id] = Math.min(currentProgress + increment, 100);
      
      if (this.pathProgress[path.id] >= 100) {
        this.showToast(this.t('education.pathCompleted') || 'Apsveicam! Ceļš pabeigts!', 'success');
      } else {
        this.showToast(this.t('education.pathProgressUpdated') || `Progress: ${this.pathProgress[path.id]}%`, 'success');
      }
      
      this.saveTolocalStorage();
    }
  }
}
</script>

<style scoped>
.education-page {
  min-height: 100vh;
  padding: 80px 20px 60px;
  background: var(--bg-color);
}

/* Hero Section */
.education-hero {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 50px 40px;
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
  font-size: 2.5em;
}

.hero-content p {
  margin: 0 0 25px;
  opacity: 0.9;
  font-size: 1.15em;
}

.hero-search {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1em;
  width: 300px;
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.3);
}

.search-btn {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #764ba2;
  font-size: 1.1em;
  cursor: pointer;
  transition: transform 0.2s;
}

.search-btn:hover {
  transform: scale(1.05);
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-icon {
  font-size: 1.8em;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.85;
}

/* Quick Topics */
.quick-topics {
  max-width: 1200px;
  margin: 0 auto 40px;
}

.quick-topics h2 {
  color: var(--text-color);
  margin: 0 0 20px;
  font-size: 1.5em;
}

.topics-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.topic-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
}

.topic-card:hover {
  border-color: #2ecc71;
  transform: translateY(-2px);
}

.topic-card.active {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-color: transparent;
  color: white;
}

.topic-icon {
  font-size: 1.3em;
}

.topic-name {
  font-weight: 500;
}

/* Featured Section */
.featured-section {
  max-width: 1200px;
  margin: 0 auto 40px;
}

.featured-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--card-bg);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.featured-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9em;
  z-index: 1;
}

.featured-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.featured-emoji {
  font-size: 5em;
}

.featured-content {
  padding: 30px;
}

.featured-type {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.featured-content h2 {
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 1.8em;
}

.featured-content p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 15px;
}

.featured-meta {
  display: flex;
  gap: 20px;
  color: var(--text-secondary);
  font-size: 0.9em;
  margin-bottom: 20px;
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
}

.featured-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5em;
}

.tab-buttons {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.95em;
  transition: all 0.2s;
}

.dark .tab-btn {
  background: rgba(255, 255, 255, 0.08);
}

.tab-btn.active {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.content-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-emoji {
  font-size: 4em;
}

.card-type-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

.card-body {
  padding: 20px;
}

.card-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.card-tag {
  padding: 4px 10px;
  background: rgba(46, 204, 113, 0.1);
  color: #27ae60;
  border-radius: 12px;
  font-size: 0.8em;
}

.card-body h3 {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1.15em;
}

.card-body p {
  margin: 0 0 15px;
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  color: var(--text-secondary);
  font-size: 0.85em;
}

.card-difficulty {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.8em;
  font-weight: 600;
}

.card-difficulty.Beginner {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.card-difficulty.Intermediate {
  background: rgba(243, 156, 18, 0.15);
  color: #f39c12;
}

.card-difficulty.Advanced {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: 20px;
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
  color: var(--text-secondary);
}

/* Learning Paths */
.learning-paths {
  max-width: 1200px;
  margin: 0 auto 50px;
}

.learning-paths h2 {
  color: var(--text-color);
  margin: 0 0 8px;
  font-size: 1.5em;
}

.section-desc {
  color: var(--text-secondary);
  margin: 0 0 25px;
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.path-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.path-card:hover {
  transform: translateY(-5px);
}

.path-header {
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.path-icon {
  font-size: 2.5em;
}

.path-level {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

.path-body {
  padding: 25px;
}

.path-body h3 {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1.3em;
}

.path-body p {
  margin: 0 0 20px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.path-progress {
  margin-bottom: 15px;
}

.progress-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.dark .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  border-radius: 4px;
  transition: width 0.5s;
}

.progress-text {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.path-modules {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.path-btn {
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

.path-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

/* Tips Section */
.tips-section {
  max-width: 1200px;
  margin: 0 auto 50px;
}

.tips-section h2 {
  color: var(--text-color);
  margin: 0 0 25px;
  font-size: 1.5em;
}

.tips-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.tip-slide {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 25px;
  position: relative;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.tip-number {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.tip-icon {
  font-size: 2.5em;
  display: block;
  margin-bottom: 15px;
}

.tip-content h4 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1em;
}

.tip-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
}

/* Content Modal */
.content-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: var(--card-bg);
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  color: white;
  z-index: 1;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-header {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-emoji {
  font-size: 5em;
}

.modal-body {
  padding: 30px;
}

.modal-type {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.modal-body h2 {
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 1.8em;
}

.modal-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.modal-meta .difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.modal-text {
  color: var(--text-color);
  line-height: 1.8;
  margin-bottom: 25px;
}

.modal-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.modal-tags .tag {
  padding: 6px 14px;
  background: rgba(46, 204, 113, 0.1);
  color: #27ae60;
  border-radius: 20px;
  font-size: 0.9em;
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.95em;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .education-hero {
    flex-direction: column;
    text-align: center;
    padding: 35px 25px;
  }
  
  .hero-content h1 {
    font-size: 1.8em;
  }
  
  .search-input {
    width: 100%;
  }
  
  .hero-search {
    width: 100%;
    max-width: 400px;
  }
  
  .featured-card {
    grid-template-columns: 1fr;
  }
  
  .featured-image {
    min-height: 180px;
  }
}

@media (max-width: 600px) {
  .topics-grid {
    justify-content: center;
  }
  
  .topic-card {
    padding: 10px 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tab-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .modal-body h2 {
    font-size: 1.4em;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: #2ecc71;
  color: white;
  border-radius: 12px;
  font-weight: 500;
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.toast-notification.info {
  background: #3498db;
}

.toast-notification.error {
  background: #e74c3c;
}

.toast-icon {
  font-size: 1.2em;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Button States */
.action-btn.saved {
  border-color: #f39c12;
  color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
}

.action-btn.completed {
  background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%) !important;
}

.action-btn.completed:hover {
  background: linear-gradient(135deg, #1e8449 0%, #145a32 100%) !important;
}
</style>