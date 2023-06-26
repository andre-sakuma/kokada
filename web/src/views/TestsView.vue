<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Test } from 'src/interfaces'
import API from 'src/plugins/api'

const api = API.useAPI()

const router = useRouter()
function goToCreateTest() {
  router.push({
    name: 'test-create',
  })
}

const tests = ref<Test[]>([])

onMounted(async () => {
  tests.value = await api.getMineTests()
})

function getPrettyTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function getCategories(items: Test['items']) {
  const categoriesMap = items.reduce((acc, item) => {
    if (!item.question.categories) return acc
    const category = item.question.categories[0].category.label
    if (acc.has(category)) {
      acc.set(category, acc.get(category)! + 1)
    } else {
      acc.set(category, 1)
    }
    return acc
  }, new Map<string, number>())

  return [...categoriesMap.entries()].map(([category, count]) => {
    return `${category} (${count})`
  })
}
</script>

<template>
  <div class="container">
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <h3 class="mr-3">Meus simulados</h3>
      <v-btn
        class="text-none"
        @click="goToCreateTest()"
        variant="tonal"
        icon="mdi-plus"
        size="small"
      >
      </v-btn>
    </div>
    <v-container style="overflow-y: auto">
      <v-row>
        <v-col v-for="test in tests" :key="test.id" cols="12" md="4">
          <v-sheet class="test-sheet">
            <div
              :class="{
                'status-tag': true,
                finished: !!test.finishedAt,
              }"
            >
              {{
                test.finishedAt
                  ? 'Finalizado'
                  : test.startedAt
                  ? 'Em andamento'
                  : 'Não realizado'
              }}
            </div>
            <h3>{{ test.label }}</h3>
            <p>Questões: {{ test.items.length }}</p>
            <p>Categorias:</p>
            <div
              style="
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-bottom: 8px;
              "
            >
              <div
                class="category-tag"
                v-for="category in getCategories(test.items)"
                :key="category"
              >
                {{ category }}
              </div>
            </div>
            <div
              v-if="
                !!test.finishedAt &&
                !!test.startedAt &&
                typeof test.correct === 'number'
              "
            >
              <p>
                Tempo:
                {{
                  getPrettyTime(
                    new Date(test.finishedAt).getTime() -
                      new Date(test.startedAt).getTime()
                  )
                }}
              </p>
              <p>
                Acertos:
                {{ test.correct }} ({{
                  Math.floor((test.correct / test.items.length) * 100)
                }}%)
              </p>
            </div>
            <div style="display: flex; flex-grow: 1; align-items: flex-end">
              <v-btn
                variant="tonal"
                class="text-none"
                block
                @click="
                  router.push({
                    name: 'test',
                    params: { id: test.id.toString() },
                  })
                "
              >
                {{
                  test.finishedAt
                    ? 'Revisar'
                    : test.startedAt
                    ? 'Continuar'
                    : 'Iniciar'
                }}
              </v-btn>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet
            class="test-sheet"
            style="align-items: center; justify-content: space-evenly"
          >
            <h3>Criar novo simulado</h3>
            <v-btn
              icon="mdi-plus"
              size="large"
              variant="tonal"
              @click="goToCreateTest()"
            ></v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.category-tag {
  background-color: gray;
  padding: 0px 8px;
  border-radius: 16px;
  color: white;
  white-space: nowrap;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
  background-color: var(--white);
  color: var(--blue);
}
.test-sheet {
  padding: 16px;
  margin: 16px;
  border-radius: 8px;
  background-color: white;
  color: var(--blue);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.status-tag {
  padding: 4px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  background-color: rgba(238, 191, 97, 1);
}

.finished {
  background-color: rgba(97, 238, 97, 1);
}
</style>
