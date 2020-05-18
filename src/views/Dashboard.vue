<template>
  <v-container class="dashboard_container">
    <v-btn fixed dark fab bottom right to="ratings/create">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-container>
            <form @submit.prevent="handle_search">
              <v-row no-gutters>
                <v-col cols="12" md="4" class="mb-2">
                  <v-text-field
                    dense
                    outlined
                    placeholder="Filter by rating name, user names, locations"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    v-model="search_text_slug"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3" class="pl-md-2 pr-md-1 mb-2">
                  <v-select
                    dense
                    :items="categories"
                    hide-details
                    outlined
                    placeholder="Filter by category"
                    v-model="search_category_slug"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="pl-md-1">
                  <v-select
                    dense
                    hide-details
                    outlined
                    placeholder="Filter by average rating"
                    :items="rating_points_dropdown"
                    v-model="search_rating_slug"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2" class="text-center my-2 my-md-0">
                  <v-btn @click="clear_search" text>
                    <v-icon class="pr-2">mdi-close</v-icon>Clear all fields
                  </v-btn>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn type="submit" color="bg_coral" width="250" dark>
                    <v-icon class="pr-2">mdi-magnify</v-icon>Search
                  </v-btn>
                </v-col>
              </v-row>
            </form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="all_ratings.length || filtered_ratings.length">
      <v-col>
        <RatingListCard v-for="(rating, i) in ratings_to_display" :key="i" :rating="rating"></RatingListCard>
      </v-col>
    </v-row>

    <v-row
      v-if="(!all_ratings.length && !is_searching) || (!filtered_ratings.length && is_searching) "
    >
      <v-col>
        <v-card class="my-3">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="text-center">No ratings to display</v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import RatingListCard from "../components/RatingListCard";

export default {
  components: {
    RatingListCard
  },
  data() {
    return {
      search_text_slug: "",
      search_category_slug: "",
      search_rating_slug: "",
      is_searching: false,
      filtered_ratings: [],
      rating_points_dropdown: [
        { text: "Between 1.0 and 2.0", value: 2 },
        { text: "Between 2.1 and 3.0", value: 3 },
        { text: "Between 3.1 and 4.0", value: 4 },
        { text: "Between 4.1 and 5.0", value: 5 }
      ]
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
      }
      return this.all_ratings;
    }
  },
  methods: {
    handle_search() {
      this.is_searching = true;
      let filtered_ratings = this.all_ratings;

      if (this.search_text_slug) {
        filtered_ratings = filtered_ratings.filter(rating => {
          if (
            rating.user_data.full_name
              .toLowerCase()
              .includes(this.search_text_slug.toLowerCase()) ||
            rating.user_data.display_name
              .toLowerCase()
              .includes(this.search_text_slug.toLowerCase()) ||
            rating.name
              .toLowerCase()
              .includes(this.search_text_slug.toLowerCase()) ||
            rating.location
              .toLowerCase()
              .includes(this.search_text_slug.toLowerCase())
          ) {
            return rating;
          }
        });
      }

      if (this.search_category_slug) {
        filtered_ratings = filtered_ratings.filter(rating => {
          if (
            rating.category
              .toLowerCase()
              .includes(this.search_category_slug.toLowerCase())
          ) {
            return rating;
          }
          return false;
        });
      }

      if (this.search_rating_slug) {
        filtered_ratings = filtered_ratings.filter(rating => {
          if (
            parseFloat(rating.average_rating) >= (parseInt(this.search_rating_slug) - 1) && 
            parseFloat(rating.average_rating) <= parseInt(this.search_rating_slug)
          ) {
            return rating;
          }
          return false;
        });
      }
      this.filtered_ratings = filtered_ratings;
    },
    clear_search() {
      this.search_text_slug = "";
      this.search_category_slug = "";
      this.search_rating_slug = "";
      this.is_searching = false;
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