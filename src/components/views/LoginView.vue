<template>
  <f-view class="login-view">
    <div class="login-view__container">
      <f-card class="login-view__card">
        <svg-icon
          class="login-view__info-icon"
          :class="{ blink: isBlinking }"
          @click="handleOpenInfoModal"
          :src="icons.InfoIcon"
        />
        <f-form class="login-view__form" ref="form" @submit="handleSubmit">
          <field
            name="username"
            :rules="{ required: true }"
            v-model="form.username"
            v-slot="{ errors, field }"
          >
            <f-input
              type="text"
              v-bind="field"
              v-model="form.username"
              :label="$t('labels.username')"
              name="username"
              :placeholder="$t('placeholders.username')"
              :error="errors[0] || error"
              full-width
              clearable
              size="large"
            >
              <template #before>
                <svg-icon :src="icons.UserIcon" />
              </template>
            </f-input>
          </field>
          <field
            name="password"
            :rules="{ required: true }"
            v-model="form.password"
            v-slot="{ errors, field }"
          >
            <f-input
              type="password"
              v-bind="field"
              v-model="form.password"
              :label="$t('labels.password')"
              name="password"
              :placeholder="$t('placeholders.password')"
              :error="errors[0] || error"
              full-width
              clearable
              size="large"
            >
              <template #before>
                <svg-icon :src="icons.KeyIcon" />
              </template>
            </f-input>
          </field>
          <div class="login-view__actions">
            <f-button
              size="large"
              variant="outlined"
              style="margin-right: 20px"
              @click="handleSkip"
              disabled
            >
              {{ $t("actions.skip") }}
            </f-button>
            <f-button size="large">
              {{ $t("actions.login") }}
            </f-button>
          </div>
        </f-form>
      </f-card>
    </div>
    <teleport to="body">
      <InfoDialog
        :opened="openedDialog"
        :closable="true"
        @change="handleCloseDialog"
      />
      <InfoModal
        v-show="openedModal"
        @close="openedModal = false"
        @copy="handleShowInfoMessage"
      />
    </teleport>
  </f-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "pinia";

import { Field, Form as FForm } from "vee-validate";

import FancyInput from "@/components/common/FancyInput.vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import InfoModal from "@/components/modals/InfoModal.vue";

import { authStore } from "@/stores/auth";
import type { AuthPayload, CustomError } from "@/api/services/interfaces";

import InfoIcon from "@/assets/icons/info-fill.svg";
import UserIcon from "@/assets/icons/user-fill.svg";
import KeyIcon from "@/assets/icons/key-fill.svg";
import { emitter } from "@/utils/emitter";
import { type SnackConfig, SnackType } from "../common/FancySnack.vue";

export default defineComponent({
  components: {
    Field,
    FForm,
    InfoDialog,
    InfoModal,
    SvgIcon,
    "f-input": FancyInput,
  },
  data() {
    return {
      icons: {
        InfoIcon,
        UserIcon,
        KeyIcon,
      },
      openedModal: false,
      openedDialog: true,
      error: "",
      form: {
        username: "",
        password: "",
      },
      isBlinking: false,
    };
  },
  watch: {
    "form.username": {
      async handler() {
        if (this.error) this.error = "";
      },
      deep: true,
      immediate: true,
    },
    "form.password": {
      async handler() {
        if (this.error) this.error = "";
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(authStore, ["login"]),
    async handleSubmit() {
      const result = await (this.$refs.form as any).validate();

      if (!result) {
        // this.handleShowErrorMessage();
        return;
      } else {
        try {
          const payload = { ...this.form } as AuthPayload;

          await this.login(payload);

          this.handleShowSuccessMessage();
          this.$router.push({ name: "products" });
        } catch (error: any) {
          this.handleSetErrors(error);
          this.handleShowErrorMessage(error);
        }
      }
    },
    handleCloseDialog() {
      this.openedDialog = false;
      this.isBlinking = true;
    },
    handleSkip() {
      this.$router.push({ name: "products" });
    },
    handleOpenInfoModal() {
      this.isBlinking = false;
      this.openedModal = true;
    },
    handleShowErrorMessage(error: CustomError) {
      const snackConfig: SnackConfig = {
        text: error.message,
        type: SnackType.warning,
        icon: true,
        closable: true,
      };

      emitter.emit("showSnack", snackConfig);
    },
    handleShowInfoMessage() {
      const message = this.$t("notifications.login.copy");
      const snackConfig: SnackConfig = {
        text: message,
        type: SnackType.info,
        icon: true,
        closable: true,
      };

      emitter.emit("showSnack", snackConfig);
    },
    handleShowSuccessMessage() {
      const message = this.$t("notifications.login.success");
      const snackConfig: SnackConfig = {
        text: message,
        type: SnackType.success,
        icon: true,
        closable: true,
      };

      emitter.emit("showSnack", snackConfig);
    },
    handleSetErrors(error: CustomError) {
      this.error = error.message;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.login-view {
  background-color: var(--beige-color);

  &.f-view {
    @include mobile {
      height: 100dvh;
    }
  }

  &__container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include mobile {
      align-items: flex-start;
      margin-top: 25%;
    }
  }

  &__card.f-card {
    --card-padding: 40px 62px;

    width: 620px;
    background: var(--white-color);
    position: relative;

    @include mobile {
      --card-padding: 20px 40px;

      width: 90%;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
  }

  &__actions {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin-top: auto;
  }

  &__info-icon {
    --icon-color: var(--grey-color);
    --icon-size: 50px;

    position: absolute;
    top: -100px;
    right: -100px;
    width: var(--icon-size);
    height: var(--icon-size);
    transition: all 0.2s;
    z-index: 5;

    &:hover {
      --icon-color: var(--blue-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
    }

    &.blink {
      animation: blink 1.2s infinite;
    }

    @include mobile {
      --icon-size: 35px;

      top: 10px;
      right: 10px;
    }
  }
}

@keyframes blink {
  100%,
  0% {
    --icon-color: var(--grey-color);
  }
  60% {
    --icon-color: var(--blue-color);
  }
}
</style>
