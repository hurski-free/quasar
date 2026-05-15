<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Range from './atoms/Range.vue';
import QDialog from './dialog/QDialog.vue';
import { getQuasarConfigurationProperties, type IQuasarModelConfig } from '../core/quasar.conf';
import { createRangePropertyRef, fillRangePropertyRef } from '../utils/config.ref';
import QButton from './atoms/QButton.vue';

const props = defineProps<{
  modelConfig: IQuasarModelConfig;
}>();

const isOpen = ref(false);
const dialogRef = ref<InstanceType<typeof QDialog> | null>(null);

const angleStep = createRangePropertyRef();
const radiusStep = createRangePropertyRef();
const modelRadius = createRangePropertyRef();
const blackHoleDiameter = createRangePropertyRef();

const emit = defineEmits<{
  (e: 'update:modelConfig', value: IQuasarModelConfig): void;
}>();

function save() {
  emit('update:modelConfig', {
    angleStep: angleStep.value.value,
    radiusStep: radiusStep.value.value,
    modelRadius: modelRadius.value.value,
    blackHoleDiameter: blackHoleDiameter.value.value,
    arms: [],
  });
  dialogRef.value?.close();
}

function cancel() {
  dialogRef.value?.close();
}

onMounted(() => {
  const cfg = getQuasarConfigurationProperties();
  fillRangePropertyRef(angleStep, cfg.angleStep);
  fillRangePropertyRef(radiusStep, cfg.radiusStep);
  fillRangePropertyRef(modelRadius, cfg.modelRadius);
  fillRangePropertyRef(blackHoleDiameter, cfg.blackHoleDiameter);
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
      <div class="dynamic-config-panel__range-item">
        <Range v-model="modelRadius.value" label="Model radius" :min="modelRadius.min" :max="modelRadius.max" :step="modelRadius.step" />
      </div>
      <div class="dynamic-config-panel__range-item">
        <Range v-model="blackHoleDiameter.value" label="Black hole diameter" :min="blackHoleDiameter.min" :max="blackHoleDiameter.max" :step="blackHoleDiameter.step" />
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
