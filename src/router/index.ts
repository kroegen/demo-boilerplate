import { createRouter, createWebHistory } from "vue-router";

const Landing = () => import("@/components/views/LandingView.vue");
const Products = () => import("@/components/views/ProductsView.vue");
const Users = () => import("@/components/views/UsersView.vue");
const Login = () => import("@/components/views/LoginView.vue");
// const Favorites = () => import("@/components/views/FavoritesView.vue");
const NotFound = () => import("@/components/views/NotFoundView.vue");

import { authStore } from "@/stores/auth";
const AdminLayout = () => import("@/components/layouts/AdminLayout.vue");
const MainLayout = () => import("@/components/layouts/MainLayout.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainLayout,
      children: [
        {
          path: "/:pathMatch(.*)*",
          name: "not-found",
          component: NotFound,
        },
        {
          path: "/",
          name: "landing",
          component: Landing,
        },
        // {
        //   path: "/favorites",
        //   name: "favorites",
        //   component: Favorites,
        // },
        {
          path: "/category/:category",
          name: "category",
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
          path: "/admin/:pathMatch(.*)*",
          name: "not-found",
          component: NotFound,
          meta: {
            showSidebar: true,
            requiresAuth: false,
          },
        },
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
