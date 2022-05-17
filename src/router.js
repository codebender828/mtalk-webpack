import { createRouter, createWebHistory } from "vue-router";
import { guard } from "~/services/guard";
import { analytics } from "~/services/analytics";

import Index from "~/views/index";
import Chat from "~/views/chat";
import Redirect from "~/views/redirect";

const routes = [
  { path: "/", name: "auth", component: Index },
  {
    path: "/nfts/:id",
    name: "nft",
    component: Chat,
    meta: { requireAuth: true },
  },
  { path: "/:pathMatch(.*)*", component: Redirect },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Router Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (guard.isAuthed) {
      next();
    } else {
      next({
        path: "/",
        query: { redirect: to.fullPath, code: to.params.id },
      });
    }
  } else {
    next();
  }
});

// Router GA Pageview
router.afterEach((to, from, next) => {
  analytics.page(to);
});
