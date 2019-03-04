import Vue from 'vue'
import Router from 'vue-router'
import store from '../../store/index'
import Landing from '@/components/Landing'
import Login from '@/components/auth/Login'
import Logout from '@/components/auth/Logout'
import Signup from '@/components/auth/Signup'
import Home from '@/components/Home'
import Schedules from '@/components/Schedules'
import Welcome from '@/components/Welcome'
import Settings from '@/components/Settings'
import NewSchedule from '@/components/schedules/NewSchedule'
import Schedule from '@/components/schedules/Schedule'
import NoAccess from '@/components/schedules/NoAccess'
import NewShift from '@/components/shifts/NewShift'
import Shift from '@/components/shifts/Shift'
import Shifts from '@/components/shifts/Shifts'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Landing', component: Landing },
    { path: '/home', name: 'Home', component: Home, beforeEnter: checkAuth },
    { path: '/schedules', name: 'Schedules', component: Schedules, beforeEnter: checkAuth },
    { path: '/schedules/new', name: 'NewSchedule', component: NewSchedule, beforeEnter: checkAuth },
    // This will be the first route where the user may get a 403 Forbidden due to not being the schedule owner
    // This is the CRUD page for the schedule and shifts on the schedule so only the owner(s) should be able to reach it
    { path: '/schedules/:id', name: 'Schedule', component: Schedule, beforeEnter: checkAuth },
    { path: '/schedules/:id/shifts/new', name: 'NewShift', component: NewShift, beforeEnter: checkAuth },
    { path: '/schedules/:id/shifts/:title', name: 'Shift', component: Shift, beforeEnter: checkAuth },
    { path: '/schedules/:id/shifts', name: 'Shifts', component: Shifts, beforeEnter: checkAuth },
    { path: '/not-authorized', name: 'No Access', component: NoAccess },
    { path: '/login', name: 'Login', component: Login, beforeEnter: refreshCSRFToken },
    { path: '/logout', name: 'Logout', component: Logout },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/welcome', name: 'Welcome', component: Welcome },
    { path: '/settings', name: 'Settings', component: Settings, beforeEnter: checkAuth }
  ]
})

let api // Need to find a way to turn all this into a function
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}

async function checkAuth (to, from, next) {
  // if user is logged in, move to next route
  let proceed
  await validSession().then(valid => {
    proceed = valid
  })
  if (proceed === true) {
    store.dispatch('logMemberIn')
    if (to.matched[0].path === '/schedules/:id') {
      store.dispatch('getShifts', to.params.id)
    }
    next()
  } else {
    // else if user is not logged in, go to login page
    store.dispatch('logMemberOut')
    next({ name: 'Login', query: { redirect: to.fullPath } })
  }
}

async function validSession () {
  let valid = true
  let api // Need to find a way to turn all this into a function
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    api = process.env.DEV_API
  } else if (process.env.NODE_ENV === 'test') {
    api = process.env.TEST_API
  } else if (process.env.NODE_ENV === 'production') {
    api = process.env.PROD_API
  }
  const apiURL = api + 'validsession'
  let response = await fetch(apiURL, {
    method: 'GET',
    credentials: 'include'
  })
  let status = await response.status
  if (status !== 200) {
    valid = false
  }
  return valid
}

async function refreshCSRFToken (to, from, next) {
  let apiURL = api + 'csrftoken'
  await fetch(apiURL, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      store.dispatch('setCSRFToken', response.headers.get('X-CSRF-Token'))
      next()
    })
}
