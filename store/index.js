import Vue from 'vue'
import Vuex from 'vuex'
import members from './modules/members'
import schedules from './modules/schedules'
import shifts from './modules/shifts'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production', // strict mode must be turned off for prod -> https://vuex.vuejs.org/guide/strict.html
  modules: {
    members,
    schedules,
    shifts
  }
})