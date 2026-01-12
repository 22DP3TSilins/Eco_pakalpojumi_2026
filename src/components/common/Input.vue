<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input-field"
      />
      <span v-if="icon" class="input-icon">{{ icon }}</span>
    </div>
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    icon: String,
    error: String,
    disabled: Boolean,
    required: Boolean,
    id: String
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  font-size: 0.95em;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.2em;
}

.input-error {
  display: block;
  color: #e74c3c;
  font-size: 0.85em;
  margin-top: 5px;
}
</style>