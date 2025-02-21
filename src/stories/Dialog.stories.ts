import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyDialog from '@/components/common/FancyDialog.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import CloseIcon from '@/assets/icons/close-line.svg';
import FancyButton from '@/components/common/FancyButton.vue';

interface StoryArgs {
  opened: boolean;
  closable: boolean;
  closeByClickOutside: boolean;
}

export default {
  title: 'FancyDialog',
  component: FancyDialog,
  tags: ['autodocs'],
  args: {
    opened: true,
    closable: true,
    closeByClickOutside: true,
  },
  argTypes: {
    opened: { control: 'boolean' },
    closable: { control: 'boolean' },
    closeByClickOutside: { control: 'boolean' },
  },
} as Meta<typeof FancyDialog>

export const Dialog: StoryFn<StoryArgs> = (args) => ({
  components: { FancyDialog, SvgIcon, FancyButton },
  setup() {
    return { args, CloseIcon };
  },
  template: `
    <div style="width: 80vw; height: 80vh; display: flex; align-items: center; justify-content: center;">
      <FancyDialog v-bind="args">
        <template #header>
          <h3>Dialog Header</h3>
        </template>
        <template #default>
          <p>This is the content of the dialog.</p>
        </template>
        <template #actions-left>
          <FancyButton @click="args.opened = false" variant="outlined">Cancel</FancyButton>
        </template>
        <template #actions-right>
          <FancyButton @click="args.opened = false" variant="filled">Confirm</FancyButton>
        </template>
      </FancyDialog>
    </div>
  `,
}) as StoryObj<typeof FancyDialog>;
