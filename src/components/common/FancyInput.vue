<template>
  <div class="f-input" :class="classNames">
    <label class="f-input__label" v-if="label" :for="name">
      {{ label }}
    </label>
    <div class="f-input__container">
      <span v-if="$slots.before" class="f-input__before">
        <slot name="before"></slot>
      </span>
      <input
        class="f-input__input"
        :id="name"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :disabled="disabled"
        :readonly="readonly"
        autocomplete="nope"
        @input="handleInput"
        @blur="handleBlur"
        @change="handleChange"
        @keyup="handleKeyup"
        @keyup.enter="handleKeyupEnter"
      />
      <svg-icon
        v-if="clearable && withValue"
        class="f-input__clear-icon"
        @click="handleClear"
        :src="CloseIcon"
      />
      <span v-else-if="$slots.after" class="f-input__after">
        <slot name="after"></slot>
      </span>
    </div>
    <div class="f-input__error">
      <span class="f-input__error-message" v-if="error">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import CloseIcon from "@/assets/icons/close-line.svg";

export type InputSize = "large" | "medium" | "small";

export default defineComponent({
  name: "f-input",
  components: {
    SvgIcon,
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
    },
    error: {
      type: String,
    },
    size: {
      type: String as PropType<InputSize>,
      default: () => "medium",
    },
    clearable: {
      type: Boolean,
      default: () => false,
    },
    type: {
      type: String,
      default: () => "text",
    },
    fullWidth: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["update:modelValue", "clear", "change", "keyup", "enter", "blur"],
  data() {
    return {
      CloseIcon,
    };
  },
  computed: {
    classNames() {
      const sizeClassName = `f-input--${this.size}`;
      const classesObject = {
        "f-input--before": !!this.$slots.before,
        "f-input--after": !!(this.$slots.after || this.clearable),
        "f-input--error": !!this.error,
        "f-input--full": !!this.fullWidth,
      };

      const classes = [classesObject] as unknown as string[];
      classes.push(sizeClassName);

      return classes;
    },
    withValue() {
      return this.modelValue && `${this.modelValue}`.length;
    },
  },
  methods: {
    handleInput(e: Event) {
      this.$emit("update:modelValue", (e.target as HTMLInputElement).value);
    },
    handleChange(e: Event) {
      this.$emit("change", (e.target as HTMLInputElement).value);
    },
    handleClear() {
      this.$emit("update:modelValue", "");
      this.$emit("clear");
    },
    handleKeyup() {
      this.$emit("keyup");
    },
    handleKeyupEnter() {
      this.$emit("enter");
    },
    handleBlur() {
      this.$emit("blur");
    },
  },
});
</script>

<style lang="scss" scoped>
.f-input {
  $this: &;
  --main-color: var(--blue-color);
  --text-color: var(--black-color);
  --label-color: var(--grey-color);
  --border-color: transparent;
  --error-color: var(--red-color);

  --input-padding: 10px 16px;
  --input-icon-width: 16px;
  --input-text-size: 1rem;
  --input-label-size: 0.875rem;
  --input-icon-size: 24px;
  --input-error-height: 23px;
  --input-width: auto;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 0.2s ease-out;
  margin-bottom: 8px;
  width: var(--input-width);

  &__label {
    font-size: var(--input-label-size);
    cursor: pointer;
    color: var(--label-color);
  }

  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 6px;
    width: var(--input-width);

    &:hover,
    &:active,
    &:focus {
      #{$this}__input {
        --border-color: var(--blue-color);
        background-color: var(--white-color);
      }
    }
  }

  &__input {
    padding: var(--input-padding);
    font-size: var(--input-text-size);
    background-color: var(--beige-color);
    width: var(--input-width);
    border: 1px solid var(--border-color);
    outline: none;
    cursor: pointer;
    border-radius: 5px;

    &:active,
    &:focus {
      --border-color: var(--blue-color);
      background-color: var(--white-color);
    }
  }

  &__before {
    left: 10px;
  }

  &__before,
  &__after {
    --icon-color: var(--grey-color);

    position: absolute;
    z-index: 2;
  }

  &__clear-icon,
  &__before,
  &__after {
    width: var(--input-icon-size);
    height: var(--input-icon-size);

    &:hover {
      --icon-color: var(--blue-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(1.1);
    }
  }

  &__clear-icon {
    position: absolute;
    right: 10px;
  }

  &__error {
    height: var(--input-error-height);
  }

  &__error-message {
    color: var(--error-color);
    font-size: var(--input-label-size);
  }

  &--full {
    --input-width: 100%;
  }

  &--error {
    --border-color: var(--error-color);
  }

  &--large {
    --input-padding: 12px 18px;
    --input-text-size: 1.5rem;
    --input-label-size: 1.125rem;
    --input-icon-size: 28px;
    --input-error-height: 25px;
  }

  &--before {
    --input-padding: 12px 18px 12px 46px;
  }

  &--after {
    --input-padding: 12px 46px 12px 18px;
  }

  &--before,
  &--after {
    --input-padding: 12px 46px;
  }
}
</style>
