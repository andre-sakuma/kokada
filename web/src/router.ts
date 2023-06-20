import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('src/views/Login.vue'),
  },
  { name: 'home', path: '/', component: () => import('src/views/Home.vue') },
  {
    name: 'police',
    path: '/police',
    component: () => import('src/views/Police.vue'),
  },
  {
    name: 'forum',
    path: '/forum',
    component: () => import('src/views/Forum.vue'),
  },
  {
    name: 'perfil',
    path: '/perfil',
    component: () => import('src/views/Perfil.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
