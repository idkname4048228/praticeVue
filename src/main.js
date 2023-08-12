import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import the fontawesome core
import { library } from "@fortawesome/fontawesome-svg-core";

// import fontawesome icon component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faCommentSlash } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// add the icon style(s) you have installed to the library
library.add(faUserSecret, faComment, faCommentSlash, faPaperPlane);

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
