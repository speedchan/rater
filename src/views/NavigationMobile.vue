<template>
  <v-app-bar app dark class="hidden-md-and-up">
    <v-img
      class="mx-2"
      src="https://i.imgur.com/qgGY4tB.png"
      max-height="36"
      max-width="36"
      contain
    ></v-img>
    <v-spacer></v-spacer>
    <v-btn to="/dashboard" text>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'UserDetail', params: { user_uid: current_user.uid }}" text>
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn to="/settings" text>
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-btn @click="logout" text>
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data() {
    return {
      is_display_mobile_nav: false
    };
  },
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clear_current_user_data");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggle_mobile_nav_display() {
      this.is_display_mobile_nav = !this.is_display_mobile_nav;
    }
  },
  computed: {
    ...mapState({
      current_user: "current_user"
    })
  }
};
</script>