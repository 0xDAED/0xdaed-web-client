import router from './router'
import pinia from './pinia'
import i18n from './i18n'
import axios from './axios'
import lucide from './lucide'

export function registerPlugin(app) {
  app.use(router)
  app.use(pinia)
  app.use(i18n)
  app.use(axios)
  app.use(lucide)
}
