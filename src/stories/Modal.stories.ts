import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyModal from '@/components/common/FancyModal.vue';
import FancyButton from '@/components/common/FancyButton.vue';

interface StoryArgs {
  opened: boolean;
  closeByClickOutside: boolean;
}

export default {
  title: 'FancyModal',
  component: FancyModal,
  tags: ['autodocs'],
  args: {
    opened: true,
    closeByClickOutside: true,
  },
  argTypes: {
    opened: { control: 'boolean' },
    closeByClickOutside: { control: 'boolean' },
  },
} as Meta<typeof FancyModal>

export const Modal: StoryFn<StoryArgs> = (args) => ({
  components: { FancyModal, FancyButton },
  setup() {
    return { args };
  },
  template: `
    <div style="width: 80vw; height: 80vh; display: flex; align-items: center; justify-content: center;">
      <FancyModal v-bind="args">
        <template #header>
          <h3>Modal Header</h3>
        </template>
        <template #default>
          <p>This is the content of the modal.</p>
        </template>
        <template #actions-left>
          <FancyButton @click="args.opened = false" variant="outlined">Cancel</FancyButton>
        </template>
        <template #actions-right>
          <FancyButton @click="args.opened = false" variant="filled">Confirm</FancyButton>
        </template>
      </FancyModal>
    </div>
  `,
}) as StoryObj<typeof FancyModal>;
