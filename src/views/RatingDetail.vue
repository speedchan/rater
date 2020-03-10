<template>
  <v-container>
    <div v-if="rating && !is_edit">
      <v-btn @click="toggle_edit_mode" text>
        <span class="mr-2">Edit Rating</span>
      </v-btn>
      <br>
      {{ rating.name }} <br>
      {{rating.category}} <br>
      <router-link :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}" text>
        <span class="mr-2">{{rating.user_data.display_name}}</span>
      </router-link>
      <br>
      {{rating.user_data.full_name}} <br>
      {{rating.comment}} <br>


      <div>
        Looks: {{rating.ratings.looks}}
        Portion Size: {{rating.ratings.portion_size}}
        Price: {{rating.ratings.price}}
        Taste: {{rating.ratings.taste}}
        Texture: {{rating.ratings.texture}}
      </div>

      <div v-if="votes">
        Votes: {{ votes.upvoters_uid_list.length - votes.downvoters_uid_list.length }}
        <div>
          <v-btn @click="downvote" text>
            <span class="mr-2">DOWNVOTE</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn @click="upvote" text>
            <span class="mr-2">UPVOTE</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
        <div v-if="has_voted">
          <p v-if="is_upvote">
            You have upvoted this rating
          </p>
          <p v-if="is_downvote">
            You have downvoted this rating
          </p>
        </div>
      </div>
    </div>

    <div v-if="rating && is_edit">
      <!-- TODO Add permission checks -->
      <v-btn @click="toggle_edit_mode" text>
        <span class="mr-2">Cancel Editing</span>
      </v-btn>
      <br>
      <form @submit.prevent>
        <div>
          name: <input type="text" v-model="cloned_rating.name"><br>
          category:
          <select v-model="cloned_rating.category">
            <option v-for="category in categories" :value="category.value">{{category.name}}</option>
          </select><br>
          <br>
          <place-autocomplete-field
              v-model="cloned_rating.location"
              placeholder="Enter an address, zipcode, or location"
              :api-key="google_places_api_key">
          </place-autocomplete-field>
          <br>
          <input type="text" v-model="cloned_rating.comment" placeholder="Additional comments here...">
        </div>
        <div>
          Taste - {{cloned_rating.ratings.taste}}: <input type="range" max="5" min="1" step="1" value="5" v-model="cloned_rating.ratings.taste"><br>
          Texture - {{cloned_rating.ratings.texture}}: <input type="range" max="5" min="1" step="1" value="5" v-model="cloned_rating.ratings.texture"><br>
          Portion Size - {{cloned_rating.ratings.portion_size}}: <input type="range" max="5" min="1" step="1" value="5" v-model="cloned_rating.ratings.portion_size"><br>
          Looks - {{cloned_rating.ratings.looks}}: <input type="range" max="5" min="1" step="1" value="5" v-model="cloned_rating.ratings.looks"><br>
          Price - {{cloned_rating.ratings.price}}: <input type="range" max="5" min="1" step="1" value="5" v-model="cloned_rating.ratings.price">
        </div>
        <v-btn @click="update_rating">Finish Rating!</v-btn>
      </form>
    </div>
  </v-container>
</template>

<script>
  const fb = require('../firebaseConfig.js');
  import firebase from 'firebase';
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import VuePlaceAutocomplete from 'vue-place-autocomplete';

  Vue.use(VuePlaceAutocomplete);

  export default {
    data() {
      return {
        google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
        rating: null,
        cloned_rating: null,
        votes: null,
        vote_object_id: '',
        has_voted: false,
        is_downvote: false,
        is_upvote: false,
        is_edit: false,
      }
    },
    methods: {
      get_rating_by_id() {
        let rating_id = this.$route.params.rating_id;
        fb.ratingsCollection.doc(rating_id).get()
            .then(response => {
              if (response.exists) {
                // TODO Store currently viewed rating in state to reduce amount of calls
                this.rating = response.data();
                this.cloned_rating = response.data();
                console.log("Get rating by ID: ", this.rating);
                this.get_associated_votes_document(rating_id);
              }
              else {
                console.log(`Failed to get rating with ID matching ${rating_id}`);
                this.$router.push('/dashboard');
              }
            })
      },
      get_associated_votes_document(rating_id) {
        fb.votesCollection.where('rating', '==', rating_id)
            .get()
            .then(queryset => {
              queryset.forEach(doc => {
                // There should only be one object, so this forEach is safe
                this.vote_object_id = doc.id;
                this.votes = doc.data();
                console.log("Get votes: ", this.votes)
              });
            })
            .catch(function(error) {
              console.log("Error getting votes: ", error);
            });
      },
      upvote() {
        // Adds user uid to upvoter's list, removes from downvoter's list
        let vote_document = fb.votesCollection.doc(this.vote_object_id);
        vote_document.update({
          upvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(this.current_user.uid),
          downvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(this.current_user.uid)
        })
            .then(() => {
              let rating_id = this.$route.params.rating_id;
              this.get_associated_votes_document(rating_id);
              console.log("Upvoted Successfully")
            })
            .catch(function(error) {
              console.log("Error when upvoting: ", error)
            });
      },
      downvote() {
        let vote_document = fb.votesCollection.doc(this.vote_object_id);
        vote_document.update({
          downvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(this.current_user.uid),
          upvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(this.current_user.uid)
        })
            .then(() => {
              let rating_id = this.$route.params.rating_id;
              this.get_associated_votes_document(rating_id);
              console.log("Downvoted Successfully")
            })
            .catch(function(error) {
              console.log("Error when downvoting: ", error)
            });
      },
      check_user_has_voted() {
        if (this.votes.upvoters_uid_list.includes(this.current_user.uid)) {
          this.has_voted = true;
          this.is_upvote = true;
          this.is_downvote = false;
        }
        else if (this.votes.downvoters_uid_list.includes(this.current_user.uid)) {
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
        fb.ratingsCollection.doc(rating_id).set(this.cloned_rating)
            .then(() => {
              // TODO Add loading
              this.is_edit = false;
              this.rating = this.cloned_rating;
              console.log("Rating updated successfully!")
            })
            .catch(err => {
              console.log("Error in updating rating: ", err);
            })
      }
    },
    mounted() {
      // TODO Store currently viewed rating in state, so we don't call so much
      this.get_rating_by_id()
    },
    computed: {
      ...mapState({
        current_user: 'current_user',
        categories: 'categories'
      }),
    },
    watch: {
      votes: function (new_value, old_value) {
        if (new_value != null) {
          this.check_user_has_voted();
        }
      }
    }
  }
</script>

<style scoped>

</style>