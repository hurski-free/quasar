<script setup lang="ts">
import { computed, useId } from 'vue';

const props = defineProps<{
  label: string;
  name?: string;
  id?: string;
}>();

const model = defineModel<string>({ required: true });

const uid = useId();
const baseId = computed(() => props.id ?? props.name ?? `color-${uid}`);
const captionId = computed(() => `${baseId.value}-caption`);
const inputId = computed(() => `${baseId.value}-picker`);
</script>

<template>
  <div class="config-panel-item">
    <div class="config-panel-item__header">
      <label class="config-panel-item__label" :id="captionId" :for="inputId">{{ label }}</label>
      <input
        v-model="model"
        class="config-panel-item__hex"
        type="text"
        spellcheck="false"
        maxlength="7"
        :name="name ? `${name}_hex` : undefined"
        :aria-labelledby="captionId"
      />
    </div>
    <input
      :id="inputId"
      v-model="model"
      class="config-panel-item__color"
      type="color"
      :name="name"
      :aria-labelledby="captionId"
    />
  </div>
</template>

<style scoped>
.config-panel-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.config-panel-item:last-child {
  margin-bottom: 0;
}

.config-panel-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.config-panel-item__label {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

.config-panel-item__hex {
  width: 5.5rem;
  padding: 0.35rem 0.5rem;
  font-size: 0.8125rem;
  font-family: ui-monospace, monospace;
  color: var(--text);
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-align: right;
}

.config-panel-item__hex:focus {
  outline: none;
  border-color: var(--accent-dim);
  box-shadow: 0 0 0 2px rgba(94, 224, 208, 0.15);
}

.config-panel-item__color {
  width: 100%;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input-bg);
  cursor: pointer;
}

.config-panel-item__color::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.config-panel-item__color::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.config-panel-item__color::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}

.config-panel-item__color:focus-visible {
  outline: 2px solid var(--accent-dim);
  outline-offset: 2px;
}
</style>
