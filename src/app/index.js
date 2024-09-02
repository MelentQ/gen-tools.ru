import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './routes'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueTippy from 'vue-tippy'
import {
  faCopy,
  faPlus,
  faCheck,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faPenToSquare,
  faTrash,
  faBolt,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCopy,
  faPlus,
  faCheck,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faPenToSquare,
  faTrash,
  faBolt,
  faXmark
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueTippy)
app.use(createPinia())
app.use(router)

export { app }
