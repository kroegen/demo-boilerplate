import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from "@/components/views/DashboardView.vue";
import Products from "@/components/views/ProductsView.vue";
import Users from "@/components/views/UsersView.vue";
import Login from "@/components/views/LoginView.vue";

import { authStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   name: "dashboard",
    //   meta: {
    //     title: "Dashboard",
    //     showSidebar: true,
    //     requiresAuth: true,
    //   },
    //   component: Dashboard,
    // },
    {
      path: "/",
      name: "products",
      meta: {
        title: "Products",
        showSidebar: true,
        requiresAuth: true,
      },
      component: Products,
    },
    {
      path: "/users",
      name: "users",
      meta: {
        title: "Users",
        showSidebar: true,
        requiresAuth: true,
      },
      component: Users,
    },
    {
      path: "/login",
      name: "login",
      meta: {
        showSidebar: false,
        requiresAuth: false,
      },
      component: Login,
    },
    {
      path: "/logout",
      name: "logout",
      meta: {
        showSidebar: false,
        requiresAuth: false,
      },
      component: Login,
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
