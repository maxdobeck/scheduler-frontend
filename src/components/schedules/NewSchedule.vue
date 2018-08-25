<template>
  <div class="container">
    <h3 id="header">Create a new Schedule</h3>
    <div id="new-schedule-deets">
      <v-card id="modal">
        <h3>Schedule Name</h3>
        <v-text-field
        autofocus
        v-model="newScheduleTitle">
        </v-text-field>
        <v-btn @click="saveSchedule">Save</v-btn>
      </v-card>
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
const apiNewSchedule = api + 'schedules'
export default {
  data () {
    return {
      errors: [],
      newScheduleTitle: ''
    }
  },
  name: 'NewSchedule',
  methods: {
    async saveSchedule () {
      // make api call
      await fetch(apiNewSchedule, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.token
        },
        body: JSON.stringify({OwnerID: this.memberID, Title: this.newScheduleTitle})
      })
        .then(response => {
          this.emailModal = false
          return response.json()
        })
        .then(response => {
          if (response.Status !== 'OK') {
            this.errors = response.Errors
          } else {
            this.newScheduleTitle = ''
            this.$router.push('/schedules')
          }
        })
    }
  },
  computed: mapGetters({
    token: 'curCSRFToken',
    memberID: 'curMemberId'
  })
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
#header {
  grid-column: 2/3;
  grid-row: 1;
}
.list-container {
  grid-column: 2/3;
  grid-row: 2;
}
#new-schedule-deets {
  grid-column: 2/3;
  grid-row: 2;
}
</style>
