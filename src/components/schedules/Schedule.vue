<template>
  <div class="schedule-container" >
    <div class="schedule-header">
      <div class="schedule-title">
      <p v-show="editTitle === false"
        @dblclick="editTitle = true"
        id="header">
        {{ schedule.Title }}
      </p>
      <input v-show="editTitle === true"
        v-model="newTitle"
        @keyup.enter = "saveTitle"
        v-on:blur = "editTitle = false"
        placeholder="New Schedule Title"
        id="header">
      </div>
      <div class="schedule-links">
        <router-link to="#" class="schedule-meta">PTO Board</router-link>
        <router-link to="#" class="schedule-meta">Shifts</router-link>
        <div id="alert" v-show="alert === true">
          <p> {{ errors }} </p>
          <button @click="alert = false">ok</button>
        </div>
      </div>
      <div class="schedule-calendar-component">
        <Calendar></Calendar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Calendar from './Calendar.vue'
let api // Need to find a way to turn all this into a function
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}
const apiSchedules = api + 'schedules'
export default {
  components: {
    Calendar
  },
  data () {
    return {
      errors: [],
      alert: false,
      schedule: {},
      editTitle: false,
      newTitle: ''
    }
  },
  name: 'Schedules',
  // Investigate alt method where we use the BeforeRouteEnter and BeforeRouteUpdate router guard to make the update
  // https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-after-navigation
  // https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
  watch: {
    // call again the method if the route changes
    '$route': 'getSchedule'
  },
  methods: {
    getSchedule () {
      this.alert = false
      let self = this
      // make api call
      fetch(apiSchedules + '/' + self.$route.params.id, {
        method: 'GET',
        credentials: 'include'
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          if (response.Status !== 'OK') {
            this.errors = response.Errors
            if (response.Status === 'Not Authorized') {
              this.$router.push('/not-authorized')
            }
          } else {
            self.schedule = response.FoundSchedule
          }
        })
    },
    async saveTitle () {
      // Make API call here
      let self = this
      await fetch(apiSchedules + '/' + this.schedule.Id + '/title', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.token
        },
        body: JSON.stringify({ newTitle: self.newTitle })
      })
        .then(function (response) {
          return response.json()
        })
        .then(function (response) {
          if (response.Status !== 'OK') {
            self.newTitle = ''
            self.errors = response.Message
            self.alert = true
          } else {
            self.schedule.Title = self.newTitle
            self.newTitle = ''
          }
        })
      this.editTitle = false
    }
  },
  created () {
    this.getSchedule()
  },
  computed: {
    ...mapGetters({
      token: 'curCSRFToken'
    })
  }
}
</script>

<style scoped>
.schedule-header {
  margin-top: 1%;
  margin-left: 1%;
  margin-right: 1%;
}
.schedule-title {
  display: inline-block;
}
.schedule-links {
  display: inline-block;
}
.schedule-meta {
  display: inline-block;
  width: 100px;
}
#header {
  display: inline-block;
  font-size: 2.5em;
}
#alert {
  background: #fff;
  border-radius: 5px;
  width: 100%;
  position: relative;
}
</style>
