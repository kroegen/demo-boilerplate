import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyDropdown from '@/components/common/FancyDropdown.vue';
import FancyButton from '@/components/common/FancyButton.vue';

export default {
  title: 'FancyDropdown',
  component: FancyDropdown,
  tags: ['autodocs'],
  args: {
    dropdownContent: 'This is the content of the dropdown.',
  },
  argTypes: {
    dropdownContent: { control: 'text' },
  },
} as Meta<typeof FancyDropdown>;

export const Dropdown: StoryFn<typeof FancyDropdown> = (args) => ({
  components: { FancyDropdown, FancyButton },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;">
      <FancyButton @click="toggleDropdown">Toggle Dropdown</FancyButton>
      <FancyDropdown v-if="showDropdown">
        <template #default>
          <p>{{ args.dropdownContent }}</p>
        </template>
      </FancyDropdown>
    </div>
  `,
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
  },
}) as StoryObj<typeof FancyDropdown>;
