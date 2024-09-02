import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomePage.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/pages/tools/ui/ToolsPage.vue')
    },
    {
      path: '/tools/passwords',
      name: 'passwords-tool',
      component: () => import('@/pages/passwords-tool/ui/PasswordsToolPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue')
    }
  ]
})

export default router
