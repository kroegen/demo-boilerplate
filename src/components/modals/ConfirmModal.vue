<template>
  <f-modal class="confirm-modal" @close="$emit('close')" close-by-click-outside>
    <template #header>
      <h4>{{ title || $t("modals.confirm.action") }}</h4>
    </template>
    <div class="confirm-modal__content">
      {{ message || $t("modals.confirm.text") }}
    </div>
    <template #actions-right>
      <f-button variant="outlined" :disabled="busy" @click="$emit('close')">
        {{ $t("actions.decline") }}
      </f-button>
      <f-button
        primary
        style="margin-left: 20px"
        :disabled="busy"
        @click="$emit('confirm')"
      >
        {{ $t("actions.confirm") }}
      </f-button>
    </template>
  </f-modal>
</template>

<script lang="ts" setup>
defineProps<{ title?: string; message?: string; busy?: boolean }>();
defineEmits(["close", "confirm"]);
</script>

<style lang="scss" scoped>
.info-modal {
  &__content {
    justify-content: center;
    display: flex;
    flex-direction: column;
  }
}
</style>
