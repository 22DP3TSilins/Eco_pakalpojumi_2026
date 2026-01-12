<template>
  <div class="home">
    <Section variant="hero">
      <h1>🌿 Eco Pakalpojumi 🌿</h1>
      <p>Your comprehensive platform for sustainable living and eco-friendly shopping</p>
      <div class="hero-actions">
        <Button to="/products" icon="🛍️">Shop Eco Products</Button>
        <Button to="/calculator" variant="secondary" icon="🧮">Calculate Footprint</Button>
      </div>
    </Section>

    <Section title="Why Choose Eco Pakalpojumi?" subtitle="Join thousands making a positive impact on our planet">
      <Card title="♻️ Sustainable Products" subtitle="Curated eco-friendly items">
        <p>Discover products that minimize environmental impact while maintaining quality and functionality.</p>
        <template #footer>
          <Button to="/products" size="small">Browse Products</Button>
        </template>
      </Card>

      <Card title="🧮 Carbon Calculator" subtitle="Track your environmental impact">
        <p>Calculate your carbon footprint and get personalized recommendations to reduce it.</p>
        <template #footer>
          <Button to="/calculator" size="small">Try Calculator</Button>
        </template>
      </Card>

      <Card title="🌍 Community Forum" subtitle="Connect with like-minded people">
        <p>Share experiences, tips, and support each other in sustainable living practices.</p>
        <template #footer>
          <Button to="/forum" size="small">Join Discussion</Button>
        </template>
      </Card>

      <Card title="🏆 Eco Challenges" subtitle="Gamified sustainability">
        <p>Participate in challenges to develop eco-friendly habits and earn rewards.</p>
        <template #footer>
          <Button to="/challenges" size="small">View Challenges</Button>
        </template>
      </Card>

      <Card title="📚 Education Hub" subtitle="Learn and grow">
        <p>Access articles, tips, and resources to deepen your understanding of sustainability.</p>
        <template #footer>
          <Button to="/education" size="small">Explore Content</Button>
        </template>
      </Card>

      <Card title="🌱 Footprint Tracker" subtitle="Monitor your progress">
        <p>Log daily activities and track your environmental impact over time.</p>
        <template #footer>
          <Button to="/footprint" size="small">Start Tracking</Button>
        </template>
      </Card>
    </Section>

    <Section title="Our Impact" subtitle="Together we're making a real difference for our planet">
      <div class="impact-grid">
        <div class="impact-card">
          <div class="impact-icon">🌱</div>
          <div class="impact-number">2,847</div>
          <div class="impact-label">Trees Planted</div>
          <div class="impact-description">Through our reforestation partnerships</div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">♻️</div>
          <div class="impact-number">156 tons</div>
          <div class="impact-label">Plastic Waste Diverted</div>
          <div class="impact-description">From landfills through recycling programs</div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">⚡</div>
          <div class="impact-number">89,432 kWh</div>
          <div class="impact-label">Renewable Energy Generated</div>
          <div class="impact-description">Solar panels installed by our community</div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">🚗</div>
          <div class="impact-number">45,891 kg</div>
          <div class="impact-label">CO₂ Emissions Saved</div>
          <div class="impact-description">Through sustainable transportation choices</div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">👥</div>
          <div class="impact-number">12,567</div>
          <div class="impact-label">Active Eco-Warriors</div>
          <div class="impact-description">Community members taking action</div>
        </div>

        <div class="impact-card">
          <div class="impact-icon">📚</div>
          <div class="impact-number">28,934</div>
          <div class="impact-label">Educational Resources Accessed</div>
          <div class="impact-description">Articles, guides, and tutorials viewed</div>
        </div>
      </div>

      <div class="impact-summary">
        <h3>🌍 Real Impact, Real Change</h3>
        <p>
          Every product purchased, every challenge completed, and every footprint calculated
          contributes to measurable environmental benefits. Our platform connects sustainable
          actions with tangible results, creating a community-driven movement for planetary health.
        </p>
        <div class="impact-cta">
          <Button to="/calculator" variant="secondary" icon="🧮">Calculate Your Impact</Button>
          <Button to="/products" icon="🛍️">Shop Sustainably</Button>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from './common/Section.vue'
import Card from './common/Card.vue'
import Button from './common/Button.vue'

export default {
  name: 'Home',
  components: {
    Section,
    Card,
    Button
  }
}
</script>

<style scoped>
.home h1 {
  font-size: 3.5em;
  color: var(--text-color);
  margin-bottom: 15px;
  font-weight: 800;
}

.home > .page-section:first-child p {
  font-size: 1.3em;
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  text-align: center;
}

.stat-card {
  background: var(--card-bg);
  padding: 30px 20px;
  border-radius: 15px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5em;
  font-weight: 700;
  color: #2ecc71;
  margin-bottom: 10px;
}

.stat-label {
  color: var(--text-color);
  font-size: 1.1em;
  font-weight: 500;
}

/* New Impact Section Styles */
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.impact-card {
  background: var(--card-bg);
  padding: 30px 24px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
}

.impact-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: #2ecc71;
}

.impact-icon {
  font-size: 2.5em;
  margin-bottom: 16px;
}

.impact-number {
  font-size: 2.2em;
  font-weight: 700;
  color: #2ecc71;
  margin-bottom: 8px;
}

.impact-label {
  color: var(--text-color);
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 8px;
}

.impact-description {
  color: var(--text-secondary);
  font-size: 0.95em;
  line-height: 1.4;
}

.impact-summary {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(39, 174, 96, 0.1));
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.impact-summary h3 {
  color: var(--text-color);
  font-size: 1.8em;
  margin-bottom: 16px;
  font-weight: 700;
}

.impact-summary p {
  color: var(--text-color);
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.impact-cta {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .home h1 {
    font-size: 2.5em;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>