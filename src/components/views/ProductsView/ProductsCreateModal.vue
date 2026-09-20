<template>
  <f-modal :opened="opened" close-by-click-outside @close="$emit('close')">
    <template #header
      ><h2>{{ $t("actions.createProduct") }}</h2></template
    >
    <form class="create-product" @submit.prevent="createProduct">
      <FancyInput
        v-model="title"
        name="create-title"
        :label="$t('labels.title')"
        :error="titleError"
        full-width
      />
      <FancySelect
        name="create-category"
        :label="$t('labels.category')"
        :model-value="category"
        :options="categoryOptions"
        :error="categoryError"
        @update:model-value="setCategory"
      />
      <FancyInput
        :model-value="price"
        name="create-price"
        type="number"
        :label="$t('labels.price')"
        :error="priceError"
        :min="0"
        step="0.01"
        full-width
        @update:model-value="setPrice"
      />
      <FancyInput
        :model-value="stock"
        name="create-stock"
        type="number"
        :label="$t('labels.stock')"
        :error="stockError"
        :min="0"
        :step="1"
        full-width
        @update:model-value="setStock"
      />
      <small v-if="errorMessage" role="alert">{{ errorMessage }}</small>
      <div class="create-product__actions">
        <button type="button" :disabled="saving" @click="$emit('close')">
          {{ $t("actions.cancel") }}
        </button>
        <button type="submit" :disabled="saving">
          {{ saving ? $t("actions.saving") : $t("actions.createProduct") }}
        </button>
      </div>
    </form>
  </f-modal>
</template>

<script setup lang="ts">
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
import type { Category, Product } from "@/api/services/interfaces";
import { emitter } from "@/utils/emitter";
import {
  SnackType,
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

const props = defineProps<{ opened: boolean; categories: Category[] }>();
const emit = defineEmits<{ close: []; created: [product: Product] }>();
const { t } = useI18n();
const saving = ref(false);
const error = ref<unknown>(null);
const errorMessage = computed(() =>
  error.value instanceof ClientAPIError
    ? error.value.message
    : error.value
      ? t("notifications.product.createError")
      : "",
);
const categoryOptions = computed<SelectOption[]>(() => [
  { value: "", label: t("placeholders.selectCategory") },
  ...props.categories.map((item) => ({ value: item.slug, label: item.name })),
]);
const {
  value: title,
  errorMessage: titleError,
  validate: validateTitle,
  resetField: resetTitle,
} = useField<string>(
  "createTitle",
  (value) => value.trim().length > 0 || t("validation.required"),
  { initialValue: "" },
);
const {
  value: category,
  errorMessage: categoryError,
  validate: validateCategory,
  resetField: resetCategory,
} = useField<string>(
  "createCategory",
  (value) => value.length > 0 || t("validation.required"),
  { initialValue: "" },
);
const {
  value: price,
  errorMessage: priceError,
  validate: validatePrice,
  resetField: resetPrice,
} = useField<number | string>(
  "createPrice",
  (value) =>
    (typeof value === "number" && Number.isFinite(value) && value >= 0) ||
    t("validation.nonnegative"),
  { initialValue: 0 },
);
const {
  value: stock,
  errorMessage: stockError,
  validate: validateStock,
  resetField: resetStock,
} = useField<number | string>(
  "createStock",
  (value) =>
    (typeof value === "number" && Number.isInteger(value) && value >= 0) ||
    t("validation.wholeNonnegative"),
  { initialValue: 0 },
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

async function createProduct() {
  if (saving.value) return;
  error.value = null;
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
    const response = await api.products.createProduct(payload);
    const product: Product = {
      brand: "",
      description: "",
      discountPercentage: 0,
      images: [],
      rating: 0,
      thumbnail: new URL("about:blank"),
      ...payload,
      ...response,
    };
    emit("created", product);
    const snack: SnackConfig = {
      text: t("notifications.product.createSuccess"),
      type: SnackType.success,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snack);
    resetTitle({ value: "" });
    resetCategory({ value: "" });
    resetPrice({ value: 0 });
    resetStock({ value: 0 });
    emit("close");
  } catch (caught) {
    error.value = caught;
    const snack: SnackConfig = {
      text: errorMessage.value,
      type: SnackType.warning,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snack);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.create-product {
  display: grid;
  gap: 12px;
  padding: 0 40px 30px;

  small {
    color: var(--red-color);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
