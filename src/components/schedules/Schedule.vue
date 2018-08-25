<template>
  <div class="container">
    <p v-show="editTitle === false" @dblclick="editTitle = true" id="header">{{ schedule.Title }}</p>
    <input v-show="editTitle === true"
    v-model="newTitle"
    @keyup.enter = "saveTitle"
    v-on:blur = "editTitle = false"
    placeholder="New Schedule Title"
    id="header">
    <div id="alert" v-show="alert === true">
      <p> {{ errors }} </p>
      <button @click="alert = false">ok</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
            self.errors = response.Errors
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
        body: JSON.stringify({newTitle: self.newTitle})
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
.container {
  width: 100%;
  margin-left: 5%;
  margin-right: 0px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
#header {
  grid-column: 1/3;
  grid-row: 1;
  font-size: 3em;
}
#alert {
  background: #fff;
  border-radius: 5px;
  width: 100%;
  position: relative;
  grid-column: 1/3;
  grid-row: 1;
}
</style>
