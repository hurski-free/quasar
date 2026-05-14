<template>
  <div>
    <div ref="canvasContainerRef" class="canvas-container">
      <canvas ref="canvasRef" />
    </div>
    <div v-if="!webgl2Supported" class="webgl2-not-supported">
      <p>WebGL2 is not supported</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Quasar } from '../core/Quasar';
import { WebGL2dRender } from '../core/render/WebGL2Render';
import { Engine } from '../core/engine/Engine';

const props = defineProps<{
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  distance: number;
}>();

const webgl2Supported = ref(false);

const canvasContainerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const quasarRef = ref<Quasar | null>(null);

let resizeObserver: ResizeObserver | null = null;

watch(() => props.rotateX, (newVal) => {
  quasarRef.value?.rotateX(newVal);
})
watch(() => props.rotateY, (newVal) => {
  quasarRef.value?.rotateY(newVal);
})
watch(() => props.rotateZ, (newVal) => {
  quasarRef.value?.rotateZ(newVal);
})
watch(() => props.distance, (newVal) => {
  quasarRef.value?.forward(newVal);
})

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

  quasarRef.value?.stop()
  
  const renderer = new WebGL2dRender({ ctx: gl })
  const engine = new Engine();
  const quasar = new Quasar({ engine, renderer });

  quasar.prepareTransformation({
    rotateX: props.rotateX,
    rotateY: props.rotateY,
    rotateZ: props.rotateZ,
    distance: props.distance,
    width: canvas.width,
    height: canvas.height,
  });

  setTimeout(() => {
    quasarRef.value = quasar;
    quasar.resizeCanvas(canvas.width, canvas.height);
    quasar.start();
  }, 100);
}

function togglePauseResume() {
  const quasar = quasarRef.value;
  if (!quasar) return;

  if (quasar.animationState === 1) {
    quasar.pause();
  } else if (quasar.animationState === 2) {
    quasar.resume();
  }
}

function toggleStartStop() {
  const quasar = quasarRef.value;
  if (!quasar) return;

  if (quasar.animationState === 0) {
    quasar.start();
  } else {
    quasar.stop();
  }
}

function restartQuasar() {
  quasarRef.value?.restart();
}

function teardownQuasar() {
  quasarRef.value?.stop();
  quasarRef.value = null;
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
  resizeObserver?.disconnect();
  resizeObserver = null;
  teardownQuasar();
})
</script>

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
</style>