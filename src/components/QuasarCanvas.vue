<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
  type IQuasarModelConfig,
  type Quasar,
  type World,
  createQuasar,
  getParticlesGpuValuesPerElement,
} from '../core';

const props = defineProps<{
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  distance: number;

  modelConfig: IQuasarModelConfig;

  showStats: boolean;
}>();

const webgl2Supported = ref(false);

const canvasContainerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const quasarRef = ref<Quasar<World> | null>(null);

let resizeObserver: ResizeObserver | null = null;
let initTimeoutId: ReturnType<typeof setTimeout> | undefined;

const particlesCount = computed(() => {
  return quasarRef.value?.particlesCount || 0;
});

const verticesCount = computed(() => {
  return (quasarRef.value?.particlesCount || 0) * getParticlesGpuValuesPerElement();
});

watch(() => props.rotateX, (newVal) => {
  quasarRef.value?.rotateX(newVal);
});
watch(() => props.rotateY, (newVal) => {
  quasarRef.value?.rotateY(newVal);
});
watch(() => props.rotateZ, (newVal) => {
  quasarRef.value?.rotateZ(newVal);
});
watch(() => props.distance, (newVal) => {
  quasarRef.value?.forward(newVal);
});
watch(() => props.modelConfig, (newVal) => {
  quasarRef.value?.setModelConfig(newVal);

  try {
    restartQuasar();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Object pool is full') {
        console.error('Object pool is full, increasing capacity');
        alert('Object pool is full, increasing capacity');
      }
    }
  }
});

function applyCanvasSize() {
  const root = canvasContainerRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) return;

  const w = root.clientWidth;
  const h = root.clientHeight;
  if (w < 1 || h < 1) return;

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  quasarRef.value?.resizeCanvas(w, h);
}

function init() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const gl = canvas.getContext('webgl2');
  webgl2Supported.value = !!gl;

  if (!gl) {
    return;
  }

  if (initTimeoutId !== undefined) {
    clearTimeout(initTimeoutId);
    initTimeoutId = undefined;
  }

  teardownQuasar();

  const quasar = createQuasar('webgl2-soa', gl);

  quasar.setModelConfig(props.modelConfig);

  quasar.prepareTransformation({
    rotateX: props.rotateX,
    rotateY: props.rotateY,
    rotateZ: props.rotateZ,
    distance: props.distance,
    width: canvas.width,
    height: canvas.height,
  });

  initTimeoutId = setTimeout(() => {
    initTimeoutId = undefined;
    quasarRef.value = quasar;
    quasar.resizeCanvas(canvas.width, canvas.height);
    quasar.start();
  }, 100);
}

/** @returns whether the simulation is running after the toggle */
function togglePauseResume(): boolean | undefined {
  const quasar = quasarRef.value;
  if (!quasar) return undefined;

  if (quasar.state === 1) {
    quasar.pause();
  } else if (quasar.state === 2) {
    quasar.resume();
  }

  return quasar.state === 1;
}

function restartQuasar() {
  quasarRef.value?.restart();
}

function teardownQuasar() {
  quasarRef.value?.stop();
  quasarRef.value?.dispose();
  quasarRef.value = null;
}

function generateJet() {
  quasarRef.value?.generateJet();
}

onMounted(() => {
  nextTick(() => {
    resizeObserver = new ResizeObserver(() => {
      applyCanvasSize();
    })

    if (canvasContainerRef.value) {
      resizeObserver.observe(canvasContainerRef.value);
    }

    init();
  })
})

onBeforeUnmount(() => {
  if (initTimeoutId !== undefined) {
    clearTimeout(initTimeoutId);
    initTimeoutId = undefined;
  }

  resizeObserver?.disconnect();
  resizeObserver = null;
  teardownQuasar();
})

defineExpose({
  togglePauseResume,
});
</script>

<template>
  <div>
    <div ref="canvasContainerRef" class="canvas-container" @click="generateJet">
      <canvas ref="canvasRef" />
    </div>
    <div v-if="!webgl2Supported" class="webgl2-not-supported">
      <p>WebGL2 is not supported</p>
    </div>

    <div v-if="showStats" class="model-stats">
      <div class="model-stats__item">
        <span>Particles count: </span>
        <span>{{ particlesCount }}</span>
      </div>
      <div class="model-stats__item">
        <span>Count values for draw: </span>
        <span>{{ verticesCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.webgl2-not-supported {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.model-stats {
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>