<template>
  <div class="schedule-container">
    <v-layout row wrap id="header">
      <h1 class="page-title">Schedules</h1>
      <v-btn @click="newSchedule" flat id="new-schedule" color="primary">New Schedule</v-btn>
    </v-layout>

    <div class="list-container">
      <ul id="schedule-list">
        <li v-for="schedule in schedules" :key="schedule.id" class="schedule">
          <router-link :to='`/schedules/${schedule.Id}`'>{{ schedule.Title }}</router-link>
          <v-btn @click="deleteConfirmation(schedule)" flat color="error">Delete</v-btn>
          <v-dialog
            @keydown.esc="delModal = false"
            v-model="delModal"
            max-width="290"
          >
            <v-card id="modal">
              <p>Are you sure you want to delete: "{{ scheduleToDelete.Title }}"</p>
              <v-btn color="error" @click="deleteSchedule(scheduleToDelete.Id)">Delete</v-btn>
              <v-btn @click.stop="delModal = false;">Cancel</v-btn>
            </v-card>
          </v-dialog>
        </li>
      </ul>
      <p v-if="schedules.length < 1">No Schedules found</p>
    </div>
  </div>
</template>

<script>
import store from '../../store/index'
import { mapGetters } from 'vuex'
let api // Need to find a way to turn all this into a function
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else {
  api = process.env.PROD_API
}
const apiDeleteSchedule = api + 'schedules'
export default {
  data () {
    return {
      errors: [],
      delModal: false,
      alert: false,
      scheduleToDelete: ''
    }
  },
  name: 'Schedules',
  methods: {
    newSchedule () {
      this.$router.push('/schedules/new')
    },
    deleteConfirmation (schedule) {
      this.delModal = true
      this.scheduleToDelete = schedule
    },
    deleteSchedule (scheduleID) {
      // make api call
      fetch(apiDeleteSchedule + '/' + scheduleID, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.token
        }
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          if (response.Status !== 'OK') {
            this.errors = response.Errors
            this.alert = true
          } else {
            this.delModal = false
            store.dispatch('getOwnedSchedules', store.getters.curMemberId)
          }
        })
    }
  },
  computed: {
    ...mapGetters({
      memberID: 'curMemberId',
      schedules: 'ownedSchedules',
      token: 'curCSRFToken'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .schedule-container {
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
  .schedule {
    list-style: none;
    font-size: 2em;
  }
  #modal {
    padding: 20px;
}
</style>
