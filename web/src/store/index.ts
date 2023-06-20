import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import API from '../plugins/api'

export const useStore = defineStore('store', () => {
  const api = API.useAPI()
  const router = useRouter()

  async function login(email: string, password: string) {
    const token = await api.login(email, password)
    window.localStorage.setItem('token', token)
    router.push('/')
  }

  async function me() {
    return await api.getUserInfo()
  }

  function isLogged() {
    return api.isLogged()
  }

  async function init() {
    const token = window.localStorage.getItem('token')
    if (token) {
      api.setToken(token)
    }
  }

  async function logout() {
    window.localStorage.removeItem('token')
    api.setToken('')
    router.push('/login')
  }

  return {
    init,
    isLogged,
    logout,
    login,
    me,
  }
})
