import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/components/views/LandingView.vue";
import Products from "@/components/views/ProductsView.vue";
import Users from "@/components/views/UsersView.vue";
import Login from "@/components/views/LoginView.vue";

import { authStore } from "@/stores/auth";
import AdminLayout from "@/components/layouts/AdminLayout.vue";
import MainLayout from "@/components/layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "landing",
          meta: {
            title: "Store",
            showSidebar: false,
            requiresAuth: false,
          },
          component: Landing,
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminLayout,
      children: [
        {
          path: "/admin/products",
          name: "products",
          meta: {
            title: "Products",
            showSidebar: true,
            requiresAuth: true,
          },
          component: Products,
        },
        {
          path: "/admin/users",
          name: "users",
          meta: {
            title: "Users",
            showSidebar: true,
            requiresAuth: true,
          },
          component: Users,
        },
        {
          path: "/admin/login",
          name: "login",
          meta: {
            showSidebar: false,
            requiresAuth: false,
          },
          component: Login,
        },
        {
          path: "/admin/logout",
          name: "logout",
          meta: {
            showSidebar: false,
            requiresAuth: false,
          },
          component: Login,
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = authStore();

  if (to.name === "logout") {
    auth.logout();

    return { name: "login" };
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: "login" };
});

export default router;
export interface RouteMeta extends Record<string | number | symbol, any> {}
