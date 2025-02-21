import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyCard from '@/components/common/FancyCard.vue';

interface StoryArgs {
  content: string;
}

export default {
  title: 'FancyCard',
  component: FancyCard,
  tags: ['autodocs'],
  args: { content: "This is a fancy card" },
} as Meta<typeof FancyCard>

export const Card: StoryFn<StoryArgs> = (args) => ({
  components: { FancyCard },
  setup() {
    return { args };
  },
  template: `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <FancyCard style="margin-bottom: 20px;">
        {{ args.content }}
      </FancyCard>
    </div>
  `,
}) as StoryObj<typeof FancyCard>;
