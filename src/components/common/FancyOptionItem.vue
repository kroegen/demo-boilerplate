<template>
  <div
    :id="id"
    class="f-option-item"
    :class="{
      'f-option-item--active': active,
      'f-option-item--selected': selected,
      'f-option-item--disabled': disabled,
    }"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled"
    @mousedown.prevent
    @click="handleSelect"
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import type { SelectValue } from "./select.types";

const props = defineProps<{
  id: string;
  value: SelectValue;
  label: string;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
}>();
const emit = defineEmits<{ select: [value: SelectValue] }>();

function handleSelect() {
  if (!props.disabled) emit("select", props.value);
}
</script>

<style scoped lang="scss">
.f-option-item {
  padding: 9px 12px;
  cursor: pointer;

  &--active,
  &:hover:not(.f-option-item--disabled) {
    background: var(--beige-color);
  }

  &--selected {
    color: var(--blue-color);
    font-weight: 600;
  }

  &--disabled {
    color: var(--grey-color);
    cursor: default;
  }
}
</style>
