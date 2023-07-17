<template>
  <div :class="{ 'select-locale': true, inverted }">
    <f-button
      size="tiny"
      :variant="locale === 'en' ? 'filled' : 'text'"
      @click="locale = 'en'"
    >
      EN
    </f-button>
    <f-button
      size="tiny"
      :variant="locale === 'ua' ? 'filled' : 'text'"
      @click="locale = 'ua'"
    >
      UA
    </f-button>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

interface Props {
  inverted?: boolean;
}

withDefaults(defineProps<Props>(), {
  inverted: () => false,
});

const { locale } = useI18n({ useScope: "global" });
</script>

<style lang="scss" scoped>
.select-locale {
  &.inverted {
    :deep(.f-button--text) {
      --text-color: var(--blue-color);

      &:hover {
        --text-color: var(--white-color);
      }
    }
  }
}
</style>
