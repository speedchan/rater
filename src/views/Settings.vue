<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">Settings</v-col>
              <v-col cols="12" md="6" class="text-left text-md-right pr-md-4">
                <v-row no-gutters>
                  <v-col cols="12" md="4" class="offset-md-8 text-center mb-1">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="current_user_profile.profile_picture"
                        alt="Current profile picture"
                      ></v-img>
                    </v-avatar>
                    <input
                      type="file"
                      style="display:none;"
                      ref="profile_picture_input"
                      accept="image/*"
                      @change="on_new_profile_picture_selected"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-row no-gutters>
                      <v-col
                        cols="12"
                        md="4"
                        class="offset-md-8 text-center my-1"
                      >{{ upload_image_message }}</v-col>
                      <v-col cols="12" md="4" class="offset-md-8 text-center my-1">
                        <v-btn @click="open_image_picker">Select New Image</v-btn>
                      </v-col>
                      <v-col cols="12" md="4" class="offset-md-8 text-center my-1">
                        <v-btn @click="upload_profile_picture">Upload Image</v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="text-left text-md-left pl-md-7">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">INFO</v-col>
                  <v-col cols="12" class="pt-1 text-capitalize">
                    <v-text-field
                      prepend-icon="mdi-face"
                      dense
                      class="text_fields"
                      v-model="current_user_profile.full_name"
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pt-1 text-capitalize">
                    <v-text-field
                      prepend-icon="mdi-domino-mask"
                      dense
                      class="text_fields"
                      v-model="current_user_profile.display_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pt-1 text-capitalize">
                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                    <country-select
                      v-model="country"
                      :country="current_user_profile.country"
                      :countryName="true"
                      class="country_selector"
                      :removePlaceholder="true"
                      id="country"
                    ></country-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters class="text-center">
              <v-col cols="12">
                <v-btn @click="update_user_profile" class="button mt-6" color="bg_coral" dark :loading="is_updating">Update Profile</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
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
      profile_picture_url: "",
      profile_picture: null,
      new_profile_picture: null,
      is_show_new_profile_picture: false,
      upload_image_message: "",
      country: '',
      is_updating: false
    };
  },
  methods: {
    update_user_profile() {
      this.is_updating = true;
      console.log(this.is_updating)
      this.$store.dispatch("update_user_profile", {
        full_name: this.current_user_profile.full_name,
        display_name:  this.current_user_profile.display_name,
        country: this.country
      })
    },
    open_image_picker() {
      this.$refs.profile_picture_input.click();
    },
    on_new_profile_picture_selected(event) {
      let files = event.target.files;
      let file_name = files[0].name;
      if (file_name.lastIndexOf(".") <= 0) {
        this.upload_image_message = `Requires valid image extension (.jpg)`;
        return console.log("e400 Requires valid image extension");
      }
      this.upload_image_message = `${file_name} selected`;
      this.new_profile_picture = files[0];
    },
    upload_profile_picture() {
      // User selects image (No preview, but text says "xxx.jpg selected"), user clicks upload image, if image upload successful, get URL from db, preview image
      let meta_data = { contentType: "image/jpg" };
      let upload_task = fb.storage_ref
        .child(`profile_pictures/${this.current_user.uid}.jpg`)
        .put(this.new_profile_picture, meta_data);
      upload_task.on(
        "state_changed",
        snapshot => {
          this.upload_image_message = `Upload is ${(snapshot.bytesTransferred /
            snapshot.totalBytes) *
            100}% done, please wait...`;
        },
        error => {
          console.log("e400 Error in uploading image", error);
          this.upload_image_message =
            "Error in uploading image. Please try again.";
        },
        () => {
          upload_task.snapshot.ref
            .getDownloadURL()
            .then(picture_url => {
              this.current_user_profile.profile_picture = picture_url;
              this.is_show_new_profile_picture = true;
              this.upload_image_message = "";
            })
            .catch(error => {
              this.upload_image_message =
                "Error in retrieving uploaded image. Please contact admins";
            });
        }
      );
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

<style lang="scss" scoped>
.text_fields {
  width: 450px;
}
.country_selector {
  width: 330px;
  height: 30px;
  padding: 5px;
  border-bottom: 1px solid grey;
}


/* Tablets */
@media (min-width: 576px) {
  .dashboard_container {
    width: 100%;
  }
  .country_selector {
    width: 425px;
    height: 30px;
    padding: 5px;
    border-bottom: 1px solid grey;
  }
}
</style>