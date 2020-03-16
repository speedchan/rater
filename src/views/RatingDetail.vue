<template>
  <v-container class="dashboard_container">
    <v-row>
      <v-col>
        <v-card v-if="rating && !is_edit">
          <v-container class="d-flex align-center">
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">{{ rating.category }} Rating</v-col>
              <v-col cols="7">
                <v-row no-gutters>
                  <v-col cols="5" class="text-center">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="rating.picture_url ? rating.picture_url : 'https://via.placeholder.com/150'"
                        v-show="rating.picture_url"
                      ></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="7">
                    <v-row no-gutters>
                      <v-col cols="12" class="mb-2 subtitle-2">INFO</v-col>
                      <v-col cols="12">{{ rating.name }}</v-col>
                      <v-col cols="12">{{rating.category}}</v-col>
                      <v-col cols="12">{{rating.location}}</v-col>
                      <v-col cols="12">
                        <v-divider class="mx-4 my-3"></v-divider>
                      </v-col>
                      <v-col cols="12" class="mb-2 subtitle-2">COMMENT</v-col>
                      <v-col cols="12">{{rating.comment}}</v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="5" class="pl-md-10">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2 subtitle-2">RATINGS</v-col>
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
                        <v-divider class="mx-10 my-9"></v-divider>
                      </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" class="mx-10">
                        <!-- <div v-if="votes">
        Votes: {{ votes.upvoters_uid_list.length - votes.downvoters_uid_list.length }}
        <div>
          <v-btn @click="upvote" text v-show="!is_upvote">
            <span class="mr-2">UPVOTE</span>
          </v-btn>
          <v-btn @click="remove_vote" text v-show="is_upvote">
            <span class="mr-2">REMOVE VOTE</span>
          </v-btn>
        </div>
      </div> -->
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
      is_downvote: false,
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
            console.log("Get votes: ", this.votes);
          });
        })
        .catch(function(error) {
          console.log("Error getting votes: ", error);
        });
    },
    upvote() {
      // Adds user uid to upvoter's list, removes from downvoter's list
      let vote_document = fb.votesCollection.doc(this.vote_object_id);
      vote_document
        .update({
          upvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(
            this.current_user.uid
          ),
          downvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(
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
    downvote() {
      let vote_document = fb.votesCollection.doc(this.vote_object_id);
      vote_document
        .update({
          downvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(
            this.current_user.uid
          ),
          upvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(
            this.current_user.uid
          )
        })
        .then(() => {
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
        })
        .catch(function(error) {
          console.log("Error when downvoting: ", error);
        });
    },
    remove_vote() {
      let vote_document = fb.votesCollection.doc(this.vote_object_id);
      vote_document
        .update({
          upvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(
            this.current_user.uid
          ),
          downvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(
            this.current_user.uid
          )
        })
        .then(() => {
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
          this.is_downvote = false;
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
        this.is_downvote = false;
      } else if (
        this.votes.downvoters_uid_list.includes(this.current_user.uid)
      ) {
        this.has_voted = true;
        this.is_downvote = true;
        this.is_upvote = false;
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