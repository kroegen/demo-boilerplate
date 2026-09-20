<template>
  <div
    class="table-item"
    :class="{ 'table-item--editing': isEditing }"
    :aria-busy="saving"
  >
    <span v-if="!isEditing" class="table-item__title">
      {{ product.title }}
    </span>
    <span v-else class="table-item__title">
      <input
        v-model="title"
        class="table-item__field"
        type="text"
        :aria-label="$t('labels.title')"
      />
      <small v-if="titleError" class="table-item__error" role="alert">{{
        titleError
      }}</small>
    </span>
    <span class="table-item__brand">
      {{ product.brand }}
    </span>
    <span class="table-item__description">
      {{ product.description }}
    </span>
    <span v-if="!isEditing" class="table-item__category">
      {{ product.category }}
    </span>
    <span v-else class="table-item__category">
      <select
        v-model="category"
        class="table-item__field"
        :aria-label="$t('labels.category')"
      >
        <option
          v-for="category in categories"
          :key="category.slug"
          :value="category.slug"
        >
          {{ category.name }}
        </option>
      </select>
      <small v-if="categoryError" class="table-item__error" role="alert">{{
        categoryError
      }}</small>
    </span>
    <span v-if="!isEditing" class="table-item__price">
      {{ product.price }}
    </span>
    <span v-else class="table-item__price">
      <input
        v-model.number="price"
        class="table-item__field"
        type="number"
        min="0"
        step="0.01"
        :aria-label="$t('labels.price')"
      />
      <small v-if="priceError" class="table-item__error" role="alert">{{
        priceError
      }}</small>
    </span>
    <span v-if="!isEditing" class="table-item__stock">{{ product.stock }}</span>
    <span v-else class="table-item__stock">
      <input
        v-model.number="stock"
        class="table-item__field"
        type="number"
        min="0"
        step="1"
        :aria-label="$t('labels.stock')"
      />
      <small v-if="stockError" class="table-item__error" role="alert">{{
        stockError
      }}</small>
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
        :disabled="saving"
        @click="cancelEditing"
      >
        {{ $t("actions.cancel") }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        class="table-item__action"
        :disabled="saving"
        @click="saveProduct"
      >
        {{ saving ? $t("actions.saving") : $t("actions.save") }}
      </button>
      <small
        v-if="isEditing && saveErrorMessage"
        class="table-item__save-error"
        role="alert"
      >
        {{ saveErrorMessage }}
      </small>
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { Category, Product } from "@/api/services/interfaces";
import { computed, ref } from "vue";
import { useField } from "vee-validate";
import { useI18n } from "vue-i18n";
import api from "@/api";
import { ClientAPIError } from "@/api/main";
import { emitter } from "@/utils/emitter";
import { SnackType, type SnackConfig } from "@/components/common/FancySnack.vue";

interface Props {
  product: Product;
  categories: Category[];
  active: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ saved: [product: Product] }>();
const isEditing = ref(false);
const saving = ref(false);
const saveError = ref<unknown>(null);
const { t } = useI18n();
const {
  value: title,
  errorMessage: titleError,
  resetField: resetTitle,
  validate: validateTitle,
} = useField<string>(
  "title",
  (value) => value.trim().length > 0 || t("validation.required"),
  { initialValue: props.product.title },
);
const {
  value: category,
  errorMessage: categoryError,
  resetField: resetCategory,
  validate: validateCategory,
} = useField<string>(
  "category",
  (value) => value.length > 0 || t("validation.required"),
  { initialValue: props.product.category },
);
const {
  value: price,
  errorMessage: priceError,
  resetField: resetPrice,
  validate: validatePrice,
} = useField<number | string>(
  "price",
  (value) =>
    (typeof value === "number" && Number.isFinite(value) && value >= 0) ||
    t("validation.nonnegative"),
  { initialValue: props.product.price },
);
const {
  value: stock,
  errorMessage: stockError,
  resetField: resetStock,
  validate: validateStock,
} = useField<number | string>(
  "stock",
  (value) =>
    (typeof value === "number" && Number.isInteger(value) && value >= 0) ||
    t("validation.wholeNonnegative"),
  { initialValue: props.product.stock },
);

const product = computed(() => {
  return props.product;
});
const saveErrorMessage = computed(() =>
  saveError.value instanceof ClientAPIError
    ? saveError.value.message
    : saveError.value
      ? t("notifications.product.saveError")
      : "",
);

function startEditing() {
  resetDraft();
  saveError.value = null;
  isEditing.value = true;
}

function cancelEditing() {
  resetDraft();
  saveError.value = null;
  isEditing.value = false;
}

async function saveProduct() {
  if (saving.value) return;
  saveError.value = null;
  const results = await Promise.all([
    validateTitle(),
    validateCategory(),
    validatePrice(),
    validateStock(),
  ]);
  if (results.some((result) => !result.valid)) return;

  saving.value = true;
  try {
    const saved = await api.products.updateProduct(props.product.id, {
      title: title.value.trim(),
      category: category.value,
      price: Number(price.value),
      stock: Number(stock.value),
    });
    emit("saved", saved);
    const snackConfig: SnackConfig = {
      text: t("notifications.product.saveSuccess"),
      type: SnackType.success,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snackConfig);
    isEditing.value = false;
  } catch (error) {
    saveError.value = error;
  } finally {
    saving.value = false;
  }
}

function resetDraft() {
  resetTitle({ value: props.product.title });
  resetPrice({ value: props.product.price });
  resetStock({ value: props.product.stock });
  resetCategory({ value: props.product.category });
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.table-item {
  --border-color: transparent;

  display: flex;
  flex-direction: row;
  height: 60px;
  min-height: 60px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-left: 3px solid var(--border-color);
  border-right: 3px solid var(--border-color);
  transition: all 300ms;
  flex-shrink: 0;

  &--editing {
    height: auto;
    padding: 8px 0;
  }

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

  &__stock {
    flex: 1;
    min-width: 80px;
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

  &__error {
    color: var(--red-color);
    font-size: 0.7rem;
  }

  &__save-error {
    color: var(--red-color);
    font-size: 0.7rem;
    text-align: center;
  }
}
</style>
