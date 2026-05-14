<script setup lang="ts">
import { ref } from 'vue';

import ConfigPanel from './DynamicConfigPanel.vue';
import QuasarCanvas from './QuasarCanvas.vue';
import { INIT_ANGLE_X, INIT_ANGLE_Y, INIT_ANGLE_Z } from '../core/quasar.const';

const rotateX = ref(INIT_ANGLE_X);
const rotateY = ref(INIT_ANGLE_Y);
const rotateZ = ref(INIT_ANGLE_Z);
const distance = ref(1);
</script>

<template>
  <div>
    <ConfigPanel
      style="z-index: 1100;"
      :rotateX="rotateX"
      :rotateY="rotateY"
      :rotateZ="rotateZ"
      :distance="distance"
      @update:rotateX="rotateX = $event"
      @update:rotateY="rotateY = $event"
      @update:rotateZ="rotateZ = $event"
      @update:distance="distance = $event"
    />
    <QuasarCanvas style="z-index: 1000;" :rotateX="rotateX" :rotateY="rotateY" :rotateZ="rotateZ" :distance="distance" />
  </div>
</template>