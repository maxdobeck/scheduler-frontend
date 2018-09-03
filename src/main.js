// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '../store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import moment from 'moment'

Vue.use(Vuetify)

// Can I also use Vue.use(moment)? Or do I need the vue-moment package for that?
Vue.prototype.moment = moment

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
