import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueTippy from "vue-tippy";
import {
  faCopy,
  faPlus,
  faCheck,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faPenToSquare,
  faTrash,
  faBolt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import router from "@/router";

library.add(
  faCopy,
  faPlus,
  faCheck,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faPenToSquare,
  faTrash,
  faBolt,
  faXmark
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(VueTippy)
  .use(router)
  .mount("#app");
