<template>
  <div id="app">
    <Navigation v-if="current_user"></Navigation>
    <div v-if="current_user">{{ current_user }} - {{ current_user.email }}</div>
    <router-view/>
  </div>
</template>

<script>
  // https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase
  // https://rapidapi.com/dmchale.dev/api/retro-avatar-generator
  import Navigation from "./views/Navigation";
  import { mapState } from 'vuex';

  export default {
    components: {Navigation},
    computed: {
      ...mapState(['current_user'])
    }
  }
</script>

<style lang="scss">

</style>
