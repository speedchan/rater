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
                  <v-icon>mdi-square-edit-outline</v-icon> <span v-text="is_edit ? 'Cancel' : 'Edit'"></span>
                </v-btn>
              </v-col>
              <v-col cols="12" class="text-center title subtitle-1">
              </v-col>
              <v-col cols="12" md="7">
                <v-row no-gutters>
                  <v-col cols="12" md="5" class="text-center">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="rating.picture_url ? rating.picture_url : 'https://via.placeholder.com/150'"
                        v-show="rating.picture_url"
                      ></v-img>
                    </v-avatar>
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
                      <v-col cols="12" class="pt-1">
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
                        ></place-autocomplete-field>
                        </span>
                        
                      </v-col>
                      <v-col cols="12">
                        <v-divider class="mx-4 my-3"></v-divider>
                      </v-col>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">COMMENT</v-col>
                      <v-col cols="12" class="text-left comment_mobile">
                        {{ rating.comment }}
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
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">
                    <!-- RATINGS (Avg {{ (rating.ratings.taste + rating.ratings.texture + rating.ratings.portion_size + rating.ratings.looks + rating.ratings.price) / 5 }} <v-icon color="bg_coral">mdi-heart</v-icon>)  -->
                    RATINGS (Avg {{ average_ratings }}<v-icon color="bg_coral">mdi-heart</v-icon>) 
                  </v-col>
                  <v-col cols="12" v-for="(item, key, index) in rating.ratings" :key="index">
                    <p class="ratings_label overline">{{ key }}</p>
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
                        ></v-rating>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12">
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
                            <span>{{ (rating.created == rating.modified) ? (rating.modified|format_date_from_now) : '-' }}</span>
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
      is_edit: false
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
    }
  },
  mounted() {
    // TODO Store currently viewed rating in state, so we don't call so much
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
    }
  },
  filters: {
    format_date(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return moment(timestamp.toDate()).format("D MMM YYYY");
    },
    format_date_from_now(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return moment(timestamp.toDate()).fromNow();
    }
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
  width: 436px;
}
.comment_mobile {
  width: 250px;
}

/* Mobile */
@media (max-width: 575.98px) {
  .dashboard_container {
    width: 100vw;
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