<template>
  <f-modal class="info-modal" @close="$emit('close')" close-by-click-outside>
    <template #header>
      <h4>{{ $t("views.login.modal.title") }}</h4>
    </template>
    <div class="info-modal__content">
      <p>
        <span>{{ $t("views.login.modal.link") }} </span>
        <a :href="USERS_URL"> link</a>.<br />
        <span>{{ $t("views.login.modal.please") }}</span>
      </p>
      <ul class="info-modal__list">
        <li class="info-modal__list-item">
          <label>{{ $t("labels.username") }}: </label>
          <span>{{ userName }}</span>
          <f-button
            size="tiny"
            variant="outlined"
            :disabled="!userName"
            @click="handleCopyValue(userName)"
          >
            {{ $t("actions.copy") }}
          </f-button>
        </li>
        <li class="info-modal__list-item">
          <label>{{ $t("labels.password") }}: </label>
          <span>{{ password }}</span>
          <f-button
            size="tiny"
            variant="outlined"
            :disabled="!password"
            @click="handleCopyValue(password)"
          >
            {{ $t("actions.copy") }}
          </f-button>
        </li>
      </ul>
      <span class="info-modal__find-button">
        <f-button size="tiny" variant="outlined" @click="handleFindCreds">
          {{ $t("actions.findRandom") }}
        </f-button>
      </span>
    </div>
    <template #actions-right>
      <f-button primary @click="$emit('close')">
        {{ $t("actions.close") }}
      </f-button>
    </template>
  </f-modal>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { usersStore } from "@/stores/users";
import type { UserCreds } from "@/api/services/interfaces";
import { unsecuredCopyToClipboard } from "@/utils/helpers";

const USERS_URL = "https://dummyjson.com/users";
const emit = defineEmits(["close", "copy"]);

const initialState: UserCreds = { username: "", password: "" };
const users = usersStore();
const credentials: UserCreds = reactive(initialState);
const password = computed(() => credentials.password);
const userName = computed(() => credentials.username);

onMounted(async () => {
  await users.fetchUsers();
});

function handleFindCreds() {
  const newCredentials = users.fetchRandomUserCreds();

  credentials.username = newCredentials.username;
  credentials.password = newCredentials.password;
}

function handleCopyValue(target: string) {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(target);
  } else {
    unsecuredCopyToClipboard(target);
  }

  emit("copy");
}
</script>

<style lang="scss" scoped>
.info-modal {
  &__content {
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  &__list {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0 40px;
  }

  &__list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__find-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
