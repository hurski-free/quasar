<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    /** Vite `import url from '*.svg'` or public path; or `import raw from '*.svg?raw'` markup */
    iconLeft?: string;
    iconRight?: string;
  }>(),
  {
    type: 'button',
    disabled: false,
  },
);

function isInlineSvgAsset(value: string): boolean {
  const t = value.trimStart();
  if (t.startsWith('data:') || t.startsWith('blob:')) return false;
  return /^(<\?xml[^>]*>\s*)?<svg\b/i.test(t);
}

function iconMaskStyle(src: string): Record<string, string> {
  const u = `url(${JSON.stringify(src)})`;
  return {
    WebkitMaskImage: u,
    maskImage: u,
  };
}
</script>

<template>
  <button class="btn" :type="type" :disabled="disabled">
    <span v-if="iconLeft || $slots.iconLeft" class="btn__icon btn__icon--left" aria-hidden="true">
      <template v-if="iconLeft">
        <span
          v-if="!isInlineSvgAsset(iconLeft)"
          class="btn__asset-mask"
          role="presentation"
          :style="iconMaskStyle(iconLeft)"
        />
        <span v-else class="btn__asset-inline" v-html="iconLeft" />
      </template>
      <slot v-else name="iconLeft" />
    </span>
    <span class="btn__content">
      <slot />
    </span>
    <span v-if="iconRight || $slots.iconRight" class="btn__icon btn__icon--right" aria-hidden="true">
      <template v-if="iconRight">
        <span
          v-if="!isInlineSvgAsset(iconRight)"
          class="btn__asset-mask"
          role="presentation"
          :style="iconMaskStyle(iconRight)"
        />
        <span v-else class="btn__asset-inline" v-html="iconRight" />
      </template>
      <slot v-else name="iconRight" />
    </span>
  </button>
</template>

<style scoped>
.btn {
  --btn-line-height: 1.25;
  display: inline-flex;
  align-items: stretch;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: var(--btn-line-height);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.btn:hover:not(:disabled) {
  background: var(--border);
}

.btn:focus-visible {
  outline: none;
  border-color: var(--accent-dim);
  box-shadow: 0 0 0 2px rgba(94, 224, 208, 0.15);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn__content {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: calc(1em * var(--btn-line-height));
}

.btn__content:empty {
  display: none;
}

.btn__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-height: calc(1em * var(--btn-line-height));
  color: currentColor;
}

.btn__icon :deep(svg) {
  display: block;
  width: 1.125em;
  height: 1.125em;
}

/* Inline / slot SVG: match button text (override hardcoded fills on paths) */
.btn__icon :deep(svg *) {
  fill: currentColor;
}

.btn__icon :deep(svg [fill='none']),
.btn__icon :deep(svg [fill='transparent']) {
  fill: none;
}

.btn__asset-mask {
  display: block;
  width: 1.125em;
  height: 1.125em;
  flex-shrink: 0;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.btn__asset-inline {
  display: inline-flex;
  line-height: 0;
}
</style>
