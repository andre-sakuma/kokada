import axios, { AxiosInstance } from 'axios'
import { useStore } from 'src/store'

export default class API {
  private apiUrl = 'http://localhost:3000'
  private axiosInstance: AxiosInstance
  private token = ''
  constructor(token?: string) {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const store = useStore()
        if (error.response.data.message === 'Unauthorized jwt expired') {
          console.log('jwt expired')
          store.logout()
        }
        throw error
      }
    )

    if (token) {
      this.token = token
      this.axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${this.token}`
    }
  }

  isLogged() {
    return !!this.token
  }

  async login(email: string, password: string) {
    const response = await this.axiosInstance.post('/login', {
      email,
      password,
    })

    this.token = response.data
    this.axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.token}`

    return response.data
  }

  logout() {
    this.token = ''
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }

  setToken(token: string) {
    this.token = token
    this.axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.token}`
  }

  async getUserInfo() {
    const response = await this.axiosInstance.get('/user')
    return response.data
  }

  async getQuestions() {
    const response = await this.axiosInstance.get('/question')
    return response.data
  }

  async getQuestion(id: number) {
    const response = await this.axiosInstance.get(`/question/${id}`)
    return response.data
  }

  async createQuestion(
    imageUrl: string,
    correctAnswer: string,
    categories: any[],
    label: string
  ) {
    const response = await this.axiosInstance.post('/question', {
      label,
      imageUrl,
      correctAnswer,
      categories,
    })
    return response.data
  }

  async fetchCategories() {
    const response = await this.axiosInstance.get('/category')
    return response.data
  }

  async uploadImage(image: File) {
    const formData = new FormData()
    formData.append('image', image)
    const response = await this.axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async createTest(label: string, categories: { id: number; qnt: number }[]) {
    const response = await this.axiosInstance.post('/test', {
      label,
      categories,
    })
    return response.data
  }

  async getMineTests() {
    const response = await this.axiosInstance.get('/test/mine')
    return response.data
  }

  async getTest(id: number) {
    const response = await this.axiosInstance.get(`/test/${id}`)
    return response.data
  }

  async startTest(id: number) {
    const response = await this.axiosInstance.post(`/test/${id}/start`)
    return response.data
  }

  async finishTest(
    id: number,
    answers: {
      questionId: number
      answer: string | null
    }[]
  ) {
    const response = await this.axiosInstance.post(`/test/${id}/finish`, {
      answers,
    })
    return response.data
  }

  async getResults() {
    const response = await this.axiosInstance.get('/test/results')
    return response.data
  }
}
