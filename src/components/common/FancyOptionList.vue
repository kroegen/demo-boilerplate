<template>
  <div :id="id" class="f-option-list" role="listbox" :aria-label="label">
    <FancyOptionItem
      v-for="(option, index) in options"
      :id="`${id}-option-${index}`"
      :key="`${option.value}-${index}`"
      :value="option.value"
      :label="option.label"
      :disabled="option.disabled"
      :active="index === activeIndex"
      :selected="option.value === modelValue"
      @select="emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FancyOptionItem from "./FancyOptionItem.vue";
import type { SelectOption, SelectValue } from "./select.types";

defineProps<{
  id: string;
  label: string;
  options: SelectOption[];
  modelValue: SelectValue;
  activeIndex: number;
}>();
const emit = defineEmits<{ select: [value: SelectValue] }>();
</script>
