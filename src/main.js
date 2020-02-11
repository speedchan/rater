import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import { store } from './store' TODO Figure out if store or object store
const fb = require('./firebaseConfig.js')
// import './assets/scss/app.scss' TODO Haven't init this file

Vue.config.productionTip = false

let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
});