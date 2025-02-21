<template>
  <f-view>
    <!-- <FancyButton size="large" variant="text" disabled>Test</FancyButton> -->
    <users-table>
      <Loader v-if="loading" />
      <transition-group name="list" v-else>
        <UsersTableItem
          v-for="user in users.filter((user) => !user.isDeleted)"
          :key="user.id"
          :user="user"
          :active="currentUser === user.id"
          @remove="handleConfirmRemoveUser"
        />
      </transition-group>
    </users-table>
    <teleport to="body">
      <ConfirmModal
        :opened="openedModal"
        @close="handleDeclineRemove"
        @confirm="handleRemoveUser"
      />
    </teleport>
  </f-view>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import { usersStore } from "@/stores/users";
import type { User } from "@/api/services/interfaces";

import Loader from "@/components/common/SpinnerLoader.vue";
import UsersTableItem from "@/components/views/UsersView/UsersTableItem.vue";
import UsersTable from "./UsersView/UsersTable.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { SnackType, type SnackConfig } from "../common/FancySnack.vue";
import { emitter } from "@/utils/emitter";
import { useI18n } from "vue-i18n";

const loading = ref(true);
const store = usersStore();
const users: Ref<User[]> = ref([]);
const currentUser = ref(0);
const openedModal = ref(false);
const { t } = useI18n();

onMounted(async () => {
  loading.value = true;

  try {
    const data = await store.fetchUsers();

    if (data) {
      users.value = [...data];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

async function handleRemoveUser() {
  try {
    await store.removeUser(currentUser.value);

    handleDeclineRemove();
    handleShowSuccessMessage();
  } catch (error) {
    console.error(error);
    handleDeclineRemove();
    handleShowErrorMessage();
  }
}

function handleConfirmRemoveUser(userId: number) {
  currentUser.value = userId;
  openedModal.value = true;
}

function handleDeclineRemove() {
  currentUser.value = 0;
  openedModal.value = false;
}

function handleShowErrorMessage() {
  const message = t("notifications.user.errorRemove");
  const snackConfig: SnackConfig = {
    text: message,
    type: SnackType.warning,
    icon: true,
    closable: true,
  };

  emitter.emit("showSnack", snackConfig);
}

function handleShowSuccessMessage() {
  const message = t("notifications.user.successRemove");
  const snackConfig: SnackConfig = {
    text: message,
    type: SnackType.success,
    icon: true,
    closable: true,
  };

  emitter.emit("showSnack", snackConfig);
}
</script>
