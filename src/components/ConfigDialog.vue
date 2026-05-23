<script setup lang="ts">
import { onMounted, ref, useId } from 'vue';
import Range from './atoms/Range.vue';
import QDialog from './dialog/QDialog.vue';
import { createRangeProperty, createRangePropertyRef, fillRangeProperty, fillRangePropertyRef, type QuasarArmRef } from '../utils/config.ref';
import QButton from './atoms/QButton.vue';
import Color from './atoms/Color.vue';
import {
  colorStringToVec3,
  DEGR_TO_RAD,
  RAD_TO_DEGR,
  type vec3,
  getQuasarConfigurationProperties,
  type IQuasarModelConfig,
  type IQuasarArmConfig,
} from '../core';

const props = defineProps<{
  modelConfig: IQuasarModelConfig;
}>();

const isOpen = ref(false);
const dialogRef = ref<InstanceType<typeof QDialog> | null>(null);

const angleStep = createRangePropertyRef();
const radiusStep = createRangePropertyRef();
const modelRadius = createRangePropertyRef();
const blackHoleDiameter = createRangePropertyRef();

const idPrefix = useId();
const armCounter = ref(0);
const arms = ref<QuasarArmRef[]>([]);
const importInputRef = ref<HTMLInputElement | null>(null);
// const previewCanvasRef = ref<HTMLCanvasElement | null>(null);

const emit = defineEmits<{
  (e: 'update:modelConfig', value: IQuasarModelConfig): void;
}>();

function addArm() {
  armCounter.value++;

  const cfg = getQuasarConfigurationProperties();
  const particleGenerateStep = createRangeProperty();
  const angle = createRangeProperty();
  const angleDispersion = createRangeProperty();

  fillRangeProperty(particleGenerateStep, cfg.arms.particleGenerateStep);
  fillRangeProperty(angle, cfg.arms.angle);
  fillRangeProperty(angleDispersion, cfg.arms.angleDispersion);

  arms.value.push({
    id: `${idPrefix}-${armCounter.value}`,
    angle,
    angleDispersion,
    particleGenerateStep,
    color: '#FFFFFF',
  } satisfies QuasarArmRef);
}

function removeArm(arm: QuasarArmRef) {
  arms.value = arms.value.filter(a => a !== arm);
}

function vec3ToColorString([r, g, b]: vec3): string {
  const byte = (c: number) => Math.round(Math.max(0, Math.min(1, c)) * 255);
  const hex = (n: number) => byte(n).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function isVec3(value: unknown): value is vec3 {
  return Array.isArray(value) && value.length === 3 && value.every((n) => typeof n === 'number');
}

function isQuasarModelConfig(value: unknown): value is IQuasarModelConfig {
  if (!value || typeof value !== 'object') return false;

  const config = value as Record<string, unknown>;
  if (
    typeof config.angleStep !== 'number' ||
    typeof config.radiusStep !== 'number' ||
    typeof config.modelRadius !== 'number' ||
    typeof config.blackHoleDiameter !== 'number' ||
    !Array.isArray(config.arms)
  ) {
    return false;
  }

  return config.arms.every((arm) => {
    if (!arm || typeof arm !== 'object') return false;

    const item = arm as Record<string, unknown>;
    return (
      typeof item.index === 'number' &&
      typeof item.angle === 'number' &&
      typeof item.angleDispersion === 'number' &&
      typeof item.particleGenerateStep === 'number' &&
      isVec3(item.color)
    );
  });
}

function buildModelConfig(): IQuasarModelConfig {
  return {
    angleStep: angleStep.value.value,
    radiusStep: radiusStep.value.value,
    modelRadius: modelRadius.value.value,
    blackHoleDiameter: blackHoleDiameter.value.value,
    arms: arms.value.map((arm, index) => ({
      index,
      angle: arm.angle.value * DEGR_TO_RAD,
      angleDispersion: arm.angleDispersion.value * DEGR_TO_RAD,
      particleGenerateStep: arm.particleGenerateStep.value,
      color: colorStringToVec3(arm.color),
    })),
  };
}

function createArmFromConfig(armConfig: IQuasarArmConfig): QuasarArmRef {
  armCounter.value++;

  const cfg = getQuasarConfigurationProperties();
  const particleGenerateStep = createRangeProperty();
  const angle = createRangeProperty();
  const angleDispersion = createRangeProperty();

  fillRangeProperty(particleGenerateStep, cfg.arms.particleGenerateStep);
  fillRangeProperty(angle, cfg.arms.angle);
  fillRangeProperty(angleDispersion, cfg.arms.angleDispersion);

  particleGenerateStep.value = armConfig.particleGenerateStep;
  angle.value = armConfig.angle * RAD_TO_DEGR;
  angleDispersion.value = armConfig.angleDispersion * RAD_TO_DEGR;

  return {
    id: `${idPrefix}-${armCounter.value}`,
    angle,
    angleDispersion,
    particleGenerateStep,
    color: vec3ToColorString(armConfig.color),
  };
}

function applyModelConfig(config: IQuasarModelConfig) {
  angleStep.value.value = config.angleStep;
  radiusStep.value.value = config.radiusStep;
  modelRadius.value.value = config.modelRadius;
  blackHoleDiameter.value.value = config.blackHoleDiameter;
  arms.value = config.arms.map((arm) => createArmFromConfig(arm));
}

function exportJSON() {
  const json = JSON.stringify(buildModelConfig(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quasar-config.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  importInputRef.value?.click();
}

async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const parsed: unknown = JSON.parse(await file.text());
    if (!isQuasarModelConfig(parsed)) {
      throw new Error('Invalid quasar configuration');
    }
    applyModelConfig(parsed);
  } catch (error) {
    console.error('Failed to import configuration', error);
    window.alert('Failed to import configuration. Please check the JSON file.');
  } finally {
    input.value = '';
  }
}

function save() {
  emit('update:modelConfig', buildModelConfig());
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
    <div class="config-dialog">
      <div class="config-dialog-content">
        <div class="config-dialog-props">
          <div class="config-dialog-props__io">
            <QButton @click="exportJSON">Export JSON</QButton>
            <QButton @click="importJSON">Import JSON</QButton>
            <input
              ref="importInputRef"
              type="file"
              accept=".json,application/json"
              class="config-dialog-props__file-input"
              @change="onImportFile"
            />
          </div>
          <div class="config-dialog-props__range-item">
            <Range v-model="angleStep.value" label="Angle step" :min="angleStep.min" :max="angleStep.max" :step="angleStep.step" />
          </div>
          <div class="config-dialog-props__range-item">
            <Range v-model="radiusStep.value" label="Radius step" :min="radiusStep.min" :max="radiusStep.max" :step="radiusStep.step" />
          </div>
          <div class="config-dialog-props__range-item">
            <Range v-model="modelRadius.value" label="Model radius" :min="modelRadius.min" :max="modelRadius.max" :step="modelRadius.step" />
          </div>
          <div class="config-dialog-props__range-item">
            <Range v-model="blackHoleDiameter.value" label="Black hole diameter" :min="blackHoleDiameter.min" :max="blackHoleDiameter.max" :step="blackHoleDiameter.step" />
          </div>
    
          <div class="config-dialog-props__arms-container">            
            <div v-for="arm in arms" :key="arm.id" class="config-dialog-props__arm-item">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <Range v-model="arm.particleGenerateStep.value" label="Generate step" :min="arm.particleGenerateStep.min" :max="arm.particleGenerateStep.max" :step="arm.particleGenerateStep.step" />
                <Range v-model="arm.angle.value" label="Angle" :min="arm.angle.min" :max="arm.angle.max" :step="arm.angle.step" />
                <Range v-model="arm.angleDispersion.value" label="Angle dispersion" :min="arm.angleDispersion.min" :max="arm.angleDispersion.max" :step="arm.angleDispersion.step" />
                <Color v-model="arm.color" label="Color" />
              </div>
              <div>
                <QButton @click="removeArm(arm)">Remove</QButton>
              </div>
            </div>

            <div>
              <QButton @click="addArm">Add arm</QButton>
            </div>
          </div>
        </div>
  
        <!-- <div class="config-dialog__preview">
          <div>
            <span>Preview will be here...</span>
            <canvas ref="previewCanvasRef" class="config-dialog__preview-canvas"></canvas>
          </div>
        </div> -->
      </div>

      <div class="config-dialog__actions">
        <QButton @click="save">Generate model</QButton>
        <QButton @click="cancel">Cancel</QButton>
      </div>
    </div>
  </QDialog>
</template>

<style scoped>

.config-dialog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60vw;
  height: 70vh;
}

.config-dialog-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.config-dialog-props {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
  width: 600px;
  height: calc(70vh - 100px);
  overflow-y: auto;

  padding: 0.5rem 1rem;
}

.config-dialog-props__io {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-shrink: 0;
}

.config-dialog-props__file-input {
  display: none;
}

.config-dialog-props__range-item {
  width: 200px;
}

.config-dialog-props__arms-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-dialog-props__arm-item {
  display: flex;
  gap: 1rem;
}

.config-dialog__preview {
  flex: 1;
  top: 100px;
}

.config-dialog__preview-canvas {
  width: 100%;
  height: 100%;
}

.config-dialog__actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

</style>
