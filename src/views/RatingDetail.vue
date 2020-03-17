<template>
  <v-container class="dashboard_container">
    <v-row>
      <v-col>
        <v-card v-if="rating && !is_edit">
          <v-container class="d-flex align-center">
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">{{ rating.name }} Rating</v-col>
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
                        <v-icon class="pr-2">mdi-text-short</v-icon>
                        {{ rating.name }}
                      </v-col>
                      <v-col cols="12" class="pt-1">
                        <v-icon class="pr-2">mdi-shape</v-icon>
                        {{rating.category}}
                      </v-col>
                      <v-col cols="12" class="pt-1">
                        <v-icon class="pr-2">mdi-map-marker</v-icon>
                        {{rating.location}}
                      </v-col>
                      <v-col cols="12">
                        <v-divider class="mx-4 my-3"></v-divider>
                      </v-col>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">COMMENT</v-col>
                      <v-col cols="12">{{rating.comment}}</v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="hidden-sm-and-up">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12" md="5" class="pl-md-10">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">RATINGS (Avg {{ (rating.ratings.taste + rating.ratings.texture + rating.ratings.portion_size + rating.ratings.looks + rating.ratings.price) / 5 }} <v-icon color="bg_coral">mdi-heart</v-icon>) </v-col>
                  <v-col cols="12">
                    <p class="ratings_label overline">Looks:</p>
                    <v-rating
                          :value="rating.ratings.looks"
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
                  <v-col cols="12">
                    <p class="ratings_label overline">Portion Size:</p>
                    <v-rating
                          :value="rating.ratings.portion_size"
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
                  <v-col cols="12">
                    <p class="ratings_label overline">Price:</p>
                    <v-rating
                          :value="rating.ratings.price"
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
                  <v-col cols="12">
                    <p class="ratings_label overline">Taste:</p>
                    <v-rating
                          :value="rating.ratings.taste"
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
                  <v-col cols="12">
                    <p class="ratings_label overline">Texture:</p>
                    <v-rating
                          :value="rating.ratings.texture"
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
                            {{ votes.upvoters_uid_list.length }}
                            <v-icon small>mdi-heart</v-icon> GIVEN
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

    <!-- EDIT MODE -->
    <div v-if="rating && is_edit">
      <!-- TODO Add permission checks -->
      <v-btn @click="toggle_edit_mode" text>
        <span class="mr-2">Cancel Editing</span>
      </v-btn>
      <br />
      <form @submit.prevent>
        <div>
          <v-avatar size="125">
            <v-img
              :src="cloned_rating.picture_url ? cloned_rating.picture_url : 'https://via.placeholder.com/150'"
            ></v-img>
          </v-avatar>
          <br />name:
          <input type="text" v-model="cloned_rating.name" />
          <br />category:
          <select v-model="cloned_rating.category">
            <option
              v-for="(category, i) in categories"
              :value="category.value"
              :key="i"
            >{{category.name}}</option>
          </select>
          <br />
          <br />
          <place-autocomplete-field
            v-model="cloned_rating.location"
            placeholder="Enter an address, zipcode, or location"
            :api-key="google_places_api_key"
          ></place-autocomplete-field>
          <br />
          <input
            type="text"
            v-model="cloned_rating.comment"
            placeholder="Additional comments here..."
          />
        </div>
        <div>
          Taste - {{cloned_rating.ratings.taste}}:
          <input
            type="range"
            max="5"
            min="1"
            step="1"
            value="5"
            v-model="cloned_rating.ratings.taste"
          />
          <br />
          Texture - {{cloned_rating.ratings.texture}}:
          <input
            type="range"
            max="5"
            min="1"
            step="1"
            value="5"
            v-model="cloned_rating.ratings.texture"
          />
          <br />
          Portion Size - {{cloned_rating.ratings.portion_size}}:
          <input
            type="range"
            max="5"
            min="1"
            step="1"
            value="5"
            v-model="cloned_rating.ratings.portion_size"
          />
          <br />
          Looks - {{cloned_rating.ratings.looks}}:
          <input
            type="range"
            max="5"
            min="1"
            step="1"
            value="5"
            v-model="cloned_rating.ratings.looks"
          />
          <br />
          Price - {{cloned_rating.ratings.price}}:
          <input
            type="range"
            max="5"
            min="1"
            step="1"
            value="5"
            v-model="cloned_rating.ratings.price"
          />
        </div>
        <v-btn @click="update_rating">Finish Rating!</v-btn>
      </form>
    </div>
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
          console.log("Error getting votes: ", error);
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
          console.log("Error when upvoting: ", error);
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
          console.log("Error removing vote: ", error);
        });
    },
    check_user_has_voted() {
      if (this.votes.upvoters_uid_list.includes(this.current_user.uid)) {
        this.has_voted = true;
        this.is_upvote = true;
      }
    },
    toggle_edit_mode() {
      this.is_edit = !this.is_edit;
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
          console.log("Error in updating rating: ", err);
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
    })
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
  /* text-align: center; */
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