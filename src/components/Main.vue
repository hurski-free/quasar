<script setup lang="ts">
import { computed, ref } from 'vue';

import ConfigPanel from './ConfigPanel.vue';
import QuasarCanvas from './QuasarCanvas.vue';
import QButton from './atoms/QButton.vue';
import ConfigDialog from './ConfigDialog.vue';

import settingsIconUrl from '../assets/settings.svg';

import { INIT_ANGLE_X, INIT_ANGLE_Y, INIT_ANGLE_Z } from '../core/quasar.const';

const rotateX = ref(INIT_ANGLE_X);
const rotateY = ref(INIT_ANGLE_Y);
const rotateZ = ref(INIT_ANGLE_Z);
const distance = ref(1);

const isPanelOpen = ref(true);
const isConfigDialogOpen = ref(false);

const panelBtn = computed(() => {
  return isPanelOpen.value ? 'Hide panel' : 'Show panel';
});

</script>

<template>
  <div>
    <div class="left-panel">
      <div class="control-panel">
        <QButton @click="isPanelOpen = !isPanelOpen">{{ panelBtn }}</QButton>
        <QButton :icon-left="settingsIconUrl" @click="isConfigDialogOpen = !isConfigDialogOpen"></QButton>
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
    <QuasarCanvas class="quasar-canvas" :rotateX="rotateX" :rotateY="rotateY" :rotateZ="rotateZ" :distance="distance" />

    <ConfigDialog v-model="isConfigDialogOpen" />
  </div>
</template>

<style>
.left-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1100;
  width: 350px;
  background-color: color-mix(in srgb, var(--surface) 50%, transparent);
}

.control-panel {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

.quasar-canvas {
  z-index: 1000;
}
</style>