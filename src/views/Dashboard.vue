<template>
  <v-container class="dashboard_container">
    <v-btn fixed dark fab bottom right to="ratings/create">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-row>
      <v-col cols="12">
        <v-switch v-model="show_own_ratings" label="Display own ratings" hide-details></v-switch>
        <v-card>
          <v-row justify="space-between">
            <v-col class="text-center" lg="4" sm="12">
              <v-text-field
                dense
                outlined
                placeholder="Filter by rating name or user name"
                hide-details
                prepend-inner-icon="mdi-magnify"
                v-model="search_name_slug"
              ></v-text-field>
            </v-col>
            <v-col class="text-center" lg="4" sm="12">
              <v-select
                dense
                :items="categories"
                hide-details
                outlined
                placeholder="Filter by category"
                v-model="search_category_slug"
              ></v-select>
            </v-col>
            <v-col class="text-center" lg="4" sm="12">
              <v-btn @click="handle_search">Search</v-btn>
              <v-btn @click="clear_search">Clear Search</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cards -->
    <v-row>
      <v-col>
        <v-card
          v-for="(rating, i) in ratings_to_display"
          :key="i"
          class="my-3"
          :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}"
        >
          <v-container>
            <v-row no-gutters>
              <v-col md="4" cols="12" class="text-center">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-avatar size="200" tile>
                      <v-img :src="rating.picture_url ? rating.picture_url : 'https://via.placeholder.com/150'"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" class="text-center pt-2">
                    <v-icon class="pr-2">mdi-text-short</v-icon>
                    {{rating.name ? rating.name : '-'}}
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-icon class="pr-2">mdi-shape</v-icon>
                    {{rating.category ? rating.category : '-'}}
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-icon class="pr-2">mdi-map-marker</v-icon>
                    {{rating.location ? rating.location : '-'}}
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="hidden-sm-and-up">
                <v-divider class="mx-4 my-3"></v-divider>
              </v-col>

              <v-col md="8" cols="12">
                <v-row no-gutters class="text-center">
                  <v-col cols="12" class="mb-2 subtitle-2">
                    RATINGS
                  </v-col>
                  <v-col cols="12">
                    <v-row no-gutters>
                      <v-col cols="12">
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
                        ></v-rating>
                        <!-- <v-rating></v-rating> -->
                      </v-col>
                      <v-col cols="12" class="mb-2 overline">Combined Average</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-divider class="mx-4 my-3"></v-divider>
                  </v-col>
                  <v-col cols="12" class="mb-2">
                    <span class="subtitle-2">COMMENT</span>
                  </v-col>
                  <v-col cols="12" sm="12" v-text="rating.comment ? rating.comment : '-'"></v-col>
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
      </v-col>
    </v-row>
    <!-- End Cards -->
  </v-container>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

export default {
  data() {
    return {
      search_name_slug: "",
      search_category_slug: "",
      is_searching: false,
      show_own_ratings: false,
      filtered_ratings: [],
    };
  },
  computed: {
    ...mapState({
      current_user: "current_user",
      current_user_profile: "current_user_profile",
      categories: "categories",
      current_user_ratings: "current_user_ratings",
      all_ratings: "all_ratings"
    }),
    ratings_to_display() {
      if (this.is_searching) {
        return this.filtered_ratings;
      } else {
        if (this.show_own_ratings) {
          return this.current_user_ratings;
        }
        return this.all_ratings;
      }
    }
  },
  methods: {
    handle_search() {
      this.is_searching = true;
      let filtered_ratings = [];
      let ratings_to_filter_through = this.show_own_ratings
        ? this.current_user_ratings
        : this.all_ratings;

      // Check rating's name, user's name and user's display name
      if (this.search_name_slug.toLowerCase()) {
        let temporary_filtered_array = [];
        ratings_to_filter_through.filter(rating => {
          if (
            rating.user_data.full_name
              .toLowerCase()
              .includes(this.search_name_slug.toLowerCase()) ||
            rating.user_data.display_name
              .toLowerCase()
              .includes(this.search_name_slug.toLowerCase()) ||
            rating.name
              .toLowerCase()
              .includes(this.search_name_slug.toLowerCase())
          ) {
            temporary_filtered_array.push(rating);
          }
        });
        filtered_ratings = filtered_ratings.concat(temporary_filtered_array);
      }

      // Check rating's category
      if (this.search_category_slug) {
        let temporary_filtered_array = [];
        ratings_to_filter_through.filter(rating => {
          if (
            rating.category
              .toLowerCase()
              .includes(this.search_category_slug.toLowerCase())
          ) {
            temporary_filtered_array.push(rating);
          }
        });
        filtered_ratings = filtered_ratings.concat(temporary_filtered_array);
      }

      // Convert to Set and back to Array to remove duplicates
      filtered_ratings = Array.from(new Set(filtered_ratings));
      this.filtered_ratings = filtered_ratings;
    },
    clear_search() {
      this.search_name_slug = "";
      this.search_category_slug = "";
      this.is_searching = false;
    }
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