<template>
<v-container align-center>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-layout row justify-center>
      <v-flex xs8>
        <v-text-field
          label="Email"
          v-model="email"
          :rules="emailRules"
          required
          autofocus
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs8>
        <v-text-field
          label="Password"
          v-model="password"
          :rules="passwordRules"
          :type="'password'"
          required
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-btn
        @click="clickHandler"
        :disabled="loading"
        :loading="loading"
        color="primary"
      >Login
      </v-btn>
    </v-layout>
  </v-form>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
let api // move this whole thing into a vuex action
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else if (process.env.NODE_ENV === 'production') {
  api = process.env.PROD_API
}
const apiURL = api + 'login'
export default {
  data () {
    return {
      loading: false,
      email: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      valid: false,
      errors: []
    }
  },
  methods: {
    clickHandler: function (e) {
      this.loginMember()
    },
    loginMember: function (e) {
      let self = this
      let headerToken
      this.loading = true
      console.log('Current csrf token: ', this.token)
      fetch(apiURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.token
        },
        body: JSON.stringify({ email: this.email, password: this.password })
      })
        .then(function (response) {
          headerToken = response.headers.get('X-CSRF-Token')
          if (response.status === 403) {
            self.errors = "Please reload.  It looks like you're missing a cookie."
            console.log(self.errors)
            return response.status
          } else if (response.status !== 200) {
            self.errors = 'Something went wrong.  Please try clearing your cache and restarting your browser.'
          }
          self.setCSRFToken(headerToken)
          return response.json()
        })
        .then(response => {
          if (response['Status'] !== 'OK') {
            self.loading = false
            self.errors = response['Status']
          } else {
            // redirect to signup URL and save user values to vuex store
            this.errors = []
            self.setCSRFToken(headerToken)
            console.log('Member Details Response: ', response)
            this.$store.dispatch('setMemberName', response.Name)
            this.$store.dispatch('setMemberId', response.ID)
            this.$store.dispatch('setMemberEmail', response.Email)
            this.logMemberIn()
            if (this.$route.query.redirect !== undefined) {
              this.$router.push(this.$route.query.redirect)
            } else {
              this.$router.push('/home')
            }
            this.email = ''
            this.password = ''
            self.loading = false
          }
        })
    },
    logMemberIn () {
      this.$store.dispatch('logMemberIn')
      this.$store.dispatch('getCurMember')
      this.$store.dispatch('getOwnedSchedules', this.$store.getters.curMemberId)
    },
    setCSRFToken (token) {
      this.$store.dispatch('setCSRFToken', token)
    }
  },
  computed: mapGetters({
    token: 'curCSRFToken',
    loggedIn: 'logInStatus'
  })
}
</script>

<style scoped>
</style>
