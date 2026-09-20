<template>
  <f-view>
    <div
      class="products-workspace"
      :class="{ 'products-workspace--editing': selectedProduct }"
    >
      <div class="products-workspace__list">
        <div class="products-toolbar">
          <FancySelect
            name="products-category"
            :label="$t('labels.category')"
            :model-value="category"
            :options="categoryOptions"
            :disabled="loading"
            @update:model-value="handleCategorySelect"
          />
          <FancySelect
            name="products-sort"
            :label="$t('labels.sortBy')"
            :model-value="sortBy"
            :options="sortOptions"
            :disabled="loading"
            @update:model-value="handleSortSelect"
          />
          <FancySelect
            name="products-order"
            :label="$t('labels.sortDirection')"
            :model-value="order"
            :options="orderOptions"
            :disabled="loading || !sortBy"
            @update:model-value="handleOrderSelect"
          />
          <FancyButton
            type="button"
            :disabled="loading || !categories.length"
            @click="createOpened = true"
          >
            {{ $t("actions.createProduct") }}
          </FancyButton>
        </div>
        <products-table :aria-busy="loading">
          <div v-if="loading" class="products-state" role="status">
            <Loader />
            <span>{{ $t("views.products.loading") }}</span>
          </div>
          <div v-else-if="listError" class="products-state" role="alert">
            <span>{{ listErrorMessage }}</span>
            <FancyButton type="button" variant="outlined" @click="loadProducts">
              {{ $t("actions.retry") }}
            </FancyButton>
          </div>
          <div
            v-else-if="products.length === 0"
            class="products-state"
            role="status"
          >
            <span>{{ $t("views.products.empty") }}</span>
            <FancyButton
              v-if="category"
              type="button"
              variant="outlined"
              @click="clearCategory"
            >
              {{ $t("actions.clearFilter") }}
            </FancyButton>
          </div>
          <transition-group name="list" v-else>
            <ProductsTableItem
              v-for="product in products"
              :key="product.id"
              :product="product"
              :categories="categories"
              :locally-created="
                adminProducts.created.some((item) => item.id === product.id)
              "
              :active="selectedProduct?.id === product.id"
              @saved="handleSavedProduct"
              @remove="handleConfirmRemove"
            />
          </transition-group>
        </products-table>
        <FancyPagination
          v-if="pages > 1 && !loading && !listError"
          :pages="pages"
          :current-page="page"
          @select="handlePageChange"
        />
      </div>
      <aside v-if="selectedProduct" class="products-workspace__editor">
        <h2>{{ selectedProduct.title }}</h2>
      </aside>
    </div>
    <teleport to="body">
      <ProductsCreateModal
        :opened="createOpened"
        :categories="categories"
        @close="createOpened = false"
        @created="handleCreatedProduct"
      />
      <ConfirmModal
        :opened="removeId !== null"
        :busy="deleting"
        :title="$t('modals.productDelete.title')"
        :message="$t('modals.productDelete.message')"
        @close="handleCancelRemove"
        @confirm="handleRemoveProduct"
      />
    </teleport>
  </f-view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from "vue";
import Loader from "@/components/common/SpinnerLoader.vue";
import api from "@/api";
import { ClientAPIError } from "@/api/main";
import ProductsTable from "./ProductsView/ProductsTable.vue";
import ProductsTableItem from "./ProductsView/ProductsTableItem.vue";
import ProductsCreateModal from "./ProductsView/ProductsCreateModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import FancyPagination from "@/components/common/FancyPagination.vue";
import FancySelect from "@/components/common/FancySelect.vue";
import FancyButton from "@/components/common/FancyButton.vue";
import type {
  SelectOption,
  SelectValue,
} from "@/components/common/select.types";
import type { Category, Product } from "@/api/services/interfaces";
import { useAdminProductsStore } from "@/stores/adminProducts";
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/emitter";
import {
  SnackType,
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

const loading = ref(true);
const listError = ref<unknown>(null);
const products: Ref<Product[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const selectedProduct = ref<Product | null>(null);
const createOpened = ref(false);
const adminProducts = useAdminProductsStore();
const page = ref(1);
const total = ref(0);
const limit = 25;
const sortBy = ref("");
const order = ref<"asc" | "desc">("asc");
const category = ref("");
const pages = computed(() => Math.ceil(total.value / limit));
const removeId = ref<number | null>(null);
const deleting = ref(false);
const { t } = useI18n();
const categoryOptions = computed<SelectOption[]>(() => [
  { value: "", label: t("labels.allCategories") },
  ...categories.value.map((item) => ({ value: item.slug, label: item.name })),
]);
const sortOptions = computed<SelectOption[]>(() => [
  { value: "", label: t("labels.defaultOrder") },
  { value: "title", label: t("labels.title") },
  { value: "price", label: t("labels.price") },
  { value: "stock", label: t("labels.stock") },
]);
const orderOptions = computed<SelectOption[]>(() => [
  { value: "asc", label: t("labels.ascending") },
  { value: "desc", label: t("labels.descending") },
]);
const listErrorMessage = computed(() =>
  listError.value instanceof ClientAPIError
    ? listError.value.message
    : t("views.products.error"),
);
let latestRequest = 0;

onMounted(async () => {
  await loadProducts();
});

async function loadProducts() {
  const request = ++latestRequest;
  loading.value = true;
  listError.value = null;

  try {
    const data = await api.products.fetchProducts(page.value, limit, {
      category: category.value || undefined,
      sortBy: sortBy.value || undefined,
      order: order.value,
    });

    if (request !== latestRequest) return;
    if (data.products) {
      products.value = adminProducts.mergePage(
        data.products,
        page.value,
        category.value,
      );
      total.value =
        data.total +
        adminProducts.created.filter(
          (product) => !category.value || product.category === category.value,
        ).length;
    }
    if (!categories.value.length) {
      const response = await api.products.fetchProductsCategories();
      if (request === latestRequest) categories.value = response;
    }
  } catch (error) {
    if (request === latestRequest) listError.value = error;
  } finally {
    if (request === latestRequest) loading.value = false;
  }
}

async function handlePageChange(selectedPage: number) {
  if (selectedPage === page.value) return;
  page.value = selectedPage;
  await loadProducts();
}

async function handleSortChange() {
  page.value = 1;
  await loadProducts();
}

async function handleCategorySelect(value: SelectValue) {
  category.value = String(value);
  page.value = 1;
  await loadProducts();
}

async function handleSortSelect(value: SelectValue) {
  sortBy.value = String(value);
  await handleSortChange();
}

async function handleOrderSelect(value: SelectValue) {
  order.value = value === "desc" ? "desc" : "asc";
  await handleSortChange();
}

async function clearCategory() {
  category.value = "";
  page.value = 1;
  await loadProducts();
}

function handleSavedProduct(saved: Product) {
  adminProducts.saveEdited(saved);
  products.value = products.value.map((product) =>
    product.id === saved.id ? { ...product, ...saved } : product,
  );
}

function handleCreatedProduct(product: Product) {
  const created = adminProducts.addCreated(product);
  if (!category.value || category.value === created.category) {
    total.value += 1;
    if (page.value === 1) products.value = [created, ...products.value];
  }
}

function handleConfirmRemove(id: number) {
  removeId.value = id;
}

function handleCancelRemove() {
  if (!deleting.value) removeId.value = null;
}

async function handleRemoveProduct() {
  const id = removeId.value;
  if (id === null || deleting.value) return;
  deleting.value = true;
  try {
    if (!adminProducts.created.some((product) => product.id === id)) {
      await api.products.deleteProduct(id);
    }
    adminProducts.removeProduct(id);
    products.value = products.value.filter((product) => product.id !== id);
    const snack: SnackConfig = {
      text: t("notifications.product.deleteSuccess"),
      type: SnackType.success,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snack);
    removeId.value = null;
  } catch (error) {
    const snack: SnackConfig = {
      text:
        error instanceof Error
          ? error.message
          : t("notifications.product.deleteError"),
      type: SnackType.warning,
      icon: true,
      closable: true,
    };
    emitter.emit("showSnack", snack);
  } finally {
    deleting.value = false;
  }
}
</script>

<style scoped>
.products-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  height: 100%;
  min-width: 0;

  &--editing {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
  }

  &__list {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  &__editor {
    min-width: 0;
    overflow-y: auto;
    border-left: 1px solid var(--beige-color);
    padding: 24px;
  }
}

.products-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;

  :deep(.f-select) {
    max-width: 200px;
  }
}

.products-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
}
</style>
