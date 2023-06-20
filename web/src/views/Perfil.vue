<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from '../store'

const store = useStore()

const user = ref<{
  email: string
  name: string
  id: string
}>()

onMounted(async () => {
  console.log('mounted')
  user.value = await store.me()
})

function logout() {
  store.logout()
}
</script>

<template>
  <div class="container" v-if="user">
    <h1>Dados pessoais</h1>
    <p>nome:</p>
    <span>{{ user.name }}</span>
    <p>email:</p>
    <span>{{ user.email }}</span>
    <button @click="logout()">Sair</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  background-color: var(--white);
  color: var(--blue);
}
</style>
