<script setup lang="ts">
import { onUnmounted, useId, watch } from 'vue';

import closeCircleUrl from '../../assets/close-circle.svg';

const props = withDefaults(
  defineProps<{
    title?: string;
    /**
     * When true, the dialog closes on overlay click.
     * (Unlike Quasar’s QDialog, where “persistent” blocks outside dismiss.)
     */
    persistent?: boolean;
  }>(),
  { persistent: false },
);

const open = defineModel<boolean>({ required: true });

const titleId = useId();

const closeIconMask = iconMaskStyle(closeCircleUrl);

function iconMaskStyle(src: string): Record<string, string> {
  const u = `url(${JSON.stringify(src)})`;
  return {
    WebkitMaskImage: u,
    maskImage: u,
  };
}

function onOverlayPointerDown(ev: PointerEvent) {
  if (ev.target !== ev.currentTarget) return;
  if (!props.persistent) open.value = false;
}

function close() {
  open.value = false;
}

watch(
  open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = '';
});

defineExpose({
  close,
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="q-dialog">
      <div
        class="q-dialog__overlay"
        aria-hidden="true"
        @pointerdown="onOverlayPointerDown"
      />
      <div
        class="q-dialog__panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @pointerdown.stop
      >
        <header class="q-dialog__header">
          <h2 v-if="title" :id="titleId" class="q-dialog__title">{{ title }}</h2>
          <button type="button" class="q-dialog__close" aria-label="Закрыть" @click="close">
            <span class="q-dialog__close-icon" :style="closeIconMask" />
          </button>
        </header>
        <div class="q-dialog__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.q-dialog {
  position: fixed;
  inset: 0;
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  box-sizing: border-box;
}

.q-dialog__overlay {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, #000 55%, transparent);
}

.q-dialog__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 200px;
  max-width: 85vw;
  max-height: 85vh;
  overflow: hidden;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
}

.q-dialog__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem 0.65rem 1rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.q-dialog__title {
  flex: 1;
  margin: 0;
  min-width: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.3;
}

.q-dialog__close {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.q-dialog__close:hover {
  background: color-mix(in srgb, #fff 14%, transparent);
}

.q-dialog__close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.q-dialog__close-icon {
  display: block;
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
  background-color: #fff;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.q-dialog__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 1rem;
}
</style>
