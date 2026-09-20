<template>
  <f-view>
    <section class="product-detail">
      <router-link :to="{ name: 'products' }">{{
        $t("actions.backToProducts")
      }}</router-link>
      <div v-if="loading" role="status">{{ $t("views.products.loading") }}</div>
      <div v-else-if="error" role="alert">
        {{ errorMessage }}
        <FancyButton type="button" variant="outlined" @click="loadProduct">
          {{ $t("actions.retry") }}
        </FancyButton>
      </div>
      <div v-else-if="!product" role="status">
        {{ $t("views.products.notFound") }}
      </div>
      <article v-else>
        <h1>{{ product.title }}</h1>
        <img
          v-if="String(product.thumbnail) !== 'about:blank'"
          :src="String(product.thumbnail)"
          :alt="product.title"
        />
        <dl>
          <dt>{{ $t("labels.category") }}</dt>
          <dd>{{ product.category }}</dd>
          <dt>{{ $t("labels.price") }}</dt>
          <dd>{{ product.price }}</dd>
          <dt>{{ $t("labels.stock") }}</dt>
          <dd>{{ product.stock }}</dd>
          <dt>{{ $t("labels.brand") }}</dt>
          <dd>{{ product.brand }}</dd>
          <dt>{{ $t("labels.description") }}</dt>
          <dd>{{ product.description }}</dd>
        </dl>
      </article>
    </section>
  </f-view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import api from "@/api";
import FancyButton from "@/components/common/FancyButton.vue";
import { ClientAPIError } from "@/api/main";
import type { Product } from "@/api/services/interfaces";
import { useAdminProductsStore } from "@/stores/adminProducts";

const route = useRoute();
const adminProducts = useAdminProductsStore();
const { t } = useI18n();
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<unknown>(null);
const errorMessage = computed(() =>
  error.value instanceof ClientAPIError
    ? error.value.message
    : t("views.products.detailError"),
);
let latestRequest = 0;

watch(() => route.params.id, loadProduct, { immediate: true });

async function loadProduct() {
  const request = ++latestRequest;
  const id = Number(route.params.id);
  product.value = null;
  error.value = null;
  loading.value = true;
  try {
    if (
      !Number.isSafeInteger(id) ||
      id === 0 ||
      adminProducts.deletedIds.includes(id)
    )
      return;
    const local = adminProducts.created.find((item) => item.id === id);
    if (local) {
      product.value = local;
      return;
    }
    const response = await api.products.fetchProductById(String(id));
    if (request === latestRequest)
      product.value = adminProducts.edited[id] ?? response;
  } catch (caught) {
    if (request === latestRequest) {
      if (caught instanceof ClientAPIError && caught.status === 404) return;
      error.value = caught;
    }
  } finally {
    if (request === latestRequest) loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.product-detail {
  padding: 30px;

  img {
    max-width: 240px;
    max-height: 240px;
    object-fit: contain;
  }

  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 10px 20px;
  }

  dt {
    font-weight: 600;
  }
}
</style>
