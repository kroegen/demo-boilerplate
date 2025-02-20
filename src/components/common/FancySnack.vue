<template>
  <div v-if="show" class="f-snack" :class="`f-snack--${[type]}`">
    <div v-if="icon" class="f-snack__icon">
      <slot name="icon" v-if="$slots.icon"></slot>
      <svg-icon
        v-else-if="type === 'success'"
        class="f-snack__success-icon"
        :src="icons.CheckIcon"
      />
      <svg-icon
        v-else-if="type === 'warning'"
        class="f-snack__warning-icon"
        :src="icons.ErrorIcon"
      />
      <svg-icon v-else class="f-snack__error-icon" :src="icons.ErrorIcon" />
    </div>
    <div class="f-snack__body">
      {{ text }}
    </div>
    <svg-icon
      v-if="closable"
      class="f-snack__close-icon"
      @click="handleCloseSnack"
      :src="icons.CloseIcon"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import SvgIcon from "@/components/common/SvgIcon.vue";
import InfoIcon from "@/assets/icons/info-line.svg";
import ErrorIcon from "@/assets/icons/error-line.svg";
import CloseIcon from "@/assets/icons/close-line.svg";
import CheckIcon from "@/assets/icons/check-fill.svg";

export enum SnackType {
  success = "success",
  info = "info",
  warning = "warning",
}

export interface SnackConfig {
  text: string | string[];
  type?: SnackType;
  icon?: boolean;
  duration?: number;
  closable?: boolean;
}

export default defineComponent({
  name: "f-snack",
  components: {
    SvgIcon,
  },
  props: {
    snack: {
      type: Object as PropType<SnackConfig>,
    },
  },
  computed: {
    text() {
      return typeof this.snack?.text === "string"
        ? this.snack.text
        : this.snack?.text[0];
    },
    type() {
      return this.snack?.type ? SnackType[this.snack.type] : SnackType.success;
    },
    closable() {
      return this.snack?.closable ?? false;
    },
    icon() {
      return this.snack?.icon ?? false;
    },
    duration() {
      return this.snack?.duration ?? 5000;
    },
    isInfiniteDuration() {
      return this.duration <= 0;
    },
  },
  data: () => ({
    show: false,
    icons: {
      CloseIcon,
      InfoIcon,
      ErrorIcon,
      CheckIcon,
    },
  }),
  created() {
    this.showSnack();
  },
  methods: {
    handleCloseSnack() {
      this.show = false;
      this.$emit("close");
    },
    showSnack() {
      this.show = true;

      if (!this.isInfiniteDuration) {
        setTimeout(() => {
          this.handleCloseSnack();
        }, this.duration);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.f-snack {
  $this: &;

  --toast-padding: 20px;
  --toast-height: 90px;
  --main-color: var(--blue-color);
  --secondary-color: var(--beige-color);
  --third-color: var(--white-color);

  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--toast-padding);
  position: fixed;
  width: auto;
  max-width: 500px;
  height: var(--toast-height);
  bottom: 20px;
  margin: 0px auto;
  left: 0px;
  right: 0px;
  border-radius: 15px;
  box-shadow: var(--shadow-large);
  z-index: 53;

  background-color: var(--main-color);
  border: 1px solid;
  border-color: var(--secondary-color);

  &__body {
    font-weight: 400;
    color: var(--secondary-color);
  }

  &__icon {
    --icon-color: var(--secondary-color);

    width: 40px;
    height: 40px;
    margin-right: 25px;
  }

  &__success-icon,
  &__warning-icon {
    width: inherit;
    height: inherit;
  }

  &__close-icon {
    --icon-color: var(--secondary-color);

    width: 30px;
    height: 30px;
    margin-left: 25px;
    cursor: pointer;

    &:hover {
      --icon-color: var(--third-color);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &--info {
    --main-color: var(--beige-color);
    --secondary-color: var(--blue-color);
    --third-color: var(--blue-color);
  }

  &--warning {
    --main-color: var(--red-color);
  }

  @include mixins.mobile {
    bottom: none;
    top: 0px;
    border-radius: 0px;
  }
}
</style>
