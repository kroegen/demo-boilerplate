<template>
  <div class="favorite" :class="{ 'favorite--selected': isSelected }">
    <svg-icon
      class="favorite__fill-icon"
      :src="icons.filled"
      @click="toggleSelection"
    />
    <svg-icon class="favorite__empty-icon" :src="icons.empty" />
    <svg-icon
      class="favorite__add-icon"
      :src="icons.add"
      @click="toggleSelection"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SvgIcon from "@/components/common/SvgIcon.vue";

import FilledIcon from "@/assets/icons/heart-fill.svg";
import EmptyIcon from "@/assets/icons/heart-line.svg";
import AddIcon from "@/assets/icons/heart-add.svg";

import { FavoritesStore } from "@/stores/favorites";

const icons = {
  filled: FilledIcon,
  empty: EmptyIcon,
  add: AddIcon,
};

const props = defineProps<{
  productId: number;
}>();
const store = FavoritesStore();

const isSelected = computed(() => {
  return store.getFavoritesIds.includes(props.productId);
});

function toggleSelection() {
  if (!isSelected.value) {
    store.addProductIdToFavoritesIds(props.productId);
  } else {
    store.removeProductIdFromFavoritesIds(props.productId);
  }
}
</script>

<style scoped lang="scss">
.favorite {
  $this: &;
  --icon-color: var(--blue-color);

  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: 36px;
  height: 36px;

  &__empty-icon,
  &__add-icon,
  &__fill-icon {
    transition: all 400ms;
  }

  &__add-icon,
  &__fill-icon {
    visibility: hidden;
    display: none;
    opacity: 0;
  }

  &__empty-icon {
    visibility: visible;
    display: inline-flex;
    opacity: 1;
  }

  &:hover {
    cursor: pointer;

    #{$this}__empty-icon {
      visibility: hidden;
      display: none;
      opacity: 0;
    }

    #{$this}__add-icon {
      visibility: visible;
      display: inline-flex;
      opacity: 1;
    }
  }

  &:active {
    transform: scale(1.1);
  }

  &--selected {
    #{$this}__empty-icon {
      visibility: hidden;
      display: none;
      opacity: 0;
    }

    #{$this}__add-icon {
      visibility: hidden;
      display: none;
      opacity: 0;
    }

    #{$this}__fill-icon {
      visibility: visible;
      display: inline-flex;
      opacity: 1;
    }
  }

  &--selected:hover {
    #{$this}__add-icon {
      visibility: hidden;
      display: none;
      opacity: 0;
    }
  }
}
</style>
