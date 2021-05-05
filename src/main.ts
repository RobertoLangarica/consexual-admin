import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import firebase from '@/firebase'

const app = createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store, key)
  .use(router)

router.isReady()
  .then(() => firebase.initialize())
  .then(() => store.dispatch('init'))
  .then(() => {
    app.mount('#app')
  })
