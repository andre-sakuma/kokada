import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './plugins/api'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(api)

app.mount('#app')
