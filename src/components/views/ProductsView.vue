<template>
  <f-view>
    <div class="products-toolbar">
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
import { onMounted, ref, type Ref } from "vue";
import Loader from "@/components/common/SpinnerLoader.vue";
import api from "@/api";
import ProductsTable from "./ProductsView/ProductsTable.vue";
import ProductsTableItem from "./ProductsView/ProductsTableItem.vue";
import ProductsCreateModal from "./ProductsView/ProductsCreateModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
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
const removeId = ref<number | null>(null);
const deleting = ref(false);
const { t } = useI18n();

onMounted(async () => {
  loading.value = true;

  try {
    const data = await api.products.fetchProducts(1, 100);

    if (data.products) {
      products.value = [...data.products];
    }
    categories.value = await api.products.fetchProductsCategories();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

function handleSavedProduct(saved: Product) {
  adminProducts.saveEdited(saved);
  products.value = products.value.map((product) =>
    product.id === saved.id ? { ...product, ...saved } : product,
  );
}

function handleCreatedProduct(product: Product) {
  products.value = [adminProducts.addCreated(product), ...products.value];
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
  padding: 12px 20px;
}
</style>
