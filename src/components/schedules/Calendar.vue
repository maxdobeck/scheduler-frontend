<template>
<div class="calendar-container">
  <div class="calendar-date-sidebar">
    <div class="date-hud">
      <div id="date-display" class="date-hud">
        <v-text-field
          v-model="date"
          prepend-icon="event"
          readonly
        ></v-text-field>
      </div>
      <v-btn class="date-hud" color="primary" @click="jumpToToday">Today</v-btn>
    </div>
    <v-date-picker v-model="date"></v-date-picker>
  </div>

  <div class="calendar-pane">
    <div class="calendar-pane-header">
      <v-btn class="header-nav" color="primary" flat @click="bkwdWeek"><v-icon>chevron_left</v-icon></v-btn>
      <h4 class="header-nav"> Week View </h4>
      <v-btn class="header-nav" color="primary" flat @click="fwdWeek"><v-icon>chevron_right</v-icon></v-btn>
    </div>
    <div class="calendar-body">
      <div class="calendar-day">
        <p>Sunday</p>
      </div>
      <div class="calendar-day">
        <p>Monday</p>
      </div>
            <div class="calendar-day">
        <p>Tuesday</p>
      </div>
            <div class="calendar-day">
        <p>Wednesday</p>
      </div>
            <div class="calendar-day">
        <p>Thursday</p>
      </div>
            <div class="calendar-day">
        <p>Friday</p>
      </div>
            <div class="calendar-day">
        <p>Saturday</p>
      </div>
    </div>
  </div>

  <div class="calendar-enrollees-pane">
    <div class="enrollee-pane-header">
      <h4 class="enrollee-nav">Enrollees</h4>

      <div class="enrollee-button-row">
        <v-btn id="add-enrollee" class="enrollee-buttons" slot="activator" small flat color="blue">
          <v-icon>person_add</v-icon>
        </v-btn>

        <v-btn id="sort-enrollee-list" class="enrollee-buttons" slot="activator" small flat color="blue">
          <v-icon>sort</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="enrollee-list">
      <p>You don't have anyone enrolled in this schedule</p>
    </div>
  </div>

</div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      date: moment(new Date()).format('YYYY-MM-DD')
    }
  },
  name: 'Calendar',
  methods: {
    jumpToToday () {
      this.date = moment(new Date()).format('YYYY-MM-DD')
    },
    bkwdWeek () {
      let momentDate = moment(this.date)
      let bkwdJump = momentDate.subtract(1, 'week').format('YYYY-MM-DD')
      this.date = bkwdJump
    },
    fwdWeek () {
      let momentDate = moment(this.date)
      let fwdJump = momentDate.add(1, 'week').format('YYYY-MM-DD')
      this.date = fwdJump
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 900px) {
  .calendar-container {
    overflow: auto;
    width: 100%;
  }
  .calendar-date-sidebar {
    box-sizing: border-box;
    float: left;
    width: 16%;
  }
  .date-hud {
    display: inline-block;
  }
  .calendar-pane {
    box-sizing: border-box;
    border-style: solid;
    border-width: 2px;
    margin-left: 5px;
    margin-right: 5px;
    float: left;
    width: 60%;
  }
  .calendar-pane-header {
    text-align: center;
  }
  .header-nav {
    display: inline-block;
  }
  .calendar-body {
    overflow: hidden;
  }
  .calendar-day {
    float: left;
    width: 14.2%;
    border-width: 1px;
    border-right: dotted;
    text-align: center;
    margin-top: 8px;
  }
  .calendar-enrollees-pane {
    box-sizing: border-box;
    border-style: solid;
    border-width: 2px;
    float: left;
    width: 20%;
  }
  .enrollee-nav {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    margin-right: 5px;
  }
  .enrollee-button-row {
    margin-left: 5px;
  }
  .enrollee-buttons {
    display: inline-block;
    margin: 0px;
    padding: 0px;
  }
  .enrollee-list {
    margin: 8px;
  }
  #date-display {
    width: 140px;
  }
}
</style>
