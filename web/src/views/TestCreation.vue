<script setup lang="ts">
import API from 'src/plugins/api'
import router from 'src/router'
import { onMounted, ref } from 'vue'

const api = API.useAPI()
const categories = ref<
  {
    id: number
    label: string
    questions: any
  }[]
>([])

const selectedCategories = ref<number[]>([])

const categoriesData = ref<
  {
    category: {
      id: number
      label: string
      questions: any
    }
    qnt: number
    limit: number
  }[]
>([])

onMounted(async () => {
  categories.value = await api.fetchCategories()
})

function updateCategoriesMap() {
  categoriesData.value = []
  const data = categories.value
    .filter((category) => selectedCategories.value.includes(category.id))
    .map((category) => {
      return {
        category,
        qnt: 0,
        limit: category.questions.length,
      }
    })

  categoriesData.value = data
}

function handleMaxAndMin(id: number, min: number, max: number) {
  const actual = categoriesData.value.find(
    (category) => category.category.id === id
  )

  if (!actual) return
  if (actual.qnt < min) {
    actual.qnt = min
  }
  if (actual.qnt > max) {
    actual.qnt = max
  }
}

const label = ref('')

async function createTest() {
  if (!label.value || !categoriesData.value.length) return
  const categories = categoriesData.value.map((category) => {
    return {
      id: category.category.id,
      qnt: category.qnt,
    }
  })
  await api.createTest(label.value, categories)

  router.push({
    name: 'test-view',
  })
}
</script>

<template>
  <div class="container">
    <h3>Defina um título para identificar o simulado depois</h3>
    <div>
      <v-text-field v-model="label"></v-text-field>
    </div>
    <h3>Categorias</h3>
    <div class="selector category-selector">
      <v-autocomplete
        v-model="selectedCategories"
        @update:modelValue="updateCategoriesMap()"
        label="Categorias"
        :items="categories"
        item-title="label"
        item-value="id"
        multiple
      ></v-autocomplete>
    </div>
    <h3 v-if="categoriesData && categoriesData.length">
      Quantidade de questões por categoria
    </h3>
    <div
      v-if="categoriesData && categoriesData.length"
      v-for="category in categoriesData"
      :key="'category:' + category.category.id"
      class="input-qnt-grid"
    >
      <div>{{ category.category.label }}</div>
      <v-text-field
        v-model="category.qnt"
        @change="handleMaxAndMin(category.category.id, 0, category.limit)"
        hide-details
        single-line
        density="compact"
        type="number"
        style="max-width: 70px"
      ></v-text-field>
    </div>
    <v-btn class="text-none" @click="createTest()">Criar simulado</v-btn>
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
.input-qnt-grid {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  margin-bottom: 16px;
}
</style>
