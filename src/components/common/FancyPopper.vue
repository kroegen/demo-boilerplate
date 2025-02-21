<template>
  <div v-show="showPopper" class="f-popper">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import {
  createPopper,
  type Instance,
  type Placement,
  type Options,
  type VirtualElement,
  type Modifier,
  type ModifierArguments,
  type State,
  type Offsets
} from "@popperjs/core";

declare type OffsetData = {
  [key in Placement]?: Offsets;
};

// Define types for our custom modifier
type AutoWidthData = Record<string, never>;

interface PopperStyles extends Partial<CSSStyleDeclaration> {
  width?: string;
}

interface PopperState extends State {
  styles: {
    [key: string]: Partial<CSSStyleDeclaration>;
    popper: PopperStyles;
  };
}

export default defineComponent({
  name: "f-popper",

  props: {
    placement: {
      type: String as PropType<Placement>,
      default: "auto",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Array as PropType<OffsetData>,
      default: () => [0, 5],
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
      currentPlacement: "" as Placement,
      popper: null as Instance | null,
      element: null as HTMLElement | null,
      reference: null as (HTMLElement | VirtualElement) | null,
    };
  },

  watch: {
    placement: {
      immediate: true,
      handler(value: Placement) {
        if (this.element && this.popper) {
          this.updatePlacement(value);
        }
      },
    },
    visible: {
      immediate: true,
      handler(value: boolean) {
        this.showPopper = value;
      },
    },
    showPopper(value: boolean) {
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
      this.reference = this.reference || (this.element?.parentNode as HTMLElement);

      if (!this.element || !this.reference) return;

      if (this.appendToBody) document.body.appendChild(this.element);

      const options: Partial<Options> = {
        placement: this.currentPlacement,
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
        const autoWidth: Modifier<"autoWidth", AutoWidthData> = {
          name: "autoWidth",
          enabled: true,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn({ state }: ModifierArguments<AutoWidthData>) {
            const popperState = state as PopperState;
            const width = `${(popperState.elements.reference as HTMLElement).offsetWidth}px`;
            popperState.styles.popper.width = width;
          },
          effect({ state }: ModifierArguments<AutoWidthData>) {
            const popperState = state as PopperState;
            const width = `${(popperState.elements.reference as HTMLElement).offsetWidth}px`;
            (popperState.elements.popper as HTMLElement).style.width = width;
          },
        };

        options.placement = "bottom-start";
        options.modifiers?.push(autoWidth);
      }

      this.popper = createPopper(this.reference, this.element, options);
    },

    destroyPopper() {
      if (!this.popper) return;
      if (this.element?.parentNode === document.body) {
        document.body.removeChild(this.element);
      }
      this.popper.destroy();
      this.popper = null;
    },

    async updatePlacement(value: Placement) {
      this.currentPlacement = value;
      await this.popper?.setOptions({ placement: value });
    },
  },
});
</script>

<style lang="scss" scoped>
.f-popper {
  z-index: 50;
}
</style>
