<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">🌱 {{ t('home.heroTitle') }}</div>
        <h1>Eco Pakalpojumi</h1>
        <p class="hero-subtitle">
          {{ t('home.heroSubtitle') }}
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="hero-btn primary">
            🛍️ {{ t('home.shopProducts') }}
          </router-link>
          <router-link to="/calculator" class="hero-btn secondary">
            🧮 {{ t('home.calculateFootprint') }}
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.totalUsers) }}+</span>
            <span class="stat-text">{{ t('home.activeUsers') }}</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.totalCo2Saved) }}</span>
            <span class="stat-text">{{ t('home.co2Saved') }}</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.treesPlanted) }}</span>
            <span class="stat-text">{{ t('home.treesPlanted') }}</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-card fc-1">🌍</div>
        <div class="floating-card fc-2">♻️</div>
        <div class="floating-card fc-3">🌱</div>
        <div class="floating-card fc-4">💚</div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="section-header">
        <h2>{{ t('home.whyChooseUs') }}</h2>
        <p>{{ t('home.joinThousands') }}</p>
      </div>
      <div class="features-grid">
        <router-link to="/products" class="feature-card">
          <div class="feature-icon">🛍️</div>
          <h3>{{ t('home.sustainableProducts') }}</h3>
          <p>{{ t('home.sustainableProductsDesc') }}</p>
          <span class="feature-link">{{ t('home.browseProducts') }}</span>
        </router-link>

        <router-link to="/calculator" class="feature-card">
          <div class="feature-icon">🧮</div>
          <h3>{{ t('home.carbonCalculator') }}</h3>
          <p>{{ t('home.carbonCalculatorDesc') }}</p>
          <span class="feature-link">{{ t('home.tryCalculator') }}</span>
        </router-link>

        <router-link to="/forum" class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>{{ t('home.communityForum') }}</h3>
          <p>{{ t('home.communityForumDesc') }}</p>
          <span class="feature-link">{{ t('home.joinDiscussion') }}</span>
        </router-link>

        <router-link to="/challenges" class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>{{ t('home.ecoChallenges') }}</h3>
          <p>{{ t('home.ecoChallengesDesc') }}</p>
          <span class="feature-link">{{ t('home.viewChallenges') }}</span>
        </router-link>

        <router-link to="/education" class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>{{ t('home.educationHub') }}</h3>
          <p>{{ t('home.educationHubDesc') }}</p>
          <span class="feature-link">{{ t('home.startLearning') }}</span>
        </router-link>

        <router-link to="/footprint" class="feature-card">
          <div class="feature-icon">👣</div>
          <h3>{{ t('home.footprintTracker') }}</h3>
          <p>{{ t('home.footprintTrackerDesc') }}</p>
          <span class="feature-link">{{ t('home.trackProgress') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Impact Section -->
    <div class="impact-section">
      <div class="section-header light">
        <h2>{{ t('home.ourImpact') }}</h2>
        <p>{{ t('home.impactSubtitle') }}</p>
      </div>
      <div class="impact-grid">
        <div class="impact-card">
          <div class="impact-icon">🌳</div>
          <div class="impact-value">{{ globalStats.treesPlanted.toLocaleString() }}</div>
          <div class="impact-label">{{ t('home.treesPlantedImpact') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.treesPlanted / 5000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">♻️</div>
          <div class="impact-value">{{ Math.floor(globalStats.totalActivities / 10) }} t</div>
          <div class="impact-label">{{ t('home.plasticDiverted') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalActivities / 1000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">⚡</div>
          <div class="impact-value">{{ formatNumber(globalStats.totalCo2Saved * 2) }} kWh</div>
          <div class="impact-label">{{ t('home.cleanEnergy') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalCo2Saved / 50000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">🚗</div>
          <div class="impact-value">{{ globalStats.totalCo2Saved.toLocaleString() }} kg</div>
          <div class="impact-label">{{ t('home.co2SavedImpact') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalCo2Saved / 100000) * 100, 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="how-section">
      <div class="section-header">
        <h2>{{ t('home.howItWorks') }}</h2>
        <p>{{ t('home.howItWorksSubtitle') }}</p>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-icon">📊</div>
          <h3>{{ t('home.stepCalculate') }}</h3>
          <p>{{ t('home.stepCalculateDesc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-icon">🎯</div>
          <h3>{{ t('home.stepTakeAction') }}</h3>
          <p>{{ t('home.stepTakeActionDesc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-icon">📈</div>
          <h3>{{ t('home.stepTrackProgress') }}</h3>
          <p>{{ t('home.stepTrackProgressDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <div class="cta-content">
        <h2>{{ t('home.readyToMakeDifference') }}</h2>
        <p>{{ t('home.ctaSubtitle') }}</p>
        <div class="cta-actions">
          <router-link to="/register" class="cta-btn primary">
            🌱 {{ t('home.getStartedFree') }}
          </router-link>
          <router-link to="/education" class="cta-btn secondary">
            📚 {{ t('home.learnMore') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="testimonials-section">
      <div class="section-header">
        <h2>{{ t('home.testimonials') }}</h2>
        <p>{{ t('home.testimonialsSubtitle') }}</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial1') }}"</div>
          <div class="author">
            <div class="avatar">👩</div>
            <div class="author-info">
              <span class="name">Anna K.</span>
              <span class="role">Eko Karotāja kopš 2024</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial2') }}"</div>
          <div class="author">
            <div class="avatar">👨</div>
            <div class="author-info">
              <span class="name">Jānis M.</span>
              <span class="role">150 izaicinājumi pabeigti</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial3') }}"</div>
          <div class="author">
            <div class="avatar">👩‍🦰</div>
            <div class="author-info">
              <span class="name">Līga B.</span>
              <span class="role">Foruma moderatore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'HomePage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      globalStats: {
        totalUsers: 0,
        totalCo2Saved: 0,
        treesPlanted: 0,
        totalActivities: 0
      }
    }
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3000/api/stats/global')
      if (response.ok) {
        const data = await response.json()
        this.globalStats = data
      }
    } catch (error) {
      console.error('Error fetching global stats:', error)
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-color);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  padding: 100px 20px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 50%, #1abc9c 100%);
}

.hero-bg-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation: float 20s infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  animation: float 15s infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 60%;
  animation: float 25s infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -30px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(30px, 10px); }
}

.hero-content {
  max-width: 650px;
  text-align: center;
  z-index: 10;
  color: white;
}

.hero-badge {
  display: inline-block;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  font-size: 0.95em;
  margin-bottom: 25px;
  backdrop-filter: blur(10px);
}

.hero-content h1 {
  font-size: 4em;
  font-weight: 800;
  margin: 0 0 20px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.25em;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 35px;
}

.hero-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.hero-btn {
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 1.05em;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-btn.primary {
  background: white;
  color: #27ae60;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.hero-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.2em;
  font-weight: 700;
}

.stat-text {
  font-size: 0.95em;
  opacity: 0.9;
}

.hero-visual {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  backdrop-filter: blur(10px);
  animation: floatCard 6s infinite ease-in-out;
}

.fc-1 { top: 20%; left: 10%; animation-delay: 0s; }
.fc-2 { top: 30%; right: 15%; animation-delay: 1s; }
.fc-3 { bottom: 25%; left: 15%; animation-delay: 2s; }
.fc-4 { bottom: 35%; right: 10%; animation-delay: 3s; }

@keyframes floatCard {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 2.5em;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 12px;
}

.section-header p {
  font-size: 1.15em;
  color: var(--text-secondary);
  margin: 0;
}

.section-header.light h2,
.section-header.light p {
  color: white;
}

/* Features Section */
.features-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.feature-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  border-color: #2ecc71;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(39, 174, 96, 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 1.3em;
}

.feature-card p {
  margin: 0 0 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.feature-link {
  color: #2ecc71;
  font-weight: 600;
  font-size: 0.95em;
}

/* Impact Section */
.impact-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
}

.impact-grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}

.impact-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  color: white;
}

.impact-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.impact-value {
  font-size: 2.2em;
  font-weight: 700;
  margin-bottom: 5px;
}

.impact-label {
  opacity: 0.9;
  margin-bottom: 15px;
}

.impact-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 1s ease;
}

/* How It Works Section */
.how-section {
  padding: 80px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.steps-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.step-card {
  background: var(--card-bg);
  padding: 35px 30px;
  border-radius: 20px;
  text-align: center;
  width: 280px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  position: relative;
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1em;
}

.step-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.step-card h3 {
  margin: 0 0 12px;
  color: var(--text-color);
}

.step-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.95em;
}

.step-arrow {
  font-size: 2em;
  color: #2ecc71;
  font-weight: 700;
}

/* CTA Section */
.cta-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.08) 0%, rgba(39, 174, 96, 0.05) 100%);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5em;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 15px;
}

.cta-content p {
  font-size: 1.15em;
  color: var(--text-secondary);
  margin: 0 0 30px;
}

.cta-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 16px 35px;
  border-radius: 30px;
  font-size: 1.05em;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cta-btn.primary {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(46, 204, 113, 0.4);
}

.cta-btn.secondary {
  background: var(--card-bg);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.cta-btn.secondary:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

/* Testimonials Section */
.testimonials-section {
  padding: 80px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.testimonial-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
}

.quote {
  font-size: 1.1em;
  font-style: italic;
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 20px;
  position: relative;
  padding-left: 20px;
}

.quote::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -5px;
  font-size: 2em;
  color: #2ecc71;
  font-style: normal;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(39, 174, 96, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  color: var(--text-color);
}

.role {
  font-size: 0.9em;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 900px) {
  .hero-content h1 {
    font-size: 3em;
  }

  .hero-stats {
    gap: 30px;
  }

  .floating-card {
    display: none;
  }

  .step-arrow {
    display: none;
  }

  .steps-grid {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .hero-section {
    min-height: auto;
    padding: 100px 15px 60px;
  }

  .hero-content h1 {
    font-size: 2.3em;
  }

  .hero-subtitle {
    font-size: 1.05em;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }

  .section-header h2 {
    font-size: 1.8em;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .step-card {
    width: 100%;
  }

  .cta-content h2 {
    font-size: 1.8em;
  }
}
</style>