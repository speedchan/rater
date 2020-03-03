<template>
  <section>
    <div v-if="rating">
      {{ rating.name }} <br>
      {{rating.category}} <br>
      {{rating.user_data.display_name}} <br>
      {{rating.user_data.full_name}} <br>

      <div>
        Looks: {{rating.ratings.looks}}
        Portion Size: {{rating.ratings.portion_size}}
        Price: {{rating.ratings.price}}
        Taste: {{rating.ratings.taste}}
        Texture: {{rating.ratings.texture}}
      </div>

      <div v-if="votes">
        Downvotes: {{ votes.downvoters_uid_list.length }}
        Upvotes: {{ votes.upvoters_uid_list.length }}
      </div>
    </div>
  </section>
</template>

<script>
  const fb = require('../firebaseConfig.js');

  export default {
    data() {
      return {
        rating: null,
        votes: null
      }
    },
    methods: {
      get_rating_by_id: function() {
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
      get_associated_votes_document: function(rating_id) {
        fb.votesCollection.where('rating', '==', rating_id)
            .get()
            .then(queryset => {
              queryset.forEach(doc => {
                // There should only be one object, so this move is safe
                this.votes = doc.data();
                console.log("Get votes: ", this.votes)
              });
            })
            .catch(function(error) {
              console.log("Error getting votes: ", error);
            });
      },
    },
    mounted() {
      this.get_rating_by_id()
    }
  }
</script>

<style scoped>

</style>