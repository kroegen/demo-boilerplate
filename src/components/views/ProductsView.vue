<template>
  <f-view>
    <products-table>
      <Loader v-if="loading" />
      <transition-group name="list" tag="div" v-else>
        <ProductsTableItem
          v-for="product in products"
          :key="product.id"
          :product="product"
          :active="currentTableItem === product.id"
        />
      </transition-group>
    </products-table>
  </f-view>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import Loader from "@/components/common/SpinnerLoader.vue";
import api from "@/api";
import ProductsTable from "./ProductsView/ProductsTable.vue";
import ProductsTableItem from "./ProductsView/ProductsTableItem.vue";
import type { Product } from "@/api/services/interfaces";

const loading = ref(true);
const products: Ref<Product[]> = ref([]);
const currentTableItem = ref(0);

onMounted(async () => {
  loading.value = true;

  try {
    const data = await api.products.fetchProducts();

    if (data.products) {
      products.value = [...data.products];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
