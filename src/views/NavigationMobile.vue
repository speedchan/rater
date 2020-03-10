<template>
  <v-app-bar app dark class="hidden-md-and-up">
    <v-toolbar-title>Comparater Mobile</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-app-bar-nav-icon @click="toggle_mobile_nav_display"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
  const fb = require('../firebaseConfig.js');
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        is_display_mobile_nav: false
      }
    },
    methods: {
      logout() {
        fb.auth.signOut().then(() => {
          this.$store.dispatch('clear_current_user_data');
          this.$router.push('/login');
        }).catch(err => {
          console.log(err)
        })
      },
      toggle_mobile_nav_display() {
        this.is_display_mobile_nav = !this.is_display_mobile_nav;
        this.$emit('is_display_mobile_nav', this.is_display_mobile_nav);
      }
    },
    computed: {
      ...mapState({
        current_user: 'current_user'
      })
    }
  }
</script>