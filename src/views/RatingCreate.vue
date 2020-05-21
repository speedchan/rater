<template>
  <v-container class="dashboard_container">
    <!-- TODO Add permission checks, sharing to social media -->
    <v-row>
      <v-col>
        <v-card>
          <v-container class="d-flex align-center">
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">
                <span>Create rating</span>
              </v-col>
              <v-col cols="12" md="7">
                <v-row no-gutters>
                  <v-col cols="12" md="5" class="text-center">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="rating_data.picture_url ? rating_data.picture_url : placeholder_image"
                      ></v-img>
                    </v-avatar>
                    <v-row no-gutters class="pt-2">
                      <v-col cols="12">{{ upload_image_message }}</v-col>
                      <v-col cols="12">
                        <input
                          type="file"
                          style="display:none;"
                          ref="rating_picture_input"
                          accept="image/*"
                          @change="on_rating_picture_selected"
                        />
                        <v-btn @click="open_image_picker" class="ma-2">Select New Image</v-btn>
                      </v-col>
                      <v-col cols="12">
                        <v-btn @click="upload_rating_picture" class="ma-2">Upload Image</v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="hidden-sm-and-up">
                    <v-divider class="mx-4 my-3"></v-divider>
                  </v-col>
                  <v-col cols="12" md="7">
                    <v-row no-gutters>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">INFO</v-col>
                      <v-col cols="12" class="pt-1">
                        <v-text-field
                          prepend-icon="mdi-cube-outline"
                          dense
                          v-model="rating_data.name"
                          placeholder="Rating name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pt-1 text-capitalize">
                        <v-select
                          v-model="rating_data.category"
                          :items="categories"
                          placeholder="Select Category"
                          dense
                          prepend-icon="mdi-tag"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pt-1 info_rows">
                        <span>
                          <v-icon class="mr-2">mdi-map-marker</v-icon>
                          <place-autocomplete-field
                            v-model="rating_data.location"
                            placeholder="Enter an address, zipcode, or location"
                            :api-key="google_places_api_key"
                            class="location_picker"
                          ></place-autocomplete-field>
                        </span>
                      </v-col>

                      <v-col cols="12">
                        <v-divider class="mx-4 my-3"></v-divider>
                      </v-col>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">COMMENT</v-col>
                      <v-col cols="12" class="text-left comment_mobile">
                        <v-textarea
                          v-model="rating_data.comment"
                          dense
                          auto-grow
                          rows="3"
                          row-height="12"
                          class="info_rows"
                          placeholder="Add your comments/description here"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="hidden-sm-and-up">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12" md="5" class="pl-md-10">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">RATINGS</v-col>
                </v-row>
                <v-col
                  cols="12"
                  v-for="(item, key, index) in rating_data.ratings"
                  :key="index"
                  class="py-0"
                >
                  <v-slider
                    v-model="rating_data.ratings[key]"
                    :thumb-size="24"
                    thumb-label="always"
                    ticks="always"
                    step="1"
                    max="5"
                    min="1"
                    track-fill-color="bg_coral"
                    color="bg_coral"
                    v-slot:label
                    tick-size="4"
                    class="pr-md-8"
                  >
                    <p class="overline ratings_label">
                      {{ key|format_rating_name }}
                    </p>
                  </v-slider>
                </v-col>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" class="text-center">
                    <v-btn @click="handle_rating_creation" color="bg_coral" dark width="250px">
                      <v-icon class="pr-1">mdi-content-save</v-icon>
                      Create
                    </v-btn>
                  </v-col>
                </v-row>
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

import Vue from "vue";
import { mapState } from "vuex";
import firebase from "firebase";

import { v1 as uuidv1 } from "uuid";
import VuePlaceAutocomplete from "vue-place-autocomplete";
import placeholder_image from "../assets/images/placeholder.svg"

Vue.use(VuePlaceAutocomplete);

export default {
  data() {
    return {
      placeholder_image: placeholder_image,
      google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
      is_performing_request: false,
      rating_picture: null,
      is_display_rating_image: false,
      upload_image_message: "",
      rating_data: {
        ratings: {
          taste: 3,
          texture: 3,
          portion_size: 3,
          looks: 3,
          price: 3
        },
        name: "",
        category: "",
        location: "",
        comment: "",
        picture_url: ""
      }
    };
  },
  methods: {
    handle_rating_creation: function() {
      this.is_performing_request = true;
      this.create_rating();
    },
    create_rating: function() {
      fb.ratingsCollection
        .add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          picture_url: this.rating_data.picture_url,
          name: this.rating_data.name,
          category: this.rating_data.category,
          location: this.rating_data.location,
          comment: this.rating_data.comment,
          ratings: {
            taste: parseInt(this.rating_data.ratings.taste),
            texture: parseInt(this.rating_data.ratings.texture),
            portion_size: parseInt(this.rating_data.ratings.portion_size),
            looks: parseInt(this.rating_data.ratings.looks),
            price: parseInt(this.rating_data.ratings.price)
          },
          average_rating:
            (parseInt(this.rating_data.ratings.taste) +
              parseInt(this.rating_data.ratings.texture) +
              parseInt(this.rating_data.ratings.portion_size) +
              parseInt(this.rating_data.ratings.looks) +
              parseInt(this.rating_data.ratings.price)) /
            5,
          user_data: {
            uid: this.current_user.uid,
            display_name: this.current_user_profile.display_name,
            full_name: this.current_user_profile.full_name,
            profile_picture: this.current_user_profile.profile_picture
          }
        })
        .then(response => {
          console.log("Rating Created: ", response.id);
          this.create_votes(response.id);
        })
        .catch(err => {
          console.log(err);
          this.is_performing_request = false;
          // this.error_message = err.message
        });
    },
    create_votes: function(rating_id) {
      // Create vote, associate with picture
      fb.votesCollection
        .add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          upvoters_uid_list: [],
          downvoters_uid_list: [],
          rating: rating_id
        })
        .then(response => {
          console.log("Votes object " + response.id + " created");
          this.is_performing_request = false;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.is_performing_request = false;
          console.log("Error creating votes object: ", err);
        });
    },
    open_image_picker() {
      this.$refs.rating_picture_input.click();
    },
    on_rating_picture_selected(event) {
      this.is_display_rating_image = false;
      let files = event.target.files;
      let file_name = files[0].name;
      if (file_name.lastIndexOf(".") <= 0) {
        this.upload_image_message = `Requires valid image extension (.jpg)`;
        return console.log("e400 Requires valid image extension");
      }
      this.upload_image_message = `${file_name} selected`;
      this.rating_picture = files[0];
    },
    upload_rating_picture() {
      // TODO Enforce this flow upon creation/update of images
      // User selects image (No preview, but text says "xxx.jpg selected"), user clicks upload image, if image upload successful, get URL from db, preview image
      console.log("Upload rating picture called");
      let meta_data = { contentType: "image/jpg" };
      let upload_task = fb.storage_ref
        .child(`rating_pictures/${this.current_user.uid}/${uuidv1()}.jpg`)
        .put(this.rating_picture, meta_data);

      upload_task.on(
        "state_changed",
        snapshot => {
          this.upload_image_message = `Upload is ${(snapshot.bytesTransferred /
            snapshot.totalBytes) *
            100}% done`;
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
              this.rating_data.picture_url = picture_url;
              this.is_display_rating_image = true;
              this.upload_image_message = "";
            })
            .catch(error => {
              // TODO Add contact admin area
              this.upload_image_message =
                "Error in retrieving uploaded image. Please contact admins";
            });
        }
      );
    }
  },
  computed: {
    ...mapState({
      current_user: "current_user",
      current_user_profile: "current_user_profile",
      categories: "categories"
    })
  },
  filters: {
    format_rating_name(rating_name) {
      return rating_name.replace(/_/g, ' ');
    },
  }
};
</script>

<style scoped type="scss">
.ratings {
  display: inline;
}
.ratings_label {
  display: inline-block;
  width: 10em;
}
.location_picker {
  display: inline-block;
}
.comment_mobile {
  width: 250px;
}

/* Mobile */
@media (max-width: 575.98px) {
  .dashboard_container {
    width: 100vw;
  }
  .info_rows {
    width: 360px;
  }
}

/* Tablets */
@media (min-width: 576px) {
  .dashboard_container {
    width: 100%;
  }
}

/* Desktops and up */
@media (min-width: 992px) {
  .dashboard_container {
    width: 75%;
  }
}
</style>