<template>
  <v-app id="wholeApp">
    <div id="navbar">
      <router-link to="/">
        <a to="/" v-if="!loggedIn" id="landing" class="navBtn">Scheduling is Hard</a>
      </router-link>
      <router-link to="/home">
        <a v-if="loggedIn" id="home" class="navBtn">Home</a>
      </router-link>
      <router-link to="/schedules">
        <a v-if="loggedIn" id="schedules" class="navBtn">Schedules</a>
      </router-link>
      <router-link to="/settings" >
        <a v-if="loggedIn" id="settings" class="navBtn">Settings</a>
      </router-link>
      <router-link to="signup">
        <a v-if="!loggedIn" id="signup" class="navBtn">Sign Up</a>
      </router-link>
      <router-link to="/login">
        <a v-if="!loggedIn" id="logInOut" class="navBtn">Log In</a>
      </router-link>
      <router-link to="/">
        <a @click="logoutHandler" v-if="loggedIn" id="logInOut" class="navBtn">Log Out</a>
      </router-link>
    </div>
    <v-content>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import store from '../store/index'
import { mapGetters } from 'vuex'
let api // Need to find a way to turn all this into a function
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}
const apiURL = api + 'csrftoken'
export default {
  data () {
    return {
      errors: []
    }
  },
  name: 'App',
  methods: {
    setCSRFToken (token) {
      this.$store.dispatch('setCSRFToken', token)
    },
    logoutHandler () {
      this.logMemberOut()
    },
    logMemberOut () {
      store.dispatch('logMemberOut')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters({
      token: 'curCSRFToken',
      loggedIn: 'logInStatus',
      memberName: 'memberName',
      memberEmail: 'memberEmail'
    })
  },
  created:
    function () {
      fetch(apiURL, {
        method: 'GET',
        credentials: 'include'
      })
        .then(response => this.setCSRFToken(response.headers.get('X-CSRF-Token')))
    }
}
</script>

<style scoped>
  .navBtn {
    text-transform: none;
    text-decoration: none;
    width: 8%;
    padding: 0px;
    margin: 0px;
  }
  .navBtn:hover {
    color: darkblue;
  }
  #navbar {
    background-color: white;
  }
  #wholeApp {
    background-color: white;
  }
</style>
