<template>
  <div>
    <div id="new-shift-container">
      <v-card class="new-shift-form">
        <p class="new-shift-title">Shift Title</p>
        <v-text-field
        class="new-shift-title-input"
        autofocus
        v-model="title">
        </v-text-field>

        <div class="weekdays-active">
          <p><b>Shift Days</b></p>
          <div class="weekday-selector">
            <p>Sunday</p>
            <v-checkbox
              v-model="weekdays"
              value="Sunday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p class="day">Monday</p>
            <v-checkbox
              class="day"
              v-model="weekdays"
              value="Monday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p>Tuesday</p>
            <v-checkbox
              v-model="weekdays"
              value="Tuesday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p>Wednesday</p>
            <v-checkbox
              v-model="weekdays"
              value="Wednesday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p>Thursday</p>
            <v-checkbox
              v-model="weekdays"
              value="Thursday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p>Friday</p>
            <v-checkbox
              v-model="weekdays"
              value="Friday"
            ></v-checkbox>
          </div>

          <div class="weekday-selector">
            <p>Saturday</p>
            <v-checkbox
              v-model="weekdays"
              value="Saturday"
            ></v-checkbox>
          </div>
        </div>

        <div class="shift-duration">
          <v-menu
            ref="start_menu"
            class="shift-time-input"
            :close-on-content-click="false"
            v-model="start_modal"
            :nudge-right="40"
            :return-value.sync="start_time"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="start_time"
              label="Start Time"
              prepend-icon="access_time"
              readonly
            ></v-text-field>
            <v-time-picker
              v-if="start_modal"
              v-model="start_time"
              format="24hr"
              @change="$refs.start_menu.save(start_time)"></v-time-picker>
          </v-menu>
          <p class="shift-start-end"> - </p>
          <v-menu
            ref="end_menu"
            class="shift-time-input"
            :close-on-content-click="false"
            v-model="end_modal"
            :nudge-right="40"
            :return-value.sync="end_time"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="end_time"
              label="End Time"
              prepend-icon="access_time"
              readonly
            ></v-text-field>
            <v-time-picker v-if="end_modal" v-model="end_time" format="24hr" @change="$refs.end_menu.save(end_time)"></v-time-picker>
          </v-menu>
        </div>

        <div class="shift-end-date">
          <p><b>What date should this shift stop? Defaults to infinite and does not stop.</b></p>
          <p><i>Ignore this unless you know a firm end date.</i></p>
          <v-menu
            ref="end_date"
            class="shift-time-input"
            :close-on-content-click="false"
            v-model="stop_date_menu"
            :return-value.sync="start_time"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="end_date"
              label="Stop Date"
              readonly
            ></v-text-field>
            <v-date-picker v-model="end_date"></v-date-picker>
          </v-menu>
        </div>

        <div class="shift-min-enrollees">
          <p><b>Number of Enrollees?</b></p>
          <p><i>If you set it to 1 and someone isn't assigned then a warning will be generated.</i></p>
          <p><i>This includes anyone who takes PTO and was previously assigned to this shift.</i></p>
          <v-text-field
            class="min-enrollee-input"
            v-model="min_enrollees">
          </v-text-field>
        </div>

        <div class="new-shift-save">
          <v-btn @click="saveShift" color="#B5E584">Save</v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
let api // Need to find a way to turn all this into a function
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  api = process.env.DEV_API
} else if (process.env.NODE_ENV === 'test') {
  api = process.env.TEST_API
} else if (process.env.NODE_ENV === 'production') {
  api = process.env.PROD_API
}
const apiNewShift = api + 'schedules'
export default {
  data () {
    return {
      title: '',
      weekdays: [],
      start_time: null,
      end_time: null,
      end_date: moment(new Date('2099', '00', '01')).format('YYYY-MM-DD'),
      min_enrollees: '',
      start_modal: false,
      end_modal: false,
      stop_date_menu: false
    }
  },
  name: 'NewShift',
  methods: {
    async saveShift () {
      let self = this
      await fetch(apiNewShift + '/' + self.$route.params.id + '/shifts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.token
        },
        body: JSON.stringify({
          Title: this.title,
          Schedule: self.$route.params.id,
          Days: this.weekdays,
          Start: this.start_time,
          End: this.end_time,
          Stop: this.end_date,
          MinEnrollees: this.min_enrollees
        })
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          if (response.status !== 'OK') {
            this.errors = response.Errors
          } else {
            this.clearForm()
            this.$router.push('/schedules/' + self.$route.params.id)
          }
        })
    },
    clearForm () {
      this.title = ''
      this.weekdays = []
      this.start_time = null
      this.end_time = null
      this.end_date = moment(new Date('2099', '00', '01')).format('YYYY-MM-DD')
      this.min_enrollees = ''
      this.start_modal = false
      this.end_modal = false
      this.stop_date_menu = false
    }
  },
  computed: mapGetters({
    token: 'curCSRFToken',
    memberID: 'curMemberId'
  })
}
</script>

<style scoped>
.new-shift-form {
  margin-top: 5%;
  width: 80%;
}
.new-shift-title {
  width: 35%;
  margin-left: 20%;
  padding-top: 2%;
  font-weight: bold;
}
.new-shift-title-input {
  width: 40%;
  margin-left: 20%;
}
.weekdays-active {
  width: 80%;
  margin-left: 20%;
}
.weekday-selector {
  display: inline-block;
  padding-left: 4px;
  padding-right: 4px;
}
.shift-duration {
  margin-left: 20%;
  font-weight: bold;
}
.shift-time-input {
  width:15%;
  display: inline-block;
}
.shift-start-end {
  display: inline-block;
}
.shift-end-date {
  width: 80%;
  margin-left: 20%;
}
.shift-min-enrollees {
  width: 80%;
  margin-left: 20%;
}
.min-enrollee-input {
  width: 5%;
}
.new-shift-save {
  margin-left: 19%;
  padding-bottom: 2%;
}
#new-shift-container {
  width: 100%;
  margin-left: 2%;
  margin-right: 2%;
}
</style>
