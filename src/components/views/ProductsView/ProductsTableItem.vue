<template>
  <div class="table-item">
    <span v-if="!isEditing" class="table-item__title">
      {{ product.title }}
    </span>
    <span v-else class="table-item__title">
      <input
        v-model="draft.title"
        class="table-item__field"
        type="text"
        :aria-label="$t('labels.title')"
      />
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
    <span v-if="!isEditing" class="table-item__price">
      {{ product.price }}
    </span>
    <span v-else class="table-item__price">
      <input
        v-model.number="draft.price"
        class="table-item__field"
        type="number"
        min="0"
        step="0.01"
        :aria-label="$t('labels.price')"
      />
    </span>
    <span class="table-item__actions">
      <button
        v-if="!isEditing"
        type="button"
        class="table-item__action"
        @click="startEditing"
      >
        {{ $t("actions.edit") }}
      </button>
      <button
        v-else
        type="button"
        class="table-item__action"
        @click="cancelEditing"
      >
        {{ $t("actions.cancel") }}
      </button>
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from "@/api/services/interfaces";
import { computed, reactive, ref } from "vue";

interface Props {
  product: Product;
  active: boolean;
}

const props = defineProps<Props>();
const isEditing = ref(false);
const draft = reactive({
  title: props.product.title,
  price: props.product.price,
  stock: props.product.stock,
  category: props.product.category,
});

const product = computed(() => {
  return props.product;
});

function startEditing() {
  resetDraft();
  isEditing.value = true;
}

function cancelEditing() {
  resetDraft();
  isEditing.value = false;
}

function resetDraft() {
  draft.title = props.product.title;
  draft.price = props.product.price;
  draft.stock = props.product.stock;
  draft.category = props.product.category;
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

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

  &__action {
    border: 0;
    background: transparent;
    color: var(--blue-color);
    cursor: pointer;
  }

  &__field {
    width: 100%;
    min-width: 0;
    padding: 6px;
    border: 1px solid var(--blue-color);
    border-radius: 4px;
  }
}
</style>
