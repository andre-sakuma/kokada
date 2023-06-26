<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from './store'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isRouterReady = ref(false)

onBeforeMount(async () => {
  await router.isReady()
  isRouterReady.value = true
  await store.init()

  if (!store.isLogged()) {
    router.push({ name: 'login' })
  }
})
const isLoginView = computed(() => route.name === 'login')
</script>

<template>
  <div class="view" v-if="isRouterReady">
    <div class="header" v-if="!isLoginView">
      <div class="links">
        <!-- <a href="/police">POLICE</a> -->
        <a href="/">MENU</a>
        <!-- <a href="/forum">FÓRUM</a> -->
      </div>
      <div class="right-side">
        <div class="perfil-img" @click="router.push({ name: 'perfil' })"></div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.header {
  min-height: 56px;
  padding: 8px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: var(--blue);
}

.perfil-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: gray;
}
.links {
  display: flex;
  gap: 16px;
}

.header a {
  color: var(--white);
  margin: 0 !important;
  text-decoration: none;
  font-weight: 800;
  margin-right: 16px;
}
.view {
  display: flex;
  flex-direction: column;
  background-color: gray;
  height: 100vh;
  width: 100%;
}
.content {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
}
</style>
