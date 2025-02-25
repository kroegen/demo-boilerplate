import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import IconCounter from '@/components/common/IconCounter.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import HeartIcon from '@/assets/icons/heart-fill.svg';

export default {
  title: 'IconCounter',
  component: IconCounter,
  tags: ['autodocs'],
  args: {
    counter: 5,
    icon: HeartIcon,
  },
  argTypes: {
    counter: { control: 'number' },
    icon: { control: 'text' },
  },
} as Meta<typeof IconCounter>;

export const Counter: StoryFn<typeof IconCounter> = (args) => ({
  components: { IconCounter, SvgIcon },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;">
      <IconCounter v-bind="args" @click="handleClick">
        <template #default>
          <p>Additional content inside the counter</p>
        </template>
      </IconCounter>
    </div>
  `,
  methods: {
    handleClick() {
      alert('IconCounter clicked!');
    },
  },
}) as StoryObj<typeof IconCounter>;
