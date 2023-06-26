<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from '../store'
import { Category, Test } from 'src/interfaces'
import API from 'src/plugins/api'

const store = useStore()
const api = API.useAPI()

const user = ref<{
  email: string
  name: string
  id: string
}>()

const tests = ref<Test[]>([])
const results = ref<{
  average: number
  averageByCategory: {
    category: Category
    grade: number
  }[]
  mine: {
    average: number
    averageByCategory: {
      category: Category
      grade: number
    }[]
  }
}>()

onMounted(async () => {
  user.value = await store.me()
  tests.value = await api.getMineTests()
  results.value = await api.getResults()
})

function logout() {
  store.logout()
}
</script>

<template>
  <div class="container" v-if="user">
    <div class="header">
      <v-btn
        @click="logout()"
        color="var(--red)"
        variant="flat"
        style="color: var(--white)"
        >Sair</v-btn
      >
      <div style="margin-top: 16px">
        <h3>nome: {{ user.name }}</h3>
        <h3>email: {{ user.email }}</h3>
      </div>
    </div>
    <div class="results" v-if="results">
      <h2>Meus resultados:</h2>
      <div class="general">
        <h3>Minha média geral: {{ results.mine.average }}</h3>
        <h3>Média geral: {{ results.average }}</h3>
      </div>
      <div class="category">
        <h3>Média por categoria:</h3>
        <div class="categories">
          <div class="category" v-for="category in results.averageByCategory">
            <h4>{{ category.category.label }}</h4>
            <h4>Média geral: {{ category.grade }}</h4>
            <h4>
              Minha média:
              {{
                results.mine.averageByCategory.find(
                  (c) => c.category.id === category.category.id
                )?.grade
              }}
            </h4>
          </div>
        </div>
      </div>
    </div>
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
