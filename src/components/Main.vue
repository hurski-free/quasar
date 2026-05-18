<script setup lang="ts">
import { computed, ref } from 'vue';

import ConfigPanel from './ConfigPanel.vue';
import QuasarCanvas from './QuasarCanvas.vue';
import QButton from './atoms/QButton.vue';
import ConfigDialog from './ConfigDialog.vue';

import settingsIconUrl from '../assets/settings.svg';
import consoleIconUrl from '../assets/console.svg';
import playIconUrl from '../assets/play.svg';
import pauseIconUrl from '../assets/pause.svg';

import {
  INIT_ANGLE_X,
  INIT_ANGLE_Y,
  INIT_ANGLE_Z,
} from '../core/quasar.const';
import { getQuasarConfigurationProperties, type IQuasarModelConfig } from '../core/quasar.conf';

const rotateX = ref(INIT_ANGLE_X);
const rotateY = ref(INIT_ANGLE_Y);
const rotateZ = ref(INIT_ANGLE_Z);
const distance = ref(1);

const isPanelOpen = ref(true);
const isConfigDialogOpen = ref(false);
const isStatsOpen = ref(false);
const isPlaying = ref(true);

const quasarCanvasRef = ref<InstanceType<typeof QuasarCanvas> | null>(null);

const cfg = getQuasarConfigurationProperties();

const modelConfig = ref<IQuasarModelConfig>({
  angleStep: cfg.angleStep.default,
  radiusStep: cfg.radiusStep.default,
  modelRadius: cfg.modelRadius.default,
  blackHoleDiameter: cfg.blackHoleDiameter.default,
  arms: cfg.arms.default,
});

const panelBtn = computed(() => {
  return isPanelOpen.value ? 'Hide panel' : 'Show panel';
});

const statsBtn = computed(() => {
  return isStatsOpen.value ? 'Hide stats' : 'Show stats';
});

const playPauseIconUrl = computed(() => {
  return isPlaying.value ? pauseIconUrl : playIconUrl;
});

function togglePlayPause() {
  const isRunning = quasarCanvasRef.value?.togglePauseResume();
  if (isRunning !== undefined) {
    isPlaying.value = isRunning;
  }
}

</script>

<template>
  <div>
    <div class="left-panel" :class="{ 'left-panel--hidden': !isPanelOpen }">
      <div class="control-panel">
        <QButton @click="isPanelOpen = !isPanelOpen">{{ panelBtn }}</QButton>
        <QButton :icon-left="consoleIconUrl" @click="isStatsOpen = !isStatsOpen">{{ statsBtn }}</QButton>
        <QButton :icon-left="settingsIconUrl" @click="isConfigDialogOpen = !isConfigDialogOpen"></QButton>
        <QButton :icon-left="playPauseIconUrl" @click="togglePlayPause"></QButton>
      </div>
      <ConfigPanel
        v-if="isPanelOpen"
        :rotateX="rotateX"
        :rotateY="rotateY"
        :rotateZ="rotateZ"
        :distance="distance"
        @update:rotateX="rotateX = $event"
        @update:rotateY="rotateY = $event"
        @update:rotateZ="rotateZ = $event"
        @update:distance="distance = $event"
      />
    </div>
    <QuasarCanvas
      ref="quasarCanvasRef"
      class="quasar-canvas"
      :rotateX="rotateX"
      :rotateY="rotateY"
      :rotateZ="rotateZ"
      :distance="distance"
      :modelConfig="modelConfig"
      :showStats="isStatsOpen"
    />

    <ConfigDialog v-model="isConfigDialogOpen" v-model:modelConfig="modelConfig" />
  </div>
</template>

<style>
.left-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1100;
  width: 400px;
  background-color: color-mix(in srgb, var(--surface) 50%, transparent);
}

.left-panel--hidden {
  height: auto!important;
}

.control-panel {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 0.5rem;
}

.quasar-canvas {
  z-index: 1000;
}
</style>