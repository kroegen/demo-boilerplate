<template>
  <div class="table-item">
    <span class="table-item__title">
      {{ product.title }}
    </span>
    <span class="table-item__brand">
      {{ product.brand }}
    </span>
    <span class="table-item__description">
      {{ product.description }}
    </span>
    <span class="table-item__category">
      {{ product.category }}
    </span>
    <span class="table-item__price">
      {{ product.price }}
    </span>
    <span class="table-item__actions"></span>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from "@/api/services/interfaces";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
  active: Boolean;
}>();

const product = computed(() => {
  return props.product;
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.table-item {
  --border-color: transparent;

  display: flex;
  flex-direction: row;
  height: 60px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-left: 3px solid var(--border-color);
  border-right: 3px solid var(--border-color);
  transition: all 300ms;
  flex-shrink: 0;

  &:hover {
    --border-color: var(--blue-color);
    cursor: pointer;
    background: var(--beige-color);
  }

  & > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 5px;
    font-size: 0.75rem;
    height: 100%;
  }

  &__title {
    flex: 1;
    min-width: 100px;
  }

  &__brand {
    flex: 1;
    min-width: 100px;
  }

  &__description {
    flex: 3;
    min-width: 300px;
  }

  &__category {
    flex: 1;
    min-width: 100px;
  }

  &__price {
    flex: 1;
    min-width: 100px;
  }

  &__actions {
    flex: 1;
    min-width: 100px;
  }
}
</style>
