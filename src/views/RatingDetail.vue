<template>
  <v-container class="dashboard_container">
    <!-- TODO Add permission checks, sharing to social media -->
    <v-row>
      <v-col>
        <v-card v-if="rating">
          <v-container class="d-flex align-center">
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">
                <span>{{ rating.name }}</span>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn text small color="grey" @click="is_edit=!is_edit" v-if="current_user.uid == rating.user_data.uid" class="px-0 ma-0">
                  <v-icon>{{ is_edit ? 'mdi-cancel' : 'mdi-square-edit-outline' }}</v-icon>
                  <span v-text="is_edit ? 'Cancel' : 'Edit'"></span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="7">
                <v-row no-gutters>
                  <v-col cols="12" md="5" class="text-center">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="rating.picture_url ? rating.picture_url : 'https://via.placeholder.com/150'"
                      ></v-img>
                    </v-avatar>
                    <v-row no-gutters class="pt-2" v-if="is_edit">
                      <v-col cols="12">
                        {{ upload_image_message }}
                      </v-col>
                      <v-col cols="12">
                        <input
                          type="file"
                          style="display:none;"
                          ref="rating_picture_input"
                          accept="image/*"
                          @change="on_new_rating_picture_selected"
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
                        <span v-if="!is_edit">
                        <v-icon class="pr-2">mdi-cube-outline</v-icon>
                          {{ rating.name }}
                        </span>
                        <v-text-field v-if="is_edit" v-model="cloned_rating.name" prepend-icon="mdi-cube-outline" dense></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pt-1 text-capitalize">
                        <span v-if="!is_edit">
                          <v-icon class="pr-2">mdi-tag</v-icon>
                          {{rating.category}}
                        </span>
                        <v-select
                          v-if="is_edit"
                          v-model="cloned_rating.category"
                          :items="categories"
                          placeholder="Select Category"
                          dense
                          prepend-icon="mdi-tag"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pt-1 info_rows">
                        <span v-if="!is_edit">
                          <v-icon class="pr-2">mdi-map-marker</v-icon>
                          {{rating.location}}
                        </span>
                        <span v-if="is_edit">
                          <v-icon class="mr-2">mdi-map-marker</v-icon>
                          <place-autocomplete-field
                          v-model="cloned_rating.location"
                          placeholder="Enter an address, zipcode, or location"
                          :api-key="google_places_api_key"
                          class="location_picker"
                        >
                        </place-autocomplete-field>
                        </span>
                      </v-col>

                      <v-col cols="12">
                        <v-divider class="mx-4 my-3"></v-divider>
                      </v-col>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">COMMENT</v-col>
                      <v-col cols="12" class="text-left comment_mobile">
                        <span v-if="!is_edit">{{ rating.comment }}</span>
                        <v-textarea v-model="cloned_rating.comment" v-if="is_edit" dense auto-grow rows="3" row-height="12" class="info_rows"></v-textarea>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="hidden-sm-and-up">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12" md="5" class="pl-md-10" v-if="!is_edit">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">
                    RATINGS (Avg {{ average_ratings }}<v-icon color="bg_coral">mdi-heart</v-icon>)
                  </v-col>
                  <v-col cols="12" v-for="(item, key, index) in rating.ratings" :key="index">
                    <p class="ratings_label overline">{{ key|format_rating_name }}</p>
                    <v-rating
                          :value="item"
                          length="5"
                          empty-icon="mdi-heart-outline"
                          half-icon="mdi-heart-half-full"
                          full-icon="mdi-heart"
                          :half-increments="true"
                          readonly="readonly"
                          size="22"
                          color="bg_coral"
                          class="ratings"
                          text-capitalize
                        ></v-rating>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="5" class="pl-md-10" v-if="is_edit">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">
                    RATINGS
                  </v-col>
                </v-row>
                <v-col cols="12" v-for="(item, key, index) in cloned_rating.ratings" :key="index" class="py-0">
                     <v-slider
                          v-if="is_edit"
                          v-model="cloned_rating.ratings[key]"
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
                          {{ format_rating_name_method(key) }}
                        </p>
                        </v-slider>
                  </v-col>
                </v-col>


              <v-col cols="12" v-if="!is_edit">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12" v-if="!is_edit">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="my-3 text-md-right">
                    <v-row no-gutters class="d-flex flex-row-reverse flex-md-row">
                      <v-col cols="8" md="10" class="mr-xs-5">
                        <v-row no-gutters>
                          <v-col cols="12">
                            <router-link
                              :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}"
                            >
                              <v-icon>mdi-account</v-icon>
                              {{ rating.user_data.display_name }}
                            </router-link>
                          </v-col>
                          <v-col cols="12" class="text-uppercase overline">
                            Rated
                            <span>{{ rating.created|format_date }}</span>
                          </v-col>
                          <v-col cols="12" class="text-uppercase overline">
                            Edited
                            <span>{{ rating.modified|format_date_from_now }}</span>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="4" md="2" class="text-md-center text-right pr-4 pr-md-0">
                        <v-avatar size="72">
                          <v-img
                            :src="rating.user_data.profile_picture ? rating.user_data.profile_picture : 'https://via.placeholder.com/75'"
                          ></v-img>
                        </v-avatar>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" class="hidden-sm-and-up">
                    <v-divider class="mx-4 my-3"></v-divider>
                  </v-col>

                  <v-col cols="12" md="6" class="my-3 text-md-left">
                    <v-row no-gutters>
                      <v-col cols="12" md="2" class="text-center">
                        <v-btn
                          class="mx-2"
                          fab
                          x-large
                          dark
                          @click="upvote"
                          v-show="!is_upvote"
                          color="grey"
                        >
                          <v-icon>mdi-hand-heart</v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-2"
                          fab
                          x-large
                          dark
                          @click="remove_vote"
                          v-show="is_upvote"
                          color="bg_coral"
                        >
                          <v-icon>mdi-hand-heart</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-row no-gutters v-if="votes">
                          <v-col cols="12" class="text-center text-md-left my-md-0 mt-3">
                            {{ votes.upvoters_uid_list.length }} {{ (votes.upvoters_uid_list.length > 1) || (votes.upvoters_uid_list.length == 0)  ? 'users': 'user' }} have said this rating was helpful
                          </v-col>
                          <v-col cols="12" class="text-uppercase overline text-center text-md-left">
                            <span v-show="!is_upvote">Show some love if you've enjoyed this rating!</span>
                            <span
                              v-show="is_upvote"
                            >{{ rating.user_data.display_name }} appreciates the love!</span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="is_edit">
                <v-row no-gutters>
                  <v-col cols="12" class="text-center">
                     <v-btn @click="handle_update_rating" color="bg_coral" dark width="250px">
                       <v-icon class="pr-1">mdi-content-save</v-icon>
                       Update Rating
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
import firebase from "firebase";
import Vue from "vue";
import moment from "moment";
import { mapState } from "vuex";
import { v1 as uuidv1 } from "uuid";
import VuePlaceAutocomplete from "vue-place-autocomplete";

Vue.use(VuePlaceAutocomplete);

export default {
  data() {
    return {
      google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
      rating: null,
      cloned_rating: null,
      votes: null,
      vote_object_id: "",
      has_voted: false,
      is_upvote: false,
      is_edit: false,
      new_rating_picture: null,
      is_show_new_rating_picture: false,
      upload_image_message: '',
    };
  },
  methods: {
    get_rating_by_id() {
      let rating_id = this.$route.params.rating_id;
      fb.ratingsCollection
        .doc(rating_id)
        .get()
        .then(response => {
          if (response.exists) {
            // TODO Store currently viewed rating in state to reduce amount of calls
            this.rating = response.data();
            this.cloned_rating = response.data();
            console.log("Get rating by ID: ", this.rating);
            this.get_associated_votes_document(rating_id);
          } else {
            console.log(`Failed to get rating with ID matching ${rating_id}`);
            this.$router.push("/dashboard");
          }
        });
    },
    get_associated_votes_document(rating_id) {
      fb.votesCollection
        .where("rating", "==", rating_id)
        .get()
        .then(queryset => {
          queryset.forEach(doc => {
            // There should only be one object, so this forEach is safe
            this.vote_object_id = doc.id;
            this.votes = doc.data();
            this.check_user_has_voted();
          });
        })
        .catch(function(error) {
          console.log("e404 Error getting votes: ", error);
        });
    },
    upvote() {
      // Adds user uid to upvoter's list
      let vote_document = fb.votesCollection.doc(this.vote_object_id);
      vote_document
        .update({
          upvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(
            this.current_user.uid
          )
        })
        .then(() => {
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
        })
        .catch(function(error) {
          console.log("e400 Error when upvoting: ", error);
        });
    },
    remove_vote() {
      let vote_document = fb.votesCollection.doc(this.vote_object_id);
      vote_document
        .update({
          upvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(
            this.current_user.uid
          )
        })
        .then(() => {
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
          this.is_upvote = false;
        })
        .catch(function(error) {
          console.log("e400 Error removing vote: ", error);
        });
    },
    check_user_has_voted() {
      if (this.votes.upvoters_uid_list.includes(this.current_user.uid)) {
        this.has_voted = true;
        this.is_upvote = true;
      }
    },
    update_rating() {
      let rating_id = this.$route.params.rating_id;
      fb.ratingsCollection
        .doc(rating_id)
        .set(this.cloned_rating)
        .then(() => {
          // TODO Add loading
          this.is_edit = false;
          this.rating = this.cloned_rating;
          console.log("Rating updated successfully!");
        })
        .catch(err => {
          console.log("e400 Error in updating rating: ", err);
        });
    },
    format_rating_name_method(rating_name) {
      return rating_name.replace(/_/g, ' ').toUpperCase();
    },
    open_image_picker() {
      this.$refs.rating_picture_input.click();
    },
    upload_rating_picture() {
      // TODO Enforce this flow upon creation/update of images
      // User selects image (No preview, but text says "xxx.jpg selected"), user clicks upload image, if image upload successful, get URL from db, preview image
      console.log("Upload rating picture called");
      let meta_data = { contentType: "image/jpg" };
      let upload_task = fb.storage_ref
        .child(`rating_pictures/${this.current_user.uid}/${uuidv1()}.jpg`)
        .put(this.new_rating_picture, meta_data);
      upload_task.on(
        "state_changed",
        snapshot => {
          this.upload_image_message =  `Upload is ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}% done, please wait...`;
        },
        error => {
          console.log("e400 Error in uploading image", error);
              this.upload_image_message = 'Error in uploading image. Please try again.';
        },
        () => {
          upload_task.snapshot.ref
            .getDownloadURL()
            .then(picture_url => {
              this.rating.picture_url = picture_url;
              this.cloned_rating.picture_url = picture_url;
              this.is_show_new_rating_picture = true;
              this.upload_image_message = ''; 
            })
            .catch(error => {
              // TODO Add contact admin area
              this.upload_image_message = 'Error in retrieving uploaded image. Please contact admins';
            });
        }
      );
    },
    on_new_rating_picture_selected(event) {
      this.is_display_rating_image = false;
      let files = event.target.files;
      let file_name = files[0].name;
      if (file_name.lastIndexOf(".") <= 0) {
        this.upload_image_message = `Requires valid image extension (.jpg)`;
        return console.log("e400 Requires valid image extension");
      }
      this.upload_image_message = `${file_name} selected`;
      this.new_rating_picture = files[0];
    },
    handle_update_rating() {
      this.update_rating();
    },
    update_rating() {
      this.cloned_rating.modified = firebase.firestore.Timestamp.now();
      this.cloned_rating.average_rating = Object.values(this.cloned_rating.ratings).reduce((a, b) => a + b, 0) / 5;
      
      fb.ratingsCollection.doc(this.$route.params.rating_id).update(this.cloned_rating)
      .then(rating => {
        this.rating = this.cloned_rating;
        this.is_edit = false;
      })
      .catch(err => {
        console.log("e400 error updating user profile ", err)
      })
    },
    remove_rating_picture() {
      this.cloned_rating.picture_url = '';
    }
  },
  mounted() {
    this.get_rating_by_id();
  },
  computed: {
    ...mapState({
      current_user: "current_user",
      categories: "categories"
    }),
    average_ratings() {
      let total_ratings = 0;
      if (this.rating) {
        Object.values(this.rating.ratings).forEach(value => {
          total_ratings += value;
        })
      }
      return (total_ratings / 5)
    }
  },
  watch: {
    votes: function(new_value, old_value) {
      if (new_value != null) {
        this.check_user_has_voted();
      }
    },
  },
  filters: {
    format_date(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return moment(timestamp.toDate()).format("D MMM YYYY");
    },
    format_rating_name(rating_name) {
      return rating_name.replace(/_/g, ' ');
    },
    format_date_from_now(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return moment(timestamp.toDate()).fromNow();
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
.asdf {
  width: 10em;
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