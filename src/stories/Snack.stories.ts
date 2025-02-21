import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancySnack, { SnackType, type SnackConfig } from '@/components/common/FancySnack.vue';
import { emitter } from '@/utils/emitter';
import { reactive } from 'vue';

export default {
  title: 'FancySnack',
  component: FancySnack,
  tags: ['autodocs'],
  args: {
    snack: {
      text: 'This is a snack message',
      type: SnackType.info,
      icon: true,
      closable: true,
      duration: 5000,
    } as SnackConfig,
  },
  argTypes: {
    snack: {
      control: 'object',
    },
  },
} as Meta<typeof FancySnack>;

export const Snack: StoryFn<typeof FancySnack> = (args) => ({
  components: { FancySnack },
  setup() {
    const state = reactive({
      showSnack: false,
      snackConfig: null as SnackConfig | null,
    });

    emitter.on('showSnack', (config: SnackConfig) => {
      state.snackConfig = config;
      state.showSnack = true;
    });

    function triggerSnack() {
      emitter.emit('showSnack', args.snack as SnackConfig);
    }

    function handleCloseSnack() {
      state.snackConfig = null;
      state.showSnack = false;
    }

    return { args, state, triggerSnack, handleCloseSnack };
  },
  template: `
    <div style="padding: 20px;">
      <button @click="triggerSnack">Show Snack</button>
      <FancySnack
        v-if="state.showSnack && state.snackConfig"
        :snack="state.snackConfig"
        @close="handleCloseSnack"
      />
    </div>
  `,
}) as StoryObj<typeof FancySnack>;
