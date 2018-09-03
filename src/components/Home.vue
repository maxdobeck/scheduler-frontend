<template>
  <v-container align-content-center>
    <v-layout column>
      <v-flex>
        <h1 id="homeTitle">Hi {{ username }}, scheduling is hard</h1>
      </v-flex>
      <v-flex>
        <h2 id="homeSub">Let us help!</h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  name: 'Home',
  computed: {
    ...mapGetters({
      username: 'memberName'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#homeTitle {
  text-align: center;
}
#homeSub {
  text-align: center;
}
</style>
