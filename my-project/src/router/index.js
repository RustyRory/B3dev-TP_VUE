import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isLogged, isLoading } from "../config/authVariables"
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
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.path === "/tchat" || to.path === "/datatable") {
    const logged = await awaitAuth()
    if (!logged) next("/")
    else next("/tchat")
  } else {
    next()
  }
})

export default router