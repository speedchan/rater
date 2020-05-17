<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <NavigationMobile v-if="current_user"></NavigationMobile>
    <v-content class="bg_coral">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from "./views/Navigation";
  import NavigationMobile from "./views/NavigationMobile";
  import { mapState } from 'vuex';

  export default {
    name: 'App',
    components: { Navigation, NavigationMobile },
    computed: {
      ...mapState(['current_user'])
    },
    watch: {
      '$route' (to, from) {
        if (to.meta.title) {
          document.title = `R8r - ${to.meta.title}`
        } else {
          document.title = "R8r - Rate your food!"
        }
      }
    },
  };
</script>

<style scoped type="text/css">
</style>

<style type="text/css">
a {
  text-decoration: none;
}
</style>
