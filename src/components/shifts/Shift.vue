<template>
<div>
  <h1>{{ shift.Title }}</h1>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      shiftURI: '',
      shift: ''
    }
  },
  name: 'Shift',
  watch: {
    '$route': 'setShift'
  },
  methods: {
    async setShift () {
      this.shiftURI = this.$route.params.title
      await this.$store.dispatch('getShifts', this.$route.params.id)
      for (let i in this.shifts) {
        if (this.shifts[i].URI === this.shiftURI) {
          this.shift = this.shifts[i]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      shifts: 'shifts'
    })
  },
  mounted () {
    this.setShift()
  }
}
</script>

<style scoped>
</style>
