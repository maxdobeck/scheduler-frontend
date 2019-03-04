<template>
<div>
  <h1>Shifts</h1>
  <div>{{ shifts }}</div>

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
  name: 'Shifts',
  watch: {
    '$route': 'getShifts'
  },
  methods: {
    async getShifts () {
      await this.$store.dispatch('getShifts', this.$route.params.id)
    }
  },
  computed: {
    ...mapGetters({
      shifts: 'shifts'
    })
  },
  mounted () {
    this.getShifts()
  }
}
</script>

<style scoped>
</style>
