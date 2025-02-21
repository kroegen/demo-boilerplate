import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyInput from '@/components/common/FancyInput.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import UserIcon from '@/assets/icons/user-fill.svg';

interface StoryArgs {
  modelValue: string;
  placeholder: string;
  label: string;
  error: string;
  clearable: boolean;
  size: string;
}

export default {
  title: 'FancyInput',
  component: FancyInput,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    placeholder: 'Enter text',
    label: 'Input Label',
    error: '',
    clearable: true,
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
    },
  },
} as Meta<typeof FancyInput>

export const Input: StoryFn<StoryArgs> = (args) => ({
  components: { FancyInput, SvgIcon },
  setup() {
    return { args, UserIcon };
  },
  template: `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <FancyInput v-bind="args">
        <template #before>
          <svg-icon :src="UserIcon" />
        </template>
      </FancyInput>
    </div>
  `,
}) as StoryObj<typeof FancyInput>;
