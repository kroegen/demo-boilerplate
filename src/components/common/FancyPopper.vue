<template>
  <div v-show="showPopper" class="f-popper">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import * as Popper from "@popperjs/core";

export default defineComponent({
  name: "f-popper",

  props: {
    placement: {
      type: String as PropType<Popper.Placement>,
      default: () => "auto",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Array as PropType<number[]>,
      default() {
        return [0, 5];
      },
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    autoWidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPopper: false,
      currentPlacement: "",
      popper: null as Popper.Instance | null,
      element: null as HTMLElement | null,
      reference: null as HTMLElement | null,
    };
  },
  watch: {
    placement: {
      immediate: true,
      handler(value) {
        if (this.element && this.popper) {
          this.updatePlacement(value);
        }
      },
    },
    visible: {
      immediate: true,
      handler(value) {
        this.showPopper = value;
      },
    },
    showPopper(value) {
      if (value) {
        this.createPopper();
      } else {
        this.destroyPopper();
      }

      this.$emit("change", value);
    },
  },
  created() {
    this.createPopper();
  },
  beforeUnmount() {
    this.destroyPopper();
  },
  methods: {
    createPopper() {
      this.currentPlacement = this.currentPlacement || this.placement;
      this.element = this.element || this.$el;
      this.reference =
        this.reference || (this.element?.parentNode as HTMLElement);

      if (!this.element || !this.reference) return;

      if (this.appendToBody) document.body.appendChild(this.element);

      const options = {
        placement: this.currentPlacement as Popper.Placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: this.offset,
            },
          },
        ],
      };

      if (this.autoWidth) {
        const autoWidth = {
          name: "autoWidth",
          enabled: true,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: ({ state }: { state: any }) => {
            state.styles.popper.width = `${state.rects.reference.width}px`;
          },
          effect: ({ state }: { state: any }) => {
            state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
          },
        };

        options.placement = "bottom-start";
        // @ts-ignore
        options.modifiers.push(autoWidth);
      }

      this.popper = Popper.createPopper(this.reference, this.element, options);
    },

    destroyPopper() {
      if (!this.popper) return;
      if (
        this.element &&
        (this.element as HTMLElement).parentNode === document.body
      ) {
        document.body.removeChild(this.element);
      }

      this.popper.destroy();
      this.popper = null;
    },

    async updatePlacement(value: Popper.Placement) {
      this.currentPlacement = value;

      if (this.popper) {
        await this.popper.setOptions({ placement: value });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.f-popper {
  $this: &;

  z-index: 50;
}
</style>
