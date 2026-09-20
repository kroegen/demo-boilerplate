<template>
  <f-view>
    <div class="products-toolbar">
      <label>
        {{ $t("labels.category") }}
        <select v-model="category" @change="handleCategoryChange">
          <option value="">{{ $t("labels.allCategories") }}</option>
          <option
            v-for="item in categories"
            :key="item.slug"
            :value="item.slug"
          >
            {{ item.name }}
          </option>
        </select>
      </label>
      <label>
        {{ $t("labels.sortBy") }}
        <select v-model="sortBy" @change="handleSortChange">
          <option value="">{{ $t("labels.defaultOrder") }}</option>
          <option value="title">{{ $t("labels.title") }}</option>
          <option value="price">{{ $t("labels.price") }}</option>
          <option value="stock">{{ $t("labels.stock") }}</option>
        </select>
      </label>
      <label>
        {{ $t("labels.sortDirection") }}
        <select v-model="order" :disabled="!sortBy" @change="handleSortChange">
          <option value="asc">{{ $t("labels.ascending") }}</option>
          <option value="desc">{{ $t("labels.descending") }}</option>
        </select>
      </label>
      <button
        type="button"
        :disabled="!categories.length"
        @click="createOpened = true"
      >
        {{ $t("actions.createProduct") }}
      </button>
    </div>
    <products-table>
      <Loader v-if="loading" />
      <transition-group name="list" v-else>
        <ProductsTableItem
          v-for="product in products"
          :key="product.id"
          :product="product"
          :categories="categories"
          :active="currentTableItem === product.id"
          @saved="handleSavedProduct"
          @remove="handleConfirmRemove"
        />
      </transition-group>
    </products-table>
    <FancyPagination
      v-if="pages > 1"
      :pages="pages"
      :current-page="page"
      @select="handlePageChange"
    />
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
import ProductsTable from "./ProductsView/ProductsTable.vue";
import ProductsTableItem from "./ProductsView/ProductsTableItem.vue";
import ProductsCreateModal from "./ProductsView/ProductsCreateModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import FancyPagination from "@/components/common/FancyPagination.vue";
import type { Category, Product } from "@/api/services/interfaces";
import { useAdminProductsStore } from "@/stores/adminProducts";
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/emitter";
import {
  SnackType,
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

const loading = ref(true);
const products: Ref<Product[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const currentTableItem = ref(0);
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

onMounted(async () => {
  await loadProducts();
});

async function loadProducts() {
  loading.value = true;

  try {
    const data = await api.products.fetchProducts(page.value, limit, {
      category: category.value || undefined,
      sortBy: sortBy.value || undefined,
      order: order.value,
    });

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
      categories.value = await api.products.fetchProductsCategories();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
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

async function handleCategoryChange() {
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
.products-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
}
</style>
