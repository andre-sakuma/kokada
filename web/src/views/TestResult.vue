<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API from 'src/plugins/api'
import { Test } from 'src/interfaces'

const router = useRouter()
const route = useRoute()
const api = API.useAPI()

const test = ref<Test>()

onMounted(async () => {
  await router.isReady()
  const id = Number(route.params.id)
  test.value = await api.getTest(id)

  if (!test.value) {
    router.push('/tests')
    return
  }

  selectedQuestion.value = test.value.items[0].question
  selectedAnswer.value = test.value.items[0].answer
})

const selectedQuestion = ref<Test['items'][0]['question']>()
const selectedAnswer = ref<string | null>(null)

function navigate(direction: 'next' | 'prev') {
  if (!test.value) return
  const index = test.value.items.findIndex(
    (item) => item.questionId === selectedQuestion.value?.id
  )
  if (index === -1) return
  let item: Test['items'][0]

  if (direction === 'next') {
    if (index === test.value.items.length - 1) return
    selectedAnswer.value = null

    item = test.value.items[index + 1]
  } else {
    if (index === 0) return
    selectedAnswer.value = null

    item = test.value.items[index - 1]
  }

  selectedQuestion.value = item.question
  selectedAnswer.value = item.answer
}

function selectQuestion(item: Test['items'][0]) {
  selectedQuestion.value = item.question
  selectedAnswer.value = item.answer
}

function finishReview() {
  router.push('/test')
}
</script>

<template>
  <div v-if="test" class="container">
    <div class="row">
      <div class="navbar">
        <div class="title">{{ test.label }}</div>

        <h3>Revisão</h3>

        <div class="items">
          <div
            class="item"
            v-for="(item, index) in test.items"
            :key="item.questionId"
            @click="selectQuestion(item)"
          >
            <v-icon>{{ item.correct ? 'mdi-check' : 'mdi-close' }}</v-icon>
            <div
              class="question-item"
              :class="{ active: item.questionId === selectedQuestion?.id }"
            >
              {{ index + 1 }} - {{ item.question.label }}
            </div>
          </div>
        </div>
        <div>
          <v-btn
            class="text-none"
            @click="finishReview()"
            variant="tonal"
            block
          >
            Sair da revisão
          </v-btn>
        </div>
      </div>
      <div class="question">
        <div
          v-if="selectedQuestion"
          style="
            flex-grow: 1;
            width: 100%;
            display: flex;
            padding-top: 16px;
            justify-content: center;
            align-items: start;
            overflow-y: auto;
          "
        >
          <img :src="selectedQuestion.imageUrl" />
        </div>
        <div style="padding: 16px; width: 100%">
          <div style="color: green">
            Resposta correta: {{ selectedQuestion?.correctAnswer }}
          </div>
          <div>
            <v-radio-group v-model="selectedAnswer" inline disabled>
              <v-radio label="A" value="A"></v-radio>
              <v-radio label="B" value="B"></v-radio>
              <v-radio label="C" value="C"></v-radio>
              <v-radio label="D" value="D"></v-radio>
              <v-radio label="E" value="E"></v-radio>
            </v-radio-group>
          </div>
          <div class="navigator">
            <v-btn
              class="text-none button"
              @click="navigate('prev')"
              variant="tonal"
            >
              Anterior
            </v-btn>
            <v-btn
              @click="navigate('next')"
              variant="tonal"
              class="text-none button"
            >
              Próxima
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.v-selection-control-group {
  display: flex;
  gap: 20px;
  align-self: center;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: var(--white);
  color: var(--blue);
}

.row {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}

.navbar {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: var(--red);
  color: var(--white);
  padding: 16px;
  overflow: hidden;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
}

.question {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

.items {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 16px;
  gap: 8px;
}

.question-item {
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  flex-grow: 1;
}

.question-item.active {
  background-color: var(--blue);
  color: var(--white);
}

.navigator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
}

.navigator .button {
  flex-grow: 1;
}

.question-status {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: var(--white);
}

.question-status.answered {
  background-color: var(--blue);
}

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.progress {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  height: 24px;
  min-height: 24px;
  border-radius: 16px;
  background-color: var(--white);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  padding: 0 16px;
}
</style>
