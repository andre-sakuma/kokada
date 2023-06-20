import axios, { AxiosInstance } from 'axios'

export default class API {
  private apiUrl = 'http://localhost:3000'
  private axiosInstance: AxiosInstance
  private token = ''
  constructor(token?: string) {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    })
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

    this.token = response.data.token
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

    console.log(this.token, this.axiosInstance.defaults.headers.common)
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

  async createQuestion(imgUrl: string, correctAnswer: string) {
    const response = await this.axiosInstance.post('/question', {
      imgUrl,
      correctAnswer,
    })
    return response.data
  }
}
