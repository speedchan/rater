<template>
  <v-layout class="hidden-md-and-up">
    <v-app-bar app color="primary" dark width="100vw">
      <v-toolbar-title>Comparater Mobile</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="toggle_mobile_nav_display"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer absolute temporary right v-model="is_display_mobile_nav">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Comparater
          </v-list-item-title>
          <v-list-item-subtitle>
            Compare, rate, vote!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'UserDetail', params: { user_uid: current_user.uid }}">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/settings">
          <v-list-item-icon>
            <v-icon>mdi-account-details</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
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
      }
    },
    computed: {
      ...mapState({
        current_user: 'current_user'
      })
    }
  }
</script>