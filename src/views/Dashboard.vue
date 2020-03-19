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

    <v-row>
      <v-col>
        <RatingListCard v-for="(rating, i) in ratings_to_display" :key="i" :rating="rating"></RatingListCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import RatingListCard from '../components/RatingListCard';

export default {
  components: {
    RatingListCard
  },
  data() {
    return {
      search_name_slug: "",
      search_category_slug: "",
      is_searching: false,
      show_own_ratings: false,
      filtered_ratings: []
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