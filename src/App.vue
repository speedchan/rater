<template>
  <div id="app">
    <Navigation v-if="current_user"></Navigation>
    <router-view/>
  </div>
</template>

<script>
  // https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase
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
