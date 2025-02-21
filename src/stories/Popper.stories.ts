import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyPopper from '@/components/common/FancyPopper.vue';
import FancyButton from '@/components/common/FancyButton.vue';
import FancyCard from '@/components/common/FancyCard.vue';

interface StoryArgs {
  visible: boolean;
  placement: string;
}

export default {
  title: 'FancyPopper',
  component: FancyPopper,
  tags: ['autodocs'],
  args: {
    visible: false,
    placement: 'bottom',
  },
  argTypes: {
    visible: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'auto'],
    },
  },
} as Meta<typeof FancyPopper>

export const Popper: StoryFn<StoryArgs> = (args) => ({
  components: { FancyPopper, FancyButton, FancyCard },
  setup() {
    return { args };
  },
  data() {
    return {
      showPopper: args.visible,
    };
  },
  template: `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <FancyButton @click="showPopper = !showPopper">
        Toggle Popper
      </FancyButton>
      <FancyPopper :visible="showPopper" :placement="args.placement" @change="showPopper = $event">
        <FancyCard style="width: 200px; height: 150px;">
          This is a popper card.
        </FancyCard>
      </FancyPopper>
    </div>
  `,
}) as StoryObj<typeof FancyPopper>;
