<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <NavigationMobile v-if="current_user"></NavigationMobile>
    <v-content>
      <v-container fluid class="bg_coral">
        <router-view/>
      </v-container>
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
    }
  };
</script>
