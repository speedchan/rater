<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <NavigationMobile v-if="current_user" @is_display_mobile_nav="toggle_drawer_visibility"></NavigationMobile>
    <NavigationDrawer v-if="current_user" :is_drawer_visible="is_drawer_visible"></NavigationDrawer>
    <v-content class="bg_coral">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from "./views/Navigation";
  import NavigationMobile from "./views/NavigationMobile";
  import NavigationDrawer from "./views/NavigationDrawer";
  import { mapState } from 'vuex';

  export default {
    name: 'App',
    components: { Navigation, NavigationDrawer, NavigationMobile },
    computed: {
      ...mapState(['current_user'])
    },
    watch: {
      '$route' (to, from) {
        document.title = "Comparater - " + to.meta.title || 'Comparater'
      }
    },
    data() {
      return {
        is_drawer_visible: false
      }
    },
    methods: {
      toggle_drawer_visibility(value) {
        console.log("nan-e: ", value);
        this.is_drawer_visible = value;
      }
    }
  };
</script>

<style scoped type="text/css">
</style>
