<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <NavigationMobile v-if="current_user"></NavigationMobile>
    <v-content>
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
        document.title = "Comparater - " + to.meta.title || 'Comparater'
      }
    },
  };
</script>
