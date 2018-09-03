<template>
  <v-app id="wholeApp">
    <nav class="navbar">
      <router-link v-if="!loggedIn" id="landing" class="navBtn" to="/">
        Scheduling is Hard
      </router-link>
      <router-link
      v-if="loggedIn"
      id="home"
      class="navBtn"
      to="/home">
        Home</router-link>
      <router-link
      v-if="loggedIn"
      id="schedules"
      class="navBtn"
      to="/schedules">
        Schedules</router-link>
      <router-link
        v-if="loggedIn"
        id="settings"
        class="navBtn"
        to="/settings">
        Settings</router-link>
      <router-link
      v-if="!loggedIn"
      id="signup"
      class="navBtn"
      to="signup">
        Sign Up</router-link>
      <router-link
        v-if="!loggedIn"
        id="logInOut"
        class="navBtn"
        to="/login">
        Log In</router-link>
      <router-link to="/">
        <a @click="logoutHandler"
        v-if="loggedIn"
        id="logInOut"
        class="navBtn">Log Out</a>
      </router-link>
      <span v-if='loggedIn' id="welcome">Hi {{ memberName }}</span>
    </nav>
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
    async function () {
      fetch(apiURL, {
        method: 'GET',
        credentials: 'include'
      })
        .then(response => this.setCSRFToken(response.headers.get('X-CSRF-Token')))
      await store.dispatch('getCurMember')
      await store.dispatch('getOwnedSchedules', this.$store.getters.curMemberId)
    }
}
</script>

<style scoped>
  .navBtn {
    margin-right: 4px;
    font-size: 1.1em;
  }
  .navBtn:hover {
    color: orange;
  }
  #wholeApp {
    background-color: white;
  }
  #wholeApp {
    background-color: white;
  }
</style>
