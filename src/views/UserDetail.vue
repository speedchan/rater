<template>
  <v-container>
    <div v-if="user">
      <table>
        <tr>
          <td>
            <v-avatar size="125">
              <v-img :src="user.profile_picture" alt="didnt have no pp"></v-img>
            </v-avatar>
          </td>
        </tr>
        <tr>
          <td>{{user.country}}</td>
        </tr>
        <tr>
          <td>{{user.display_name}}</td>
        </tr>
        <tr>
          <td>{{user.full_name}}</td>
        </tr>
      </table>
      <br />
      <br />

      <table v-if="ratings_list.length !== 0">
        <h4>Ratings ({{ ratings_list.length }})</h4>
        <tr>
          <td>ID</td>
          <td>Rating Name</td>
          <td>Creation Date</td>
        </tr>
        <tr v-for="(rating, i) in ratings_list" :key="i">
          <td>{{rating.id}}</td>
          <td>
            <router-link
              :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}"
            >{{rating.name}}</router-link>
          </td>
          <td>{{rating.created | format_date}}</td>
        </tr>
      </table>
    </div>
  </v-container>
</template>

<script>
// TODO When update of user profile, update pprofile image as well.
const fb = require("../firebaseConfig.js");
import moment from "moment";

export default {
  data() {
    return {
      user: null,
      ratings_list: []
    };
  },
  methods: {
    get_user_by_id() {
      let user_id = this.$route.params.user_uid;
      fb.usersCollection
        .doc(user_id)
        .get()
        .then(response => {
          if (response.exists) {
            console.log("response: ", response.data());
            this.user = response.data();
          } else {
            console.log(`e404 Failed to get user with ID matching ${user_id}`);
            this.$router.push("/dashboard");
          }
        });
    },
    get_ratings_list_by_user_id() {
      fb.ratingsCollection
        .where("user_data.uid", "==", this.$route.params.user_uid)
        .orderBy("created", "desc")
        .onSnapshot(queryset => {
          queryset.forEach(rating_object => {
            let rating = rating_object.data();
            rating.id = rating_object.id;
            this.ratings_list.push(rating);
          });
          console.log(this.ratings_list);
        });
    }
  },
  mounted() {
    this.get_user_by_id();
    this.get_ratings_list_by_user_id();
  },
  filters: {
    format_date(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return `${moment(timestamp.toDate())} (${moment(
        timestamp.toDate()
      ).fromNow()})`;
    }
  }
};
</script>

<style scoped>
</style>