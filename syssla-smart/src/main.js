import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

const app = createApp(App);
app.use(router).use(vuetify).mount("#app");
