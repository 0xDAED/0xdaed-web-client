import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default {
  install(app) {
    app.config.globalProperties.$api = api
    app.provide('api', api)
  },
}
