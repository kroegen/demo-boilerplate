<template>
  <section
    class="products-editor"
    role="region"
    :aria-label="$t('views.products.editorTitle')"
    :aria-busy="saving"
  >
    <h2>{{ product.title }}</h2>
    <form class="products-editor__form" @submit.prevent="saveProduct">
      <FancyInput
        v-model="title"
        :name="`panel-title-${product.id}`"
        :label="$t('labels.title')"
        :error="titleError"
        :disabled="saving"
        full-width
      />
      <FancySelect
        :name="`panel-category-${product.id}`"
        :label="$t('labels.category')"
        :model-value="category"
        :options="categoryOptions"
        :error="categoryError"
        :disabled="saving"
        @update:model-value="setCategory"
      />
      <FancyInput
        :name="`panel-price-${product.id}`"
        :label="$t('labels.price')"
        :model-value="price"
        :error="priceError"
        :disabled="saving"
        type="number"
        :min="0"
        step="0.01"
        full-width
        @update:model-value="setPrice"
      />
      <FancyInput
        :name="`panel-stock-${product.id}`"
        :label="$t('labels.stock')"
        :model-value="stock"
        :error="stockError"
        :disabled="saving"
        type="number"
        :min="0"
        :step="1"
        full-width
        @update:model-value="setStock"
      />
      <small
        v-if="saveErrorMessage"
        class="products-editor__error"
        role="alert"
        >{{ saveErrorMessage }}</small
      >
      <div class="products-editor__actions">
        <FancyButton
          type="button"
          variant="outlined"
          :disabled="saving"
          @click="emit('cancel')"
        >
          {{ $t("actions.cancel") }}
        </FancyButton>
        <FancyButton type="submit" :disabled="saving">
          {{ saving ? $t("actions.saving") : $t("actions.save") }}
        </FancyButton>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useField } from "vee-validate";
import { useI18n } from "vue-i18n";
import api from "@/api";
import { ClientAPIError } from "@/api/main";
import type { Category, Product } from "@/api/services/interfaces";
import FancyInput from "@/components/common/FancyInput.vue";
import FancyButton from "@/components/common/FancyButton.vue";
import FancySelect from "@/components/common/FancySelect.vue";
import type {
  SelectOption,
  SelectValue,
} from "@/components/common/select.types";
import {
  SnackType,
  type SnackConfig,
} from "@/components/common/FancySnack.vue";
import { emitter } from "@/utils/emitter";

const props = defineProps<{
  product: Product;
  categories: Category[];
  locallyCreated: boolean;
}>();
const emit = defineEmits<{
  saved: [product: Product];
  cancel: [];
  dirty: [value: boolean];
}>();
const { t } = useI18n();
const saving = ref(false);
const saveError = ref<unknown>(null);
const saveErrorMessage = computed(() =>
  saveError.value instanceof ClientAPIError
    ? saveError.value.message
    : saveError.value
      ? t("notifications.product.saveError")
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
} = useField<string>(
  "panelTitle",
  (value) => value.trim().length > 0 || t("validation.required"),
  { initialValue: props.product.title },
);
const {
  value: category,
  errorMessage: categoryError,
  validate: validateCategory,
} = useField<string>(
  "panelCategory",
  (value) => value.length > 0 || t("validation.required"),
  { initialValue: props.product.category },
);
const {
  value: price,
  errorMessage: priceError,
  validate: validatePrice,
} = useField<number | string>(
  "panelPrice",
  (value) =>
    (typeof value === "number" && Number.isFinite(value) && value >= 0) ||
    t("validation.nonnegative"),
  { initialValue: props.product.price },
);
const {
  value: stock,
  errorMessage: stockError,
  validate: validateStock,
} = useField<number | string>(
  "panelStock",
  (value) =>
    (typeof value === "number" && Number.isInteger(value) && value >= 0) ||
    t("validation.wholeNonnegative"),
  { initialValue: props.product.stock },
);
const dirty = computed(
  () =>
    title.value !== props.product.title ||
    category.value !== props.product.category ||
    Number(price.value) !== props.product.price ||
    Number(stock.value) !== props.product.stock,
);
watch(dirty, (value) => emit("dirty", value), { immediate: true });

function setCategory(value: SelectValue) {
  category.value = String(value);
}

function setPrice(value: string | number) {
  price.value = value === "" ? "" : Number(value);
}

function setStock(value: string | number) {
  stock.value = value === "" ? "" : Number(value);
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
    const snack: SnackConfig = {
      text: t("notifications.product.saveSuccess"),
      type: SnackType.success,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snack);
  } catch (caught) {
    saveError.value = caught;
    const snack: SnackConfig = {
      text: saveErrorMessage.value,
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
.products-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__error {
    color: var(--red-color);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
