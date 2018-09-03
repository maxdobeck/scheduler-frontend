/* 
*  Members Vuex Module
*  Module for monitoring and managing users
*/

  const state = {
    loggedIn: false,
    csrf_token: '',
    memberId: '',
    memberName: '',
    memberEmail: ''
  }
  
  const mutations = {
    setCSRFToken(state, t) {
      state.csrf_token = t
    },
    logMemberIn(state) {
      state.loggedIn = true
    },
    logMemberOut(state) {
      console.log('Logging the user out now!')
      state.loggedIn = false  
    },
    setMemberId(state, id) {
      state.memberId = id
    },
    setMemberName(state, name) {
      state.memberName = name
    },
    setMemberEmail(state, email) {
      state.memberEmail = email
    }
  }

  const actions = {
    setCSRFToken ({commit, state}, token) {
      commit('setCSRFToken', token)
    },
    logMemberIn ({commit, state}) {
      commit('logMemberIn')
    },
    logMemberOut ({commit, state}) {
      fetch(apiLogoutMember, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': state.csrf_token
        }
      })
      .then(function (response) {
        commit('logMemberOut')
        commit('setMemberId', '')
        commit('setMemberName', '')
        commit('setMemberEmail', '')
      })
    },
    setMemberId ({commit, state}, id) {
      commit('setMemberId', id)
    },
    setMemberName ({commit, state}, name) {
      commit('setMemberName', name)
    },
    setMemberEmail ({commit, state}, email) {
      commit('setMemberEmail', email)
    },
    async getCurMember ({commit, state}) {
      // Make the Fetch req to the API
      await fetch(apiCurMember, {
        method: 'GET',
        credentials: 'include'
      })
        .then(function (response) {
          return response.json()
        })
        .then(function (response) {
          if (response.details.status !=='OK') {
            console.log("Problem fetching current user's data.")
          }
          else {
            console.log("We're trying to update the curmember in vuex: ", response.member.email)
            commit('setMemberEmail', response.member.email)
            commit('setMemberName', response.member.name)
            commit('setMemberId',response.member.id)
          }
        })
    }
  }
  
  const getters = {
     logInStatus: state => state.loggedIn,
     curCSRFToken: state => state.csrf_token,
     curMemberId: state => state.memberId,
     memberName: state => state.memberName,
     memberEmail: state => state.memberEmail
    
  }

let api // move this whole thing into a vuex action
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}
const apiCurMember = api + 'curmember'
const apiLogoutMember = api + 'logout'

export default {
  state,
  mutations,
  actions,
  getters
}