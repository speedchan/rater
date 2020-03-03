<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from "./views/Navigation";
  import { mapState } from 'vuex';

  export default {
    name: 'App',
    components: { Navigation },
    computed: {
      ...mapState(['current_user'])
    }
  };
</script>
