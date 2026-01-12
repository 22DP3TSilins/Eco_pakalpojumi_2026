<template>
  <section class="page-section" :class="variant">
    <div class="container">
      <div v-if="title || subtitle" class="section-header">
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
      <div class="section-content">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Section',
  props: {
    title: String,
    subtitle: String,
    variant: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.page-section {
  padding: 60px 0;
}

.page-section.hero {
  padding: 100px 0;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  margin-bottom: 40px;
}

.section-header h2 {
  color: var(--text-color);
  font-size: 2.5em;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.2em;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.section-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .page-section {
    padding: 40px 0;
  }

  .page-section.hero {
    padding: 60px 0;
  }

  .section-header h2 {
    font-size: 2em;
  }

  .section-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>