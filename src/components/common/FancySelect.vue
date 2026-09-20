<template>
  <div ref="root" class="f-select" :class="{ 'f-select--disabled': disabled }">
    <div
      ref="trigger"
      class="f-select__trigger"
      @click="toggleOpen"
      @keydown.down.prevent="moveActive(1)"
      @keydown.up.prevent="moveActive(-1)"
      @keydown.enter.prevent="handleEnter"
      @keydown.space.prevent="handleEnter"
      @keydown.esc.prevent="closeOptions"
      @keydown.tab="closeOptions"
    >
      <FancyInput
        :name="name"
        :label="label"
        :model-value="selectedLabel"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
        input-role="combobox"
        :aria-expanded="open"
        :aria-controls="`${name}-options`"
        :aria-active-descendant="
          open && activeIndex >= 0
            ? `${name}-options-option-${activeIndex}`
            : undefined
        "
        aria-has-popup="listbox"
        aria-autocomplete="none"
        readonly
        full-width
      />
    </div>
    <FancyPopper
      :visible="open"
      placement="bottom-start"
      auto-width
      :append-to-body="false"
    >
      <FancyDropdown class="f-select__dropdown">
        <FancyOptionList
          :id="`${name}-options`"
          :label="label || name"
          :options="options"
          :model-value="modelValue"
          :active-index="activeIndex"
          @select="selectOption"
        />
      </FancyDropdown>
    </FancyPopper>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import FancyInput from "./FancyInput.vue";
import FancyPopper from "./FancyPopper.vue";
import FancyDropdown from "./FancyDropdown.vue";
import FancyOptionList from "./FancyOptionList.vue";
import type { SelectProps, SelectValue } from "./select.types";

const props = defineProps<SelectProps>();
const emit = defineEmits<{ "update:modelValue": [value: SelectValue] }>();
const open = ref(false);
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const activeIndex = ref(-1);
const selectedLabel = computed(
  () =>
    props.options.find((option) => option.value === props.modelValue)?.label ??
    "",
);
onMounted(() => document.addEventListener("pointerdown", handleOutside));
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", handleOutside),
);
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeOptions();
  },
);

function toggleOpen() {
  if (props.disabled) return;
  if (open.value) closeOptions();
  else openOptions();
}

function openOptions() {
  if (props.disabled) return;
  open.value = true;
  const selected = props.options.findIndex(
    (option) => option.value === props.modelValue && !option.disabled,
  );
  activeIndex.value = selected >= 0 ? selected : findNextEnabled(-1, 1);
}

function closeOptions() {
  open.value = false;
  activeIndex.value = -1;
}

function moveActive(direction: 1 | -1) {
  if (props.disabled) return;
  if (!open.value) {
    openOptions();
    if (
      direction === -1 &&
      !props.options.some((option) => option.value === props.modelValue)
    ) {
      activeIndex.value = findNextEnabled(0, -1);
    }
    return;
  }
  activeIndex.value = findNextEnabled(activeIndex.value, direction);
}

function findNextEnabled(start: number, direction: 1 | -1): number {
  const count = props.options.length;
  if (!count) return -1;
  for (let step = 1; step <= count; step += 1) {
    const index = (start + direction * step + count * 2) % count;
    if (!props.options[index].disabled) return index;
  }
  return -1;
}

function handleEnter() {
  if (!open.value) {
    openOptions();
    return;
  }
  if (activeIndex.value >= 0)
    selectOption(props.options[activeIndex.value].value);
}

function handleOutside(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) {
    closeOptions();
  }
}

function selectOption(value: SelectValue) {
  emit("update:modelValue", value);
  closeOptions();
  trigger.value?.querySelector("input")?.focus();
}
</script>

<style scoped lang="scss">
.f-select {
  position: relative;
  min-width: 0;
  width: 100%;

  &__trigger {
    cursor: pointer;
  }

  &__dropdown {
    --dropdown-width: 100%;
  }

  &--disabled {
    opacity: 0.65;
  }
}
</style>
