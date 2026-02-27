import { createApp } from 'vue'
import { registerPlugin } from './plugins'

import App from './App.vue'

const app = createApp(App)

registerPlugin(app)

app.mount('#app')
