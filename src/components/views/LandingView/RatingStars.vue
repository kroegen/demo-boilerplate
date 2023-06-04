<template>
  <div class="rating-stars">
    <svg-icon
      v-for="(star, index) in starsArray"
      :src="icons[star.type]"
      :key="index"
      class="rating-stars__star"
      :class="getClassName(star.type)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue";

import SvgIcon from "@/components/common/SvgIcon.vue";

import FullStar from "@/assets/icons/star-fill.svg";
import HalfStar from "@/assets/icons/star-half-line.svg";
import EmptyStar from "@/assets/icons/star-line.svg";

const icons = {
  full: FullStar,
  empty: EmptyStar,
  half: HalfStar,
};

enum StarType {
  Full = "full",
  Empty = "empty",
  Half = "half",
}

interface Star {
  type: StarType;
}

const props = defineProps<{
  rating: number;
}>();

const starsArray: ComputedRef<Star[]> = computed(() => {
  const stars: Star[] = [];
  const fullStar = { type: StarType.Full };
  const halfStar = { type: StarType.Half };
  const emptyStar = { type: StarType.Empty };
  const fullStars = Math.floor(props.rating);
  const emptyStars = Math.floor(5 - props.rating);
  const half = +(props.rating % 1).toFixed(1);

  for (let i = 1; i <= fullStars; i++) {
    stars.push(fullStar);
  }

  if (half >= 0.5) {
    stars.push(halfStar);
  } else if (half !== 0) {
    stars.push(emptyStar);
  }

  for (let i = 1; i <= emptyStars; i++) {
    stars.push(emptyStar);
  }

  return stars;
});

function getClassName(type: StarType) {
  const classes = {
    full: "rating-stars__full-star",
    empty: "rating-stars__empty-star",
    half: "rating-stars__half-star",
  };

  return classes[type];
}
</script>

<style scoped lang="scss">
.rating-stars {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --icon-color: var(--blue-color);

  &__star {
    height: 18px;
    width: 18px;
    flex-shrink: 0;
  }
}
</style>
