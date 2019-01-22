<template>
<div class="calendar-container">
  <div class="calendar-date-sidebar">
    <div class="date-hud">
      <div id="date-display" class="date-hud">
        <v-text-field
          v-model="littleEndianDate"
          prepend-icon="event"
          readonly
        ></v-text-field>
      </div>
      <v-btn class="date-hud" color="primary" @click="jumpToToday">Today</v-btn>
    </div>
    <v-date-picker v-model="date"></v-date-picker>
    <div class="calendar-enrollees-pane">
      <h4 class="enrollee-nav">Enrollees</h4>
        <div class="enrollee-button-row">
          <v-btn id="add-enrollee" class="enrollee-buttons" slot="activator" small flat color="primary">
            <v-icon>person_add</v-icon>
          </v-btn>

          <v-btn id="sort-enrollee-list" class="enrollee-buttons" slot="activator" small flat color="primary">
            <v-icon>sort</v-icon>
          </v-btn>
        </div>
      <div class="enrollee-list">
        <p>You don't have anyone enrolled in this schedule</p>
      </div>
    </div>
  </div>

  <div class="calendar-pane">
    <div class="calendar-pane-header">
      <v-btn class="header-nav" color="primary" flat @click="bkwdWeek"><v-icon>chevron_left</v-icon></v-btn>
      <h4 class="header-nav"> {{ selectedMonth }} </h4>
      <v-btn class="header-nav" color="primary" flat @click="fwdWeek"><v-icon>chevron_right</v-icon></v-btn>
      <router-link :to="{ path: 'shifts/new' }" append>
        <v-btn class="header-nav" color="primary" flat>
          New Shift
        </v-btn>
      </router-link>
    </div>
    <div class="calendar-body">
      <table>
        <thead>
          <tr>
            <th>Sunday {{ sunDate.format('DD') }}</th>
            <th>Monday {{ monDate.format('DD') }}</th>
            <th>Tuesday {{ tueDate.format('DD') }}</th>
            <th>Wednesday {{ wedDate.format('DD') }}</th>
            <th>Thursday {{ thuDate.format('DD') }}</th>
            <th>Friday {{ friDate.format('DD') }}</th>
            <th>Saturday {{ satDate.format('DD') }}</th>
          </tr>
        </thead>
        <tbody>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Sun && stopDateCheck(shift.Stop, sunDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Mon && stopDateCheck(shift.Stop, sunDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Tue && stopDateCheck(shift.Stop, tueDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Wed && stopDateCheck(shift.Stop, wedDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Thur && stopDateCheck(shift.Stop, thuDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Fri && stopDateCheck(shift.Stop, friDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
          <td>
            <ul v-for="shift in shifts" :key="shift.id">
              <li v-if="shift.Sat && stopDateCheck(shift.Stop, satDate)">
                {{ shift.Title }}
              </li>
            </ul>
          </td>
        </tbody>
      </table>
    </div>
  </div>

</div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      date: moment(new Date()).format('YYYY-MM-DD'),
      cells: 24,
      scheduleID: ''
    }
  },
  name: 'Calendar',
  methods: {
    jumpToToday () {
      this.date = moment(new Date()).format('YYYY-MM-DD')
    },
    bkwdWeek () {
      let curMoment = moment(this.date)
      let bkwdJump = curMoment.subtract(1, 'week').format('YYYY-MM-DD')
      this.date = bkwdJump
    },
    fwdWeek () {
      let curMoment = moment(this.date)
      let fwdJump = curMoment.add(1, 'week').format('YYYY-MM-DD')
      this.date = fwdJump
    },
    newShift () {
      this.$router.push(`/schedules/${this.$route.params.id}/shifts/new`)
    },
    stopDateCheck: function (stop, cur) {
      return moment(stop, 'YYYY-MM-DD').isAfter(cur)
    }
  },
  computed: {
    littleEndianDate () {
      return moment(this.date).format('DD-MM-YYYY')
    },
    selectedMonth () {
      let today = moment(this.date).month()
      return moment().month(today).format('MMMM')
    },
    sunDate () {
      return moment(this.date).startOf('week')
    },
    monDate () {
      return moment(this.date).startOf('week').add(1, 'days')
    },
    tueDate () {
      return moment(this.date).startOf('week').add(2, 'days')
    },
    wedDate () {
      return moment(this.date).startOf('week').add(3, 'days')
    },
    thuDate () {
      return moment(this.date).startOf('week').add(4, 'days')
    },
    friDate () {
      return moment(this.date).startOf('week').add(5, 'days')
    },
    satDate () {
      return moment(this.date).endOf('week')
    },
    ...mapGetters({
      shifts: 'shifts'
    })
  },
  mounted () {
    this.scheduleID = this.$route.params.id
  }
}
</script>

<style scoped>
@media screen and (min-width: 990px) {
  table {
    table-layout: fixed;
    width: 100%;
    border-spacing: 0px;
  }
  th {
    padding-top: 4px;
  }
  .calendar-container {
    overflow: hidden;
    width: 100%;
  }
  .calendar-date-sidebar {
    box-sizing: border-box;
    float: left;
    min-width: 150px;
    width: 12%;
    position: fixed;
  }
  .date-hud {
    display: inline-block;
  }
  .enrollee-nav {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0px;
    margin-right: 0px;
  }
  .enrollee-button-row {
    margin-left: 0px;
  }
  .enrollee-buttons {
    display: inline-block;
    margin: 0px;
    padding: 0px;
  }
  .enrollee-list {
    margin: 8px;
  }
  .calendar-pane {
    box-sizing: border-box;
    margin-left: 300px;
    width: 80%;
  }
  .calendar-pane-header {
    text-align: center;
  }
  .header-nav {
    display: inline-block;
  }
  #date-display {
    width: 140px;
  }
}
</style>
