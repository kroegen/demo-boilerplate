<template>
  <f-modal class="confirm-modal" @close="$emit('close')" close-by-click-outside>
    <template #header>
      <h4>{{ $t("modals.confirm.action") }}</h4>
    </template>
    <div class="confirm-modal__content">
      {{ $t("modals.confirm.text") }}
    </div>
    <template #actions-right>
      <f-button variant="outlined" @click="$emit('close')">
        {{ $t("actions.decline") }}
      </f-button>
      <f-button primary style="margin-left: 20px" @click="$emit('confirm')">
        {{ $t("actions.confirm") }}
      </f-button>
    </template>
  </f-modal>
</template>

<script lang="ts" setup>
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
