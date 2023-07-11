<template>
  <div class="pagination">
    <f-button
      v-for="page in props.pages"
      :key="page"
      size="tiny"
      :variant="page !== props.currentPage ? 'outlined' : 'filled'"
      @click="$emit('select', page)"
    >
      {{ page }}
    </f-button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  pages: number;
  currentPage: number;
}>();
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  :deep(.f-button) {
    margin-left: 10px;
  }
}
</style>
