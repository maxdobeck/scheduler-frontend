/* 
*  Members Vuex Module
*  Module for monitoring and managing users
*/

  const state = {
    loggedIn: false,
    csrf_token: ''
  }
  
  const mutations = {
    setCSRFToken(state, t) {
      state.csrf_token = t
    }
  }

  const actions = {
    setCSRFToken ({commit, state}, token) {
      commit('setCSRFToken', token)
    }
  }
  
  const getters = {
     logInStatus: state => state.loggedIn,
     curCSRFToken: state => state.csrf_token
    
  }

export default {
  state,
  mutations,
  actions,
  getters
}