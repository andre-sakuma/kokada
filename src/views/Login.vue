<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="left">
      <div class="input">
        <h3>usuário</h3>
        <input type="text" />
      </div>

      <div class="input">
        <h3>senha</h3>
        <input type="password" />
      </div>
      <button class="submit">submit</button>
    </div>
    <div class="right"></div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}

.left {
  min-width: 300px;
  padding: 0 32px;
  padding-top: 100px;
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
