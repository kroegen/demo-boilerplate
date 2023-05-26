import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./utils/rules.ts";
import en from "./locales/en.json";

import "./assets/styles/main.scss";

import FancyView from "@/components/common/FancyView.vue";
import FancyCard from "@/components/common/FancyCard.vue";
import FancyModal from "@/components/common/FancyModal.vue";
import FancyDialog from "@/components/common/FancyDialog.vue";
import FancyButton from "@/components/common/FancyButton.vue";
import FancyContainer from "@/components/common/FancyContainer.vue";

const i18n = createI18n({
  locale: "en",
  messages: {
    en,
  },
});
const pinia = createPinia();
const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(pinia);

// Globally registed components
app.component("f-view", FancyView);
app.component("f-card", FancyCard);
app.component("f-modal", FancyModal);
app.component("f-dialog", FancyDialog);
app.component("f-button", FancyButton);
app.component("f-container", FancyContainer);

app.mount("body");
