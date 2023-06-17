import { createRouter, createWebHistory } from "vue-router";
import PasswordsPage from "@/pages/PasswordsPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    component: PasswordsPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
});

export default router;
