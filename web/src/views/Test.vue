<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API from 'src/plugins/api'
import { Test } from 'src/interfaces'

const router = useRouter()
const route = useRoute()
const api = API.useAPI()

const test = ref<Test>()

const answers = ref<Map<number, string | null>>(new Map())

const hasStarted = computed(() => !!test.value?.startedAt)
const ranTime = ref<number | null>(null)

onMounted(async () => {
  await router.isReady()
  const id = Number(route.params.id)
  test.value = await api.getTest(id)

  if (!test.value) {
    router.push('/tests')
    return
  }

  if (!!test.value.finishedAt) {
    router.push(`/test/${test.value.id}/result`)
    return
  }

  for (const item of test.value.items) {
    answers.value.set(item.questionId, null)
  }

  selectedQuestion.value = test.value.items[0].question

  if (hasStarted.value) {
    startTest()
  }
})

const timer = ref<NodeJS.Timer | null>(null)

async function startTest() {
  if (!test.value) return

  if (timer.value) {
    clearInterval(timer.value)
  }
  if (!hasStarted.value) {
    test.value.startedAt = await api.startTest(test.value.id)
  }

  timer.value = setInterval(() => {
    ranTime.value = Date.now() - new Date(test.value!.startedAt!).getTime()
  }, 1000)
}

const selectedQuestion = ref<Test['items'][0]['question']>()
const selectedAnswer = ref<string | null>(null)

function selectAnswer() {
  if (!test.value) return
  if (!selectedQuestion.value) return
  answers.value.set(selectedQuestion.value.id, selectedAnswer.value)
  console.log(answers.value)
}

function navigate(direction: 'next' | 'prev') {
  if (!test.value) return
  const index = test.value.items.findIndex(
    (item) => item.questionId === selectedQuestion.value?.id
  )
  if (index === -1) return

  if (direction === 'next') {
    if (index === test.value.items.length - 1) return
    selectedAnswer.value = null

    selectedQuestion.value = test.value.items[index + 1].question
  } else {
    if (index === 0) return
    selectedAnswer.value = null

    selectedQuestion.value = test.value.items[index - 1].question
  }

  selectedAnswer.value = answers.value.get(selectedQuestion.value.id) || null
}

function getPrettyTime() {
  if (!test.value) return '00:00:00'
  const time = ranTime.value || 0
  const hours = Math.floor(time / 1000 / 60 / 60)
  const minutes = Math.floor((time / 1000 / 60) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const answeredCount = computed(() => {
  if (!test.value) return 0
  return [...answers.value.values()].filter((a) => !!a).length
})

const anweredPercentage = computed(() => {
  if (!test.value) return 0
  return answeredCount.value / test.value.items.length
})

async function finishTest() {
  if (!test.value) return
  if (!hasStarted.value) return

  clearInterval(timer.value!)
  const cleanAnswers = [...answers.value.entries()].map(([key, value]) => ({
    questionId: key,
    answer: value,
  }))
  test.value.finishedAt = await api.finishTest(test.value.id, cleanAnswers)
  router.push({
    name: 'test-result',
    params: { id: test.value.id.toString() },
  })
}

function selectQuestion(item: Test['items'][0]) {
  selectedQuestion.value = item.question
  selectedAnswer.value = answers.value.get(item.questionId) || null
}
</script>

<template>
  <div class="container">
    <template v-if="test && !hasStarted">
      <div
        style="
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
          text-align: left;
          flex-direction: column;
          gap: 20px;
        "
      >
        <h1>{{ test.label }}</h1>
        <h3>Questões: {{ test.items.length }}</h3>
        <v-btn class="text-none" @click="startTest()">Iniciar</v-btn>
      </div>
    </template>
    <template v-else-if="test && hasStarted">
      <div class="row">
        <div class="navbar">
          <div class="title">{{ test.label }}</div>
          <div class="timer">{{ getPrettyTime() }}</div>

          <h3>Progresso</h3>
          <div class="progress">
            <div
              class="progress-bar"
              :style="{ width: anweredPercentage * 100 + '%' }"
            ></div>
          </div>

          <div class="items">
            <div
              class="item"
              v-for="(item, index) in test.items"
              :key="item.questionId"
              @click="selectQuestion(item)"
            >
              <div
                :class="{
                  'question-status': true,
                  answered: !!answers.get(item.questionId),
                }"
              ></div>
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
              @click="finishTest()"
              variant="tonal"
              block
            >
              Finalizar teste
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
            <div>
              <v-radio-group
                v-model="selectedAnswer"
                inline
                @update:modelValue="selectAnswer()"
              >
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
    </template>
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
