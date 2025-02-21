import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import type { ButtonProps } from '@/components/common/FancyButton.vue';

import FancyButton from '@/components/common/FancyButton.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import StoreIcon from '@/assets/icons/store-line.svg';
import MenuIcon from "@/assets/icons/menu-line.svg";

interface StoryArgs extends ButtonProps {
  label: string;
}

export default {
  title: 'FancyButton',
  component: FancyButton,
  tags: ['autodocs'],
  args: { label: "Button" },
  argTypes: {
    size: {
      control: 'select',
      options: ['tiny', 'small', 'medium', 'large']
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outlined", "text"],
    },
  },
} as Meta<typeof FancyButton>

export const Button: StoryFn<StoryArgs> = (args) => ({
  components: { FancyButton, SvgIcon },
  setup() {
    return { args };
  },
  props: {
    icons: {
      default: () => ({ store: StoreIcon, menu: MenuIcon}),
    },
  },
  args: {
    variant: "filled",
    size: "medium",
  },
  template: `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <FancyButton style="margin-bottom: 20px;" v-bind="args">{{ args.label }}</FancyButton>
      <FancyButton style="margin-bottom: 20px;" v-bind="args">
        <template #before>
          <svg-icon :src="icons.store" />
        </template>
        {{ args.label }}
      </FancyButton>
      <FancyButton style="margin-bottom: 20px;" v-bind="args">
        {{ args.label }}
        <template #after>
          <svg-icon :src="icons.menu" />
        </template>
      </FancyButton>
    </div>
  `,
}) as StoryObj<typeof FancyButton>;

