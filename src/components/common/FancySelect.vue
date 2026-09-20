<template>
  <div class="f-select" :class="{ 'f-select--disabled': disabled }">
    <div class="f-select__trigger" @click="toggleOpen">
      <FancyInput
        :name="name"
        :label="label"
        :model-value="selectedLabel"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error"
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
import { computed, ref } from "vue";
import FancyInput from "./FancyInput.vue";
import FancyPopper from "./FancyPopper.vue";
import FancyDropdown from "./FancyDropdown.vue";
import FancyOptionList from "./FancyOptionList.vue";
import type { SelectProps, SelectValue } from "./select.types";

const props = defineProps<SelectProps>();
const emit = defineEmits<{ "update:modelValue": [value: SelectValue] }>();
const open = ref(false);
const selectedLabel = computed(
  () =>
    props.options.find((option) => option.value === props.modelValue)?.label ??
    "",
);
const activeIndex = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue),
);

function toggleOpen() {
  if (!props.disabled) open.value = !open.value;
}

function selectOption(value: SelectValue) {
  emit("update:modelValue", value);
  open.value = false;
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
