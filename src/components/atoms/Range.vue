<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max?: number;
    step?: number;
    name?: string;
    id?: string;
    showNumberInput?: boolean;
    /** Delay (ms) before emitting model updates; 0 = immediate */
    debounce?: number;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    showNumberInput: true,
    debounce: 0,
  },
);

const model = defineModel<number>({ required: true });

const localValue = ref(model.value);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

const uid = useId();
const baseId = computed(() => props.id ?? props.name ?? `range-${uid}`);
const captionId = computed(() => `${baseId.value}-caption`);
const rangeId = computed(() => `${baseId.value}-slider`);

watch(model, (value) => {
  localValue.value = value;
});

function clamp(n: number): number {
  return Math.min(props.max, Math.max(props.min, n));
}

function flushToModel() {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer);
    debounceTimer = undefined;
  }
  model.value = clamp(localValue.value);
}

function syncToModel() {
  const value = clamp(localValue.value);
  if (props.debounce <= 0) {
    model.value = value;
    return;
  }
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    model.value = value;
    debounceTimer = undefined;
  }, props.debounce);
}

function onInput() {
  localValue.value = clamp(localValue.value);
  syncToModel();
}

function onNumberChange() {
  localValue.value = clamp(localValue.value);
  flushToModel();
}

onBeforeUnmount(() => {
  if (debounceTimer !== undefined) {
    flushToModel();
  }
});
</script>

<template>
  <div class="config-panel-item">
    <div class="config-panel-item__header">
      <label class="config-panel-item__label" :id="captionId" :for="rangeId">{{ label }}</label>
      <input
        v-if="showNumberInput"
        v-model.number="localValue"
        class="config-panel-item__number"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :name="name ? `${name}_num` : undefined"
        :aria-labelledby="captionId"
        @input="onInput"
        @change="onNumberChange"
      />
    </div>
    <input
      :id="rangeId"
      v-model.number="localValue"
      class="config-panel-item__range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :name="name"
      @input="onInput"
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

.config-panel-item__number {
  width: 4.5rem;
  padding-top: 0.35rem 0.5rem;
  font-size: 0.8125rem;
  color: var(--text);
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-align: right;
}

.config-panel-item__number:focus {
  outline: none;
  border-color: var(--accent-dim);
  box-shadow: 0 0 0 2px rgba(94, 224, 208, 0.15);
}

.config-panel-item__range {
  width: 100%;
  height: 6px;
  appearance: none;
  background: var(--border);
  border-radius: 999px;
  cursor: pointer;
}

.config-panel-item__range::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.config-panel-item__range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.config-panel-item__range::-moz-range-track {
  height: 6px;
  background: var(--border);
  border-radius: 999px;
}

.config-panel-item__range:focus-visible {
  outline: 2px solid var(--accent-dim);
  outline-offset: 4px;
}
</style>
