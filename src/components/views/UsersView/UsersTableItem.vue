<template>
  <div class="table-item">
    <span class="table-item__image">
      <img :src="user.image.toString()" alt="avatar" />
    </span>
    <span class="table-item__name">
      {{ userName }}
    </span>
    <span class="table-item__email">
      {{ user.email }}
    </span>
    <span class="table-item__phone">
      {{ user.phone }}
    </span>
    <span class="table-item__birthdate">
      {{ user.birthDate }}
    </span>
    <div class="table-item__actions">
      <svg-icon class="table-item__action-icon" :src="EditIcon" disabled />
      <svg-icon
        class="table-item__action-icon"
        :src="DeleteIcon"
        @click="handleRemoveUser"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from "@/api/services/interfaces";
import SvgIcon from "@/components/common/SvgIcon.vue";
import EditIcon from "@/assets/icons/pencil-line.svg";
import DeleteIcon from "@/assets/icons/delete-bin-line.svg";

import { computed } from "vue";

const emit = defineEmits(["remove"]);

const props = defineProps<{
  user: User;
  active: Boolean;
}>();
const user = computed(() => {
  return props.user;
});
const userName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`;
});

function handleRemoveUser() {
  emit("remove", user.value.id);
}
</script>

<style lang="scss" scoped>
.table-item {
  --border-color: transparent;

  display: flex;
  flex-direction: row;
  height: 60px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-left: 3px solid var(--border-color);
  border-right: 3px solid var(--border-color);
  transition: all 300ms;
  flex-shrink: 0;

  &:hover {
    --border-color: var(--blue-color);
    cursor: pointer;
    background: var(--beige-color);
  }

  & > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 5px;
    font-size: 0.75rem;
    height: 100%;
  }

  &__image {
    flex: 1;

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  &__name {
    flex: 3;
  }

  &__email {
    flex: 2;
  }

  &__phone {
    flex: 2;
  }

  &__birthdate {
    flex: 2;
  }

  &__actions {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  &__action-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    --icon-color: var(--black-color);

    :hover {
      --icon-color: var(--blue-color);
    }

    &:active {
      transform: scale(1.1);
    }
  }
}
</style>
