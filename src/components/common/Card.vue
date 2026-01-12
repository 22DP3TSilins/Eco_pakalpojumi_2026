<template>
  <div class="card" :class="variant">
    <div v-if="title" class="card-header">
      <h3>{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
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
.card {
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 25px 10px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  margin: 0 0 5px 0;
  color: var(--text-color);
  font-size: 1.4em;
}

.card-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.card-body {
  padding: 20px 25px;
}

.card-footer {
  padding: 15px 25px 20px;
  background: rgba(76, 175, 80, 0.05);
  border-top: 1px solid var(--border-color);
}

.card.feature {
  text-align: center;
  padding: 30px 20px;
}

.card.feature .card-body {
  padding: 20px;
}

.card.empty {
  border: 2px dashed var(--border-color);
  background: rgba(76, 175, 80, 0.02);
}

.card.empty .card-body {
  text-align: center;
  color: var(--text-secondary);
}
</style>