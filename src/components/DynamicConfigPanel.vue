<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Range from './input/Range.vue';

const props = defineProps<{
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  distance: number;
}>();

const isOpen = ref(true);

const rotateX = ref(0);
const rotateY = ref(0);
const rotateZ = ref(0);
const distance = ref(1);

const emit = defineEmits<{
  (e: 'update:rotateX', value: number): void;
  (e: 'update:rotateY', value: number): void;
  (e: 'update:rotateZ', value: number): void;
  (e: 'update:distance', value: number): void;
}>();

const panelBtn = computed(() => {
  return isOpen.value ? 'Hide panel' : 'Show panel';
});

function updateRotateX(value: number) {
  emit('update:rotateX', value);
}

function updateRotateY(value: number) {;
  emit('update:rotateY', value);
}

function updateRotateZ(value: number) {
  emit('update:rotateZ', value);
}

function updateDistance(value: number) {
  emit('update:distance', value);
}

onMounted(() => {
  rotateX.value = props.rotateX;
  rotateY.value = props.rotateY;
  rotateZ.value = props.rotateZ;
  distance.value = props.distance;
});
</script>

<template>
  <div class="dynamic-config-panel">
    <div>
      <button class="panel-btn" @click="isOpen = !isOpen">{{ panelBtn }}</button>
    </div>

    <div v-if="isOpen" class="dynamic-config-panel__properties">
      <Range v-model="rotateX" label="Rotate X" :min="0" :max="360" :step="1" name="control_rotate_x" @update:model-value="updateRotateX" />
      <Range v-model="rotateY" label="Rotate Y" :min="0" :max="360" :step="1" name="control_rotate_y" @update:model-value="updateRotateY" />
      <Range v-model="rotateZ" label="Rotate Z" :min="0" :max="360" :step="1" name="control_rotate_z" @update:model-value="updateRotateZ" />
      <Range v-model="distance" label="Distance" :min="0.5" :max="2" :step="0.01" name="control_distance" @update:model-value="updateDistance" />
    </div>
  </div>
</template>

<style scoped>
.dynamic-config-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.panel-btn {
  width: 100px;
  padding: 0.5rem 0.5rem;
  margin-left: 4px;
  margin-top: 4px;
  border: none;
  background-color: var(--surface);
  color: var(--text);

  transition: background-color 0.3s ease;
}

.panel-btn:hover {
  background-color: var(--border);
}

.dynamic-config-panel__properties {
  display: flex;
  width: 20%;
  flex-direction: column;
  gap: 0rem;
  padding: 1rem 0.5rem;
}
</style>
