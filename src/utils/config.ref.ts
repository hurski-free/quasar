import { ref, type Ref } from "vue";
import type { IQuasarRangeProperty } from "../core";

type QuasarRangePropertyRef = Omit<IQuasarRangeProperty, 'default'> & { value: number };

export type QuasarArmRef = {
  id: string;
  angle: QuasarRangePropertyRef;
  angleDispersion: QuasarRangePropertyRef;
  angleCenteredPower: QuasarRangePropertyRef;
  zDispersion: QuasarRangePropertyRef;
  zCenteredPower: QuasarRangePropertyRef;
  particleGenerateStep: QuasarRangePropertyRef;
  color: string;
};

export function createRangeProperty() {
  return {
    value: 0,
    min: 0,
    max: 0,
    step: 0,
  } satisfies QuasarRangePropertyRef;
}

export function createRangePropertyRef() {
  return ref<QuasarRangePropertyRef>({
    value: 0,
    min: 0,
    max: 0,
    step: 0,
  });
}

export function fillRangeProperty(ref: QuasarRangePropertyRef, cfg: IQuasarRangeProperty) {
  ref.value = cfg.default;
  ref.min = cfg.min;
  ref.max = cfg.max;
  ref.step = cfg.step;
}

export function fillRangePropertyRef(ref: Ref<QuasarRangePropertyRef>, cfg: IQuasarRangeProperty) {
  ref.value.value = cfg.default;
  ref.value.min = cfg.min;
  ref.value.max = cfg.max;
  ref.value.step = cfg.step;
}
