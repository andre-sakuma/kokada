<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="container">
    <button
      class="submit"
      @click="
        router.push({
          name: 'test-view',
        })
      "
    >
      Simulado
    </button>
    <button
      class="submit"
      @click="
        router.push({
          name: 'upload',
        })
      "
    >
      Upload de questões
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 56px;
  gap: 20px;
  width: 100%;
  height: 100%;
  background-color: var(--white);
}

@media screen and (min-width: 900px) {
  .container {
    max-width: 900px;
    margin: auto;
  }
}

.left {
  min-width: 500px;
  padding: 0 32px;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.submit {
  background-color: var(--red);
  border-radius: 4px;
  color: var(--white);
  font-weight: 800;
}

.input h3 {
  margin: 0;
}
.input input {
  border: 1px solid var(--white);
  padding: 0 8px;
  border-radius: 4px;
  height: 25px;
  width: calc(100% - 24px);
}

.right {
  flex-grow: 1;
  width: 100%;
}
</style>
