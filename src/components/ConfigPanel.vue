<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Range from './atoms/Range.vue';

const props = defineProps<{
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  distance: number;
}>();

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
  <div class="config-panel">
    <Range v-model="rotateX" label="Rotate X" :min="0" :max="360" :step="1" @update:model-value="updateRotateX" />
    <Range v-model="rotateY" label="Rotate Y" :min="0" :max="360" :step="1" @update:model-value="updateRotateY" />
    <Range v-model="rotateZ" label="Rotate Z" :min="0" :max="360" :step="1" @update:model-value="updateRotateZ" />
    <Range v-model="distance" label="Distance" :min="0.5" :max="2" :step="0.01" @update:model-value="updateDistance" />
  </div>
</template>

<style scoped>
.config-panel {
  display: flex;
  flex-direction: column;
  gap: 0rem;
  padding: 1rem 0.5rem;
}
</style>
