/* 
*  Shifts Vuex Module
*  Module for managing shifts that are part of a schedule
*/

const state = {
  shifts: []
}

const mutations = {
  setShifts(state, shifts) {
    state.shifts = shifts
  }
}

const actions = {
  async getShifts({commit, state}, scheduleID) {
    console.log('Getting all shifts for: ', scheduleID)
   // Make the Fetch req to the API
   if (scheduleID === '') {
    return
   }
    await fetch(api+'schedules/'+scheduleID+'/shifts', {
      method: 'GET',
      credentials: 'include'
    })
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      console.log(response)
      if (response.status !== 'OK') {
        console.log("Problem fetching shifts for schedule.", scheduleID)
      } else {
        console.log(response.FoundShifts[0])
        addURI(response.FoundShifts)
        commit('setShifts', response.FoundShifts)
      }
    })
  }
}

const getters = {
  shifts: state => state.shifts
}

let api // move this whole thing into a vuex action
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else if (process.env.NODE_ENV === 'production') {
  api = process.env.PROD_API
}

export default {
  state,
  mutations,
  actions,
  getters
}

function addURI (shifts) {
  for (let i in shifts) {
    shifts[i].URI = shifts[i].Title.replace(/ /g, '-')
  }
}