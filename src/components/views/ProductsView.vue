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
import type { Category, Product } from "@/api/services/interfaces";
import { useAdminProductsStore } from "@/stores/adminProducts";

const loading = ref(true);
const products: Ref<Product[]> = ref([]);
const categories: Ref<Category[]> = ref([]);
const currentTableItem = ref(0);
const createOpened = ref(false);
const adminProducts = useAdminProductsStore();

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
</script>

<style scoped>
.products-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
}
</style>
