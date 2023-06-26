<script setup lang="ts">
import API from 'src/plugins/api'
import { computed, onMounted, ref } from 'vue'

const api = API.useAPI()

const correctAnswer = ref('')
const files = ref<File[]>([])

const img = computed(() => files.value.map((file) => URL.createObjectURL(file)))

const categories = ref<
  {
    id: number
    label: string
  }[]
>([])

const selectedCategories = ref<number[]>([])

onMounted(async () => {
  categories.value = await api.fetchCategories()
})

const uploadedImageUrl = ref<string>()

async function upload() {
  const file = files.value[0]
  if (!file) return
  const response = await api.uploadImage(file)
  uploadedImageUrl.value = response.url
}

const label = ref('')

async function createQuestion() {
  await upload()
  if (
    !correctAnswer.value ||
    !uploadedImageUrl.value ||
    !selectedCategories.value
  )
    return
  await api.createQuestion(
    uploadedImageUrl.value,
    correctAnswer.value,
    selectedCategories.value,
    label.value
  )
}
</script>

<template>
  <div class="container">
    <div class="title">Upload de questões</div>
    <div class="selector label-selector">
      <v-text-field label="Título da questão" v-model="label"></v-text-field>
    </div>
    <div class="selector img-selector">
      <v-file-input
        accept="image/*"
        label="Imagem da questão"
        v-model="files"
      ></v-file-input>
      <div class="preview">
        <div class="title">Pré-visualização</div>
        <div v-if="!img[0]" class="preview-img"></div>
        <img v-else :src="img[0]" alt="" class="preview-img" />
      </div>
    </div>

    <div class="selector answer-selector">
      <v-radio-group v-model="correctAnswer" inline label="Gabarito">
        <v-radio label="A" value="A"></v-radio>
        <v-radio label="B" value="B"></v-radio>
        <v-radio label="C" value="C"></v-radio>
        <v-radio label="D" value="D"></v-radio>
        <v-radio label="E" value="E"></v-radio>
      </v-radio-group>
    </div>

    <div class="selector category-selector">
      <v-autocomplete
        v-model="selectedCategories"
        label="Categorias"
        :items="categories"
        item-title="label"
        item-value="id"
        multiple
      ></v-autocomplete>
    </div>

    <v-btn class="text-none" @click="createQuestion()">Enviar</v-btn>
  </div>
</template>

<style scoped>
@media screen and (min-width: 900px) {
  .container {
    max-width: 900px;
    margin: auto;
  }
}
.preview-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: gray;
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
