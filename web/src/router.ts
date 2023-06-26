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
  {
    name: 'upload',
    path: '/upload',
    component: () => import('src/views/Upload.vue'),
  },
  {
    name: 'test-view',
    path: '/test',
    component: () => import('src/views/TestsView.vue'),
  },
  {
    name: 'test',
    path: '/test/:id',
    component: () => import('src/views/Test.vue'),
  },
  {
    name: 'test-create',
    path: '/test/create',
    component: () => import('src/views/TestCreation.vue'),
  },
  {
    name: 'test-result',
    path: '/test/:id/result',
    component: () => import('src/views/TestResult.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
