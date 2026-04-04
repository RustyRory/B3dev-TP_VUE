import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { awaitAuth } from "../service/authService"

const router = createRouter({
  history: createWebHistory("/B3dev-TP_VUE/"),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue') // lazy load
    },
    {
      path: '/tchat',
      name: 'tchat',
      component: () => import('../views/TchatView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  if (to.path === "/tchat" || to.path === "/datatable" || to.path === "/settings") {
    const logged = await awaitAuth()
    if (!logged) next("/")
    else next()
  } else {
    next()
  }
})

export default router