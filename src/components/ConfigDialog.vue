<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Range from './atoms/Range.vue';
import QDialog from './dialog/QDialog.vue';
import { getQuasarConfigurationProperties } from '../core/quasar.conf';
import { createRangePropertyRef, fillRangePropertyRef } from '../utils/config.ref';
import QButton from './atoms/QButton.vue';

const isOpen = ref(false);
const dialogRef = ref<InstanceType<typeof QDialog> | null>(null);

const angleStep = createRangePropertyRef();
const radiusStep = createRangePropertyRef();

function save() {
  console.log('save');
  dialogRef.value?.close();
}

function cancel() {
  dialogRef.value?.close();
}

onMounted(() => {
  const cfg = getQuasarConfigurationProperties();
  fillRangePropertyRef(angleStep, cfg.angleStep);
  fillRangePropertyRef(radiusStep, cfg.radiusStep);
});
</script>

<template>
  <QDialog ref="dialogRef" v-model="isOpen" title="Quasar configuration" persistent>
    <div class="dynamic-config-panel">
      <div class="dynamic-config-panel__range-item">
        <Range v-model="angleStep.value" label="Angle step" :min="angleStep.min" :max="angleStep.max" :step="angleStep.step" />
      </div>
      <div class="dynamic-config-panel__range-item">
        <Range v-model="radiusStep.value" label="Radius step" :min="radiusStep.min" :max="radiusStep.max" :step="radiusStep.step" />
      </div>

      <div class="dynamic-config-panel__actions">
        <QButton @click="save">Generate model</QButton>
        <QButton @click="cancel">Cancel</QButton>
      </div>
    </div>
  </QDialog>
</template>

<style scoped>
.dynamic-config-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;

  padding: 0.5rem 1rem;
}

.dynamic-config-panel__range-item {
  width: 200px;
}

.dynamic-config-panel__actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

</style>
