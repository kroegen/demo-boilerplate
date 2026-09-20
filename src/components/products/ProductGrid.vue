<template>
  <transition-group name="list" tag="ul" class="product-grid">
    <ProductCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :transferData="(({ ...product, index }) as unknown as DataTransfer)"
    />
  </transition-group>
</template>

<script setup lang="ts">
import type { Product } from "@/api/services/interfaces";
import ProductCard from "./ProductCard.vue";

defineProps<{ products: Product[] }>();
</script>

<style lang="scss" scoped>
.product-grid {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  padding-top: 50px;
}
</style>
