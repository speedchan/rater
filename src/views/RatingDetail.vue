<template>
  <section>
    <div v-if="rating">
      {{ rating.name }} <br>
      {{rating.category}} <br>
      {{rating.user_data.display_name}} <br>
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
  </section>
</template>

<script>
  const fb = require('../firebaseConfig.js');
  import firebase from 'firebase';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        rating: null,
        votes: null,
        vote_object_id: '',
        has_voted: false,
        is_downvote: false,
        is_upvote: false,
      }
    },
    methods: {
      get_rating_by_id() {
        let rating_id = this.$route.params.rating_id;
        fb.ratingsCollection.doc(rating_id).get()
            .then(response => {
              if (response.exists) {
                this.rating = response.data();
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
        vote_document.update(
            { upvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(this.current_user.uid) }
        ).then(response => {
          vote_document.update(
              { downvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(this.current_user.uid) }
          );
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
          console.log("Upvoted Successfully")
        }).catch(function(error) {
          console.log("Error when upvoting: ", error)
        });
      },
      downvote() {
        let vote_document = fb.votesCollection.doc(this.vote_object_id);
        vote_document.update(
            { downvoters_uid_list: firebase.firestore.FieldValue.arrayUnion(this.current_user.uid) }
        ).then(response => {
          vote_document.update(
              { upvoters_uid_list: firebase.firestore.FieldValue.arrayRemove(this.current_user.uid) }
          );
          let rating_id = this.$route.params.rating_id;
          this.get_associated_votes_document(rating_id);
          console.log("Downvoted Successfully")
        }).catch(function(error) {
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
      }
    },
    mounted() {
      this.get_rating_by_id()
    },
    computed: {
      ...mapState({
        current_user: 'current_user'
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