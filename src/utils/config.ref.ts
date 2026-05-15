import { ref, type Ref } from "vue";
import type { IQuasarRangeProperty } from "../core/quasar.conf";

type QuasarRangePropertyRef = Omit<IQuasarRangeProperty, 'default'> & { value: number };

export function createRangePropertyRef() {
  return ref<QuasarRangePropertyRef>({
    value: 0,
    min: 0,
    max: 0,
    step: 0,
  });
}

export function fillRangePropertyRef(ref: Ref<QuasarRangePropertyRef>, cfg: IQuasarRangeProperty) {
  ref.value.value = cfg.default;
  ref.value.min = cfg.min;
  ref.value.max = cfg.max;
  ref.value.step = cfg.step;
}
