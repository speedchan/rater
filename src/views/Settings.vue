<template>
  <v-container>
    <h4>Settings</h4>
    <div>
      <form @submit.prevent>
        <v-avatar size="125">
          <v-img :src="current_user_profile.profile_picture" alt="didnt have no pp"></v-img>
        </v-avatar>

        <v-avatar size="125">
          Preview
          <v-img :src="profile_picture_url" alt="didnt have no pp2"></v-img>
        </v-avatar>

        <label for="full_name">Full Name</label>
        <input type="text" v-model.trim="current_user_profile.full_name" placeholder="Full Name" />
        <label for="full_name">Display Name</label>
        <input
          type="text"
          v-model.trim="current_user_profile.display_name"
          placeholder="Display Name"
        />
        <label for="country">Country</label>
        <country-select
          v-model="current_user_profile.country"
          id="country"
          :countryName="true"
          :removePlaceholder="true"
        ></country-select>
        <v-btn @click="open_image_picker">Upload image</v-btn>
        <input
          type="file"
          style="display:none;"
          ref="profile_picture_input"
          accept="image/*"
          @change="on_profile_picture_selected"
        />

        <br />
        <br />
        <v-btn @click="update_user_profile" class="button">Update Profile</v-btn>
      </form>
    </div>
  </v-container>
</template>

<script>
const fb = require("../firebaseConfig.js");

import { mapState } from "vuex";
import Vue from "vue";
import vueCountryRegionSelect from "vue-country-region-select";

Vue.use(vueCountryRegionSelect);

export default {
  data() {
    return {
      full_name: "",
      display_name: "",
      country: "",
      profile_picture_url: "",
      profile_picture: null
    };
  },
  methods: {
    update_user_profile() {
      // Update profile picture if applicable
      if (this.profile_picture) {
        this.$store.dispatch("update_user_profile_picture", {
          profile_picture: this.profile_picture
        });
      }

      // Update profile
      this.$store.dispatch("update_user_profile", {
        full_name: this.full_name
          ? this.full_name
          : this.current_user_profile.full_name,
        display_name: this.display_name
          ? this.display_name
          : this.current_user_profile.display_name,
        country: this.country ? this.country : this.current_user_profile.country
      });

      this.full_name = "";
      this.display_name = "";
      this.profile_picture = null;
      this.profile_picture_url = "";
    },
    open_image_picker() {
      this.$refs.profile_picture_input.click();
    },
    on_profile_picture_selected(event) {
      let file_reader = new FileReader();
      let files = event.target.files;
      let file_name = files[0].name;
      if (file_name.lastIndexOf(".") <= 0) {
        console.log("e400 Requires valid image extension");
      }
      file_reader.addEventListener("load", () => {
        this.profile_picture_url = file_reader.result;
      });
      file_reader.readAsDataURL(files[0]);
      this.profile_picture = files[0];
    }
  },
  computed: {
    ...mapState({
      current_user_profile: "current_user_profile",
      current_user: "current_user"
    })
  }
};
</script>