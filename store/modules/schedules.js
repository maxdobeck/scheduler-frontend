/* 
*  Schedules Vuex Module
*  Module for managing schedules the user owns or is enrolled in
*/

  const state = {
  	owned_schedules: []
  }

  const mutations = {
    setOwnedSchedules(state, schedules) {
      state.owned_schedules = schedules
    }
  }

  const actions = {
    async getOwnedSchedules({commit, state}, memberID) {
  	 // Make the Fetch req to the API
      await fetch(apiGetOwnedSchedules+memberID, {
        method: 'GET',
        credentials: 'include'
      })
      .then(function (response) {
        return response.json()
      })
      .then(function (response) {
        if (response.Status !== 'OK') {
          console.log("Problem fetching owned schedules.")
        } else {
          commit('setOwnedSchedules', response.FoundSchedules)
        }
      })
  	}
  }

  const getters = {
  	ownedSchedules: state => state.owned_schedules
  }

let api // move this whole thing into a vuex action
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}
let apiGetOwnedSchedules = api + 'schedules' + '/owner/' // + memberID
let apiSchedules = api + 'schedules/'

export default {
  state,
  mutations,
  actions,
  getters
}
