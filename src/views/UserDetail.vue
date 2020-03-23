<template>
  <v-container class="dashboard_container">
    <v-row>
      <v-col>
        <v-card v-if="user">
          <v-container class="d-flex align-center">
            <v-row no-gutters>
              <v-col cols="12" class="text-center title text-uppercase">
                <span>{{ user.display_name }}</span>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="text-md-right text-center pr-md-7">
                    <v-avatar size="250" tile>
                      <v-img
                        :src="user.profile_picture ? user.profile_picture : 'https://via.placeholder.com/150'"
                      ></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" class="hidden-sm-and-up">
                    <v-divider class="mx-4 my-3"></v-divider>
                  </v-col>
                  <v-col cols="12" md="6" class="pl-md-7">
                    <v-row no-gutters>
                      <v-col cols="12" class="mb-2 subtitle-2 text-md-left text-center">INFO</v-col>
                      <v-col cols="12" class="pt-1 text-capitalize">
                        <span>
                          <v-icon class="pr-2">mdi-face</v-icon>
                          {{user.full_name}}
                        </span>
                      </v-col>
                      <v-col cols="12" class="pt-1">
                        <span>
                          <v-icon class="pr-2">mdi-domino-mask</v-icon>
                          {{ user.display_name }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="pt-1">
                        <span>
                          <v-icon class="pr-2">mdi-map-marker</v-icon>
                          {{user.country}}
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" md="12" class="my-3">
                    <v-row no-gutters>
                      <v-col cols="12" md="12" class="mx-md-4 text-center">
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-btn color="bg_coral" @click="handle_show_user_ratings" :loading="show_user_ratings && loading_user_ratings" 
                            :disabled="show_user_ratings && !loading_user_ratings" :dark="!ratings_loaded" width="250px" id="load_ratings_button">
                            <v-icon class="mr-2">mdi-counter</v-icon>
                              <span v-if="ratings_loaded && show_user_ratings">{{ ratings_list.length }} Ratings Loaded</span>
                              <span v-if="!ratings_loaded">Load User's Ratings</span>
                              </v-btn>
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

    <v-row v-if="show_user_ratings && !loading_user_ratings">
      <v-col>
        <RatingListCard v-for="(rating, i) in ratings_list" :key="i" :rating="rating"></RatingListCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// TODO When update of user profile, update profile image as well.

const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";
import moment from "moment";
import RatingListCard from '../components/RatingListCard';


export default {  
  components: {
    RatingListCard
  },
  data() {
    return {
      user: null,
      ratings_list: [],
      show_user_ratings: false,
      loading_user_ratings: false,
      ratings_loaded: false
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
          this.loading_user_ratings = false;
          this.ratings_loaded = true;
          console.log(this.ratings_list);
        });
    },
    handle_show_user_ratings() {
      this.loading_user_ratings = true;
      this.show_user_ratings = true;
      this.get_ratings_list_by_user_id();
    }
  },
  mounted() {
    this.get_user_by_id();
  },
  computed: {
    ...mapState({
      current_user: "current_user"
    }),
    amount_of_ratings() {
      return this.ratings_list.length
    }
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

<style scoped type="scss">
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