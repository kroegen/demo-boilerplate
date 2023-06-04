<template>
  <f-dialog
    v-if="isOppened"
    :opened="isOppened"
    closable
    @close="isOppened = false"
    close-by-click-outside
    class="info"
  >
    <template #header>
      <h3>{{ $t("dialogs.info.title") }}</h3>
    </template>
    <transition name="slide-fade">
      <div class="info__content">
        <div
          class="info__content-wrapper"
          v-for="step in steps"
          :key="step.step"
          v-show="step.step === currentStep"
        >
          <p
            class="info__content-paragraph"
            v-for="(paragraph, index) in step.paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </transition>
    <template #actions-right>
      <f-button
        v-for="(action, index) in currentStepActions"
        :key="index"
        :variant="action.variant"
        size="large"
        @click="action.action"
        style="margin-left: 20px"
      >
        {{ action.label }}
      </f-button>
    </template>
  </f-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ButtonVariant } from "@/components/common/FancyButton.vue";

interface Action {
  label: string;
  action: Function;
  variant?: ButtonVariant;
}

interface Step {
  step: number;
  paragraphs: string[];
  actions: Action[];
}

export default defineComponent({
  props: {
    opened: Boolean,
  },
  computed: {
    isOppened: {
      get(): boolean {
        return this.opened;
      },
      set(value: boolean) {
        this.$emit("change", value);
      },
    },
    currentStepActions(): Action[] {
      return this.steps[this.currentStep].actions;
    },
    steps(): Step[] {
      return [
        {
          step: 0,
          paragraphs: [this.$t("dialogs.info.p1")],
          actions: [
            {
              label: this.$t("actions.skip"),
              variant: "outlined",
              action: () => this.handleSkipSteps(),
            },
            {
              label: this.$t("actions.next"),
              action: () => this.handleNextStep(),
            },
          ],
        },
        {
          step: 1,
          paragraphs: [this.$t("dialogs.info.p2"), this.$t("dialogs.info.p3")],
          actions: [
            {
              label: this.$t("actions.skip"),
              variant: "outlined",
              action: () => this.handleSkipSteps(),
            },
            {
              label: this.$t("actions.next"),
              action: () => this.handleNextStep(),
            },
          ],
        },
        {
          step: 2,
          paragraphs: [this.$t("dialogs.info.p4")],
          actions: [
            {
              label: this.$t("actions.skip"),
              variant: "outlined",
              action: () => this.handleSkipSteps(),
            },
            {
              label: this.$t("actions.next"),
              action: () => this.handleNextStep(),
            },
          ],
        },
        {
          step: 3,
          paragraphs: [this.$t("dialogs.info.p5")],
          actions: [
            {
              label: this.$t("actions.start"),
              action: () => this.handleFinish(),
            },
          ],
        },
      ];
    },
  },
  data() {
    return {
      currentStep: 0,
    };
  },
  methods: {
    handleSkipSteps() {
      this.currentStep = this.steps.length - 1;
    },
    handleNextStep() {
      this.currentStep += 1;
    },
    handleFinish() {
      this.isOppened = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.info {
  &.dialog {
    --dialog-max-conent-width: 1200px;
    --dialog-min-conent-width: 1000px;
    --dialog-min-conent-height: 580px;
    padding: 0% 3%;
  }

  &__content {
    padding-top: 20px;
  }

  &__content-paragraph {
    margin-bottom: 20px;
  }
}
</style>
