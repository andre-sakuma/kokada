<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'

const store = useStore()

const email = ref('')
const password = ref('')

async function login() {
  await store.login(email.value, password.value)
}
</script>

<template>
  <div class="container">
    <div class="left">
      <img
        src="https://static.wixstatic.com/media/32d0db_0b3309a327784638b09397a0a691c39c~mv2.png/v1/crop/x_0,y_0,w_1204,h_329/logo1.png"
      />
      <div class="input">
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          color="var(--white)"
          base-color="var(--white)"
          variant="outlined"
        ></v-text-field>
      </div>

      <div class="input">
        <v-text-field
          label="Senha"
          v-model="password"
          type="password"
          color="var(--white)"
          base-color="var(--white)"
          variant="outlined"
        ></v-text-field>
      </div>
      <button class="submit" @click="login()">submit</button>
    </div>
    <div class="right">
      <div class="mask"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}

.right {
  background-image: url('https://cdn.discordapp.com/attachments/990312216123293736/1123245317891051561/pexels-fauxels-3184292.jpg');
  background-size: cover;
}

.mask {
  background-color: var(--blue);
  opacity: 0.8;
  width: 100%;
  height: 100%;
}

.left {
  max-width: 25%;
  min-width: 400px;
  padding: 0 32px;
  padding-top: 60px;
  background-color: var(--blue);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.submit {
  background-color: var(--white);
  color: var(--blue);
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
  background-color: var(--white);
}
</style>
