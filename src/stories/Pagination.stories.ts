import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import FancyPagination from '@/components/common/FancyPagination.vue';
import FancyCard from '@/components/common/FancyCard.vue';

interface StoryArgs {
  pages: number;
  currentPage: number;
}

export default {
  title: 'FancyPagination',
  component: FancyPagination,
  tags: ['autodocs'],
  args: {
    pages: 4,
    currentPage: 1,
  },
  argTypes: {
    pages: { control: 'number' },
    currentPage: { control: 'number' },
  },
} as Meta<typeof FancyPagination>

export const Pagination: StoryFn<StoryArgs> = (args) => ({
  components: { FancyPagination, FancyCard },
  setup() {
    return { args };
  },
  template: `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-bottom: 20px;">
        <FancyCard v-for="n in 5" :key="n" style="width: 200px; height: 150px;">
          Card {{ n + (args.currentPage - 1) * 5 }}
        </FancyCard>
      </div>
      <div style="display: flex; justify-content: center; width: 100%;">
        <FancyPagination v-bind="args" @select="args.currentPage = $event" />
      </div>
    </div>
  `,
}) as StoryObj<typeof FancyPagination>;
