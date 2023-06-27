<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from '../store'
import { Category, Test } from 'src/interfaces'
import { DoughnutChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
import API from 'src/plugins/api'
import { computed } from 'vue'

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

const mineVsGeneralChart = computed(() => {
  if (!results.value) return
  return {
    labels: ['Notas'],
    datasets: [
      {
        label: 'Minha média',
        data: [results.value.mine.average],
        backgroundColor: ['#0079AF'],
      },
      {
        label: 'Média geral',
        data: [results.value.average],
        backgroundColor: ['#77CEFF'],
      },
    ],
  }
})

const mineVsCategoriesChart = computed(() => {
  if (!results.value) return

  return results.value.averageByCategory.map((c) => {
    if (!results.value) return
    const category = results.value.mine.averageByCategory.find(
      (cat) => cat.category.id === c.category.id
    )
    if (!category) return
    return {
      labels: [category.category.label],
      datasets: [
        {
          label: 'Minha média',
          data: [category.grade],
          backgroundColor: ['#0079AF'],
        },
        {
          label: 'Média geral',
          data: [c.grade],
          backgroundColor: ['#77CEFF'],
        },
      ],
    }
  })
})

const selfOverallChart = computed(() => {
  if (!results.value) return
  return {
    labels: results.value.mine.averageByCategory.map((c) => c.category.label),
    datasets: [
      {
        data: results.value?.mine.averageByCategory.map((c) => c.grade),
        backgroundColor: [
          '#77CEFF',
          '#0079AF',
          '#123E6B',
          '#97B0C4',
          '#A5C8ED',
        ],
      },
    ],
  }
})

const averageOverallChart = computed(() => {
  if (!results.value) return
  return {
    labels: results.value.averageByCategory.map((c) => c.category.label),
    datasets: [
      {
        data: results.value.averageByCategory.map((c) => c.grade),
        backgroundColor: [
          '#77CEFF',
          '#0079AF',
          '#123E6B',
          '#97B0C4',
          '#A5C8ED',
        ],
      },
    ],
  }
})
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
    <h2>Meus resultados:</h2>
    <div class="results" v-if="results">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px">
        <div class="chart-section">
          <h3>Geral:</h3>
          <BarChart v-if="mineVsGeneralChart" :chartData="mineVsGeneralChart" />
        </div>
        <div class="chart-section">
          <h3>Meu desempenho por categoria:</h3>
          <DoughnutChart
            :height="300"
            v-if="selfOverallChart"
            :chartData="selfOverallChart"
          />
        </div>

        <div class="chart-section">
          <h3>Desempenho médio por categoria:</h3>
          <DoughnutChart
            :height="300"
            v-if="averageOverallChart"
            :chartData="averageOverallChart"
          />
        </div>
      </div>
      <h3>Média por categoria:</h3>
      <div class="categories">
        <div
          class="chart-section"
          v-if="mineVsCategoriesChart"
          v-for="chart in mineVsCategoriesChart"
        >
          <h3>{{ chart?.labels[0] }}</h3>
          <BarChart v-if="chart" :chartData="chart" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.chart-section {
  margin: 0 auto;
}

.categories {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  background-color: var(--white);
  color: var(--blue);
}
</style>
