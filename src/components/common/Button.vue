<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :class="['btn', variant, size, { disabled }]"
    :disabled="disabled && !to"
    @click="$emit('click')"
  >
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabled: Boolean,
    icon: String,
    to: String
  },
  emits: ['click']
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  color: inherit;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #2ecc71;
  color: white;
}

.btn.primary:hover:not(.disabled) {
  background: #27ae60;
}

.btn.secondary {
  background: #ecf0f1;
  color: var(--text-color);
}

.btn.secondary:hover:not(.disabled) {
  background: #bdc3c7;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

.btn.danger:hover:not(.disabled) {
  background: #c0392b;
}

.btn.success {
  background: #27ae60;
  color: white;
}

.btn.success:hover:not(.disabled) {
  background: #229954;
}

.btn.small {
  padding: 8px 16px;
  font-size: 0.9em;
}

.btn.large {
  padding: 16px 24px;
  font-size: 1.1em;
}

.btn-icon {
  font-size: 1.2em;
}
</style>