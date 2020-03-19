<template>
  <v-card class="my-3" :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">
    <v-container>
      <v-row no-gutters>
        <v-col md="4" cols="12" class="text-center d-flex align-center">
          <v-row no-gutters>
            <v-col cols="12">
              <v-avatar size="300" tile>
                <v-img
                  :src="rating.picture_url ? rating.picture_url : 'https://via.placeholder.com/150'"
                ></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="hidden-sm-and-up">
          <v-divider class="mx-4 my-3"></v-divider>
        </v-col>

        <v-col md="8" cols="12" class="px-md-12">
          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-col cols="12" class="subtitle-2 text-uppercase text-center">Info</v-col>
                  <v-col cols="12" class="pt-1 pb-0">
                    <v-icon class="pr-2">mdi-cube-outline</v-icon>
                    {{rating.name ? rating.name : '-'}}
                    <v-spacer></v-spacer>
                  </v-col>
                  <v-col cols="12" class="pt-1 pb-0">
                    <v-icon class="pr-2">mdi-tag</v-icon>
                    {{rating.category ? rating.category : '-'}}
                  </v-col>
                  <v-col cols="12" class="pt-1 pb-0">
                    <v-icon class="pr-2">mdi-map-marker</v-icon>
                    {{rating.location ? rating.location : '-'}}
                  </v-col>
                </v-col>
                
                <v-col cols="12" class="hidden-sm-and-up">
                  <v-divider class="mx-4 my-3"></v-divider>
                </v-col>

                <v-col cols="12" md="6">
                  <v-col cols="12" class="subtitle-2 text-uppercase text-center py-0 py-md-3">Ratings</v-col>
                  <v-col cols="12" class="ma-0 pa-0">
                    <p class="ratings_label overline">Combined Average</p>
                    <v-rating
                          :value="(rating.ratings.taste + rating.ratings.texture + rating.ratings.portion_size + rating.ratings.looks + rating.ratings.price) / 5"
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
                    <!-- <v-rating class="ratings"></v-rating> -->
                  </v-col>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider class="mx-4 my-3"></v-divider>
            </v-col>

            <v-col cols="12" class="subtitle-2 text-uppercase text-center">Comment</v-col>
            <v-col
              cols="12"
              sm="12"
              class="text-left"
            >{{ rating.comment ? rating.comment : '-' }}</v-col>
            <v-divider class="mx-4 my-3"></v-divider>
            <v-col cols="12" sm="12" class="text-center">
              Created {{ rating.created|format_date }} by
              <v-chip
                color="red"
                text-color="white"
                :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}"
              >
                <v-avatar left>
                  <v-icon>mdi-account-circle</v-icon>
                </v-avatar>
                {{ rating.user_data.display_name ? rating.user_data.display_name : '-' }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="12" class="mt-2 view_more">
              <v-btn disabled text>
                View more
                <v-icon>mdi-menu-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {};
  },
  props: {
    rating: Object
  },
  methods: {},
  computed: {
    ...mapState({
      current_user: "current_user"
    })
  },
  filters: {
    format_date(timestamp) {
      if (!timestamp) {
        return "-";
      }
      return moment(timestamp.toDate()).fromNow();
    }
  }
};
</script>

<style scoped type="scss">
.ratings_label {
  display: inline-block;
  width: 13em;
}
.ratings {
  display: inline;
}
/* Mobile */
@media (max-width: 575.98px) {
  .dashboard_container {
    width: 100vw;
  }
  .view_more {
    text-align: center;
  }
}

/* Tablets */
@media (min-width: 576px) {
  .dashboard_container {
    width: 100%;
  }
  .view_more {
    text-align: right;
  }
}

/* Desktops and up */
@media (min-width: 992px) {
  .dashboard_container {
    width: 75%;
  }
  .view_more {
    text-align: right;
  }
}
</style>