<template>
  <div
    class="table-item"
    :class="{ 'table-item--editing': isEditing }"
    :aria-busy="saving"
  >
    <span v-if="!isEditing" class="table-item__title">
      <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </span>
    <span v-else class="table-item__title">
      <FancyInput
        v-model="title"
        class="table-item__field"
        :error="titleError"
        :name="`edit-title-${product.id}`"
        :aria-label="$t('labels.title')"
        full-width
      />
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
      <FancySelect
        class="table-item__field"
        :name="`edit-category-${product.id}`"
        :label="$t('labels.category')"
        :model-value="category"
        :options="categoryOptions"
        :error="categoryError"
        @update:model-value="setCategory"
      />
    </span>
    <span v-if="!isEditing" class="table-item__price">
      {{ product.price }}
    </span>
    <span v-else class="table-item__price">
      <FancyInput
        :model-value="price"
        class="table-item__field"
        type="number"
        :min="0"
        step="0.01"
        :aria-label="$t('labels.price')"
        :error="priceError"
        :name="`edit-price-${product.id}`"
        full-width
        @update:model-value="setPrice"
      />
    </span>
    <span v-if="!isEditing" class="table-item__stock">{{ product.stock }}</span>
    <span v-else class="table-item__stock">
      <FancyInput
        :model-value="stock"
        class="table-item__field"
        type="number"
        :min="0"
        :step="1"
        :aria-label="$t('labels.stock')"
        :error="stockError"
        :name="`edit-stock-${product.id}`"
        full-width
        @update:model-value="setStock"
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
      <button
        v-if="!isEditing"
        type="button"
        class="table-item__action"
        @click="emit('remove', product.id)"
      >
        {{ $t("actions.delete") }}
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
import FancyInput from "@/components/common/FancyInput.vue";
import FancySelect from "@/components/common/FancySelect.vue";
import type {
  SelectOption,
  SelectValue,
} from "@/components/common/select.types";
import { ClientAPIError } from "@/api/main";
import { emitter } from "@/utils/emitter";
import {
  SnackType,
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

interface Props {
  product: Product;
  categories: Category[];
  active: boolean;
  locallyCreated?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ saved: [product: Product]; remove: [id: number] }>();
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
const categoryOptions = computed<SelectOption[]>(() => [
  { value: "", label: t("placeholders.selectCategory") },
  ...props.categories.map((item) => ({ value: item.slug, label: item.name })),
]);
const saveErrorMessage = computed(() =>
  saveError.value instanceof ClientAPIError
    ? saveError.value.message
    : saveError.value
      ? t("notifications.product.saveError")
      : "",
);

function setPrice(value: string | number) {
  price.value = value === "" ? "" : Number(value);
}

function setCategory(value: SelectValue) {
  category.value = String(value);
}

function setStock(value: string | number) {
  stock.value = value === "" ? "" : Number(value);
}

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
    const payload = {
      title: title.value.trim(),
      category: category.value,
      price: Number(price.value),
      stock: Number(stock.value),
    };
    const saved = props.locallyCreated
      ? { ...props.product, ...payload }
      : await api.products.updateProduct(props.product.id, payload);
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
    const snackConfig: SnackConfig = {
      text: saveErrorMessage.value,
      type: SnackType.warning,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snackConfig);
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
