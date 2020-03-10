<template>
    <v-container class="dashboard_container">
        <v-btn fixed dark fab bottom right color="bg_coral" to="ratings/create">
            <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>

        <v-row>
            <v-col cols="12">
                <v-switch v-model="show_own_ratings" label="Display own ratings" hide-details></v-switch>
                <v-card>
                    <v-row justify="space-between">
                        <v-col class="text-center" lg="4" sm="12">
                            <v-text-field dense outlined placeholder="Filter by rating name or user name"
                                          hide-details prepend-inner-icon="mdi-magnify"
                                          v-model="search_name_slug"></v-text-field>
                        </v-col>
                        <v-col class="text-center" lg="4" sm="12">
                            <v-select dense :items="categories" hide-details outlined placeholder="Filter by category"
                                      v-model="search_category_slug">
                            </v-select>
                        </v-col>
                        <v-col class="text-center" lg="4" sm="12">
                            <v-btn @click="handle_search">Search</v-btn>
                            <v-btn @click="clear_search">Clear Search</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- TODO Fix responsive Start here -->
        <!--        <v-row>-->
        <!--            <v-col v-for="(rating, i) in ratings_to_display" :key="i" cols="12" sm12>-->
        <!--                <v-card :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">-->
        <!--                    <div class="d-flex flex-no-wrap justify-space-between">-->
        <!--                        <div>-->
        <!--                            <v-card-title>-->
        <!--                                <v-tooltip right>-->
        <!--                                    <template v-slot:activator="{ on }">-->
        <!--                                        <span v-on="on">{{rating.name}}</span>-->
        <!--                                    </template>-->
        <!--                                    <span>{{rating.id}}</span>-->
        <!--                                </v-tooltip>-->
        <!--                            </v-card-title>-->

        <!--                            <v-card-subtitle>-->
        <!--                                Taste: {{rating.ratings.taste}}<br>-->
        <!--                                Texture: {{rating.ratings.texture}}<br>-->
        <!--                                Portion Size: {{rating.ratings.portion_size}}<br>-->
        <!--                                Looks: {{rating.ratings.looks}}<br>-->
        <!--                                Price: {{rating.ratings.price}}<br>-->
        <!--                            </v-card-subtitle>-->

        <!--                            <v-card-actions>-->
        <!--                                <v-btn :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}">-->
        <!--                                    View {{ rating.user_data.display_name }}'s Profile-->
        <!--                                </v-btn>-->
        <!--                            </v-card-actions>-->
        <!--                        </div>-->

        <!--                        <v-avatar class="ma-3" size="125" tile>-->
        <!--                            &lt;!&ndash;                            <v-img src="https://via.placeholder.com/5"></v-img>&ndash;&gt;-->
        <!--                        </v-avatar>-->
        <!--                    </div>-->
        <!--                </v-card>-->
        <!--            </v-col>-->
        <!--        </v-row>-->
        <!-- TODO Fix responsive end here -->

    </v-container>
</template>

<script>
    import moment from 'moment';
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                search_name_slug: '',
                search_category_slug: '',
                is_searching: false,
                show_own_ratings: false,
                filtered_ratings: []
            }
        },
        computed: {
            ...mapState({
                current_user: 'current_user',
                current_user_profile: 'current_user_profile',
                categories: 'categories',
                current_user_ratings: 'current_user_ratings',
                all_ratings: 'all_ratings'
            }),
            ratings_to_display() {
                if (this.is_searching) {
                    return this.filtered_ratings;
                }
                else {
                    if (this.show_own_ratings) {
                        return this.current_user_ratings
                    }
                    return this.all_ratings
                }
            }
        },
        methods: {
            handle_search() {
                this.is_searching = true;
                let filtered_ratings = [];
                let ratings_to_filter_through = this.show_own_ratings ? this.current_user_ratings : this.all_ratings;

                // Check rating's name, user's name and user's display name
                if (this.search_name_slug.toLowerCase()) {
                    let temporary_filtered_array = [];
                    ratings_to_filter_through.filter(rating => {
                        if (rating.user_data.full_name.toLowerCase().includes(this.search_name_slug.toLowerCase()) ||
                            rating.user_data.display_name.toLowerCase().includes(this.search_name_slug.toLowerCase()) ||
                            rating.name.toLowerCase().includes(this.search_name_slug.toLowerCase())) {
                            temporary_filtered_array.push(rating)
                        }
                    });
                    filtered_ratings = filtered_ratings.concat(temporary_filtered_array)
                }

                // Check rating's category
                if (this.search_category_slug) {
                    let temporary_filtered_array = [];
                    ratings_to_filter_through.filter(rating => {
                        if (rating.category.toLowerCase().includes(this.search_category_slug.toLowerCase())) {
                            temporary_filtered_array.push(rating)
                        }
                    });
                    filtered_ratings = filtered_ratings.concat(temporary_filtered_array)
                }

                // Convert to Set and back to Array to remove duplicates
                filtered_ratings = Array.from(new Set(filtered_ratings));
                this.filtered_ratings = filtered_ratings;
            },
            clear_search() {
                this.search_name_slug = '';
                this.search_category_slug = '';
                this.is_searching = false;
                // TODO Reset displayed ratings to all_ratings
            }
        },
        filters: {
            format_date(timestamp) {
                if (!timestamp) {
                    return '-'
                }
                return `${moment(timestamp.toDate())} (${moment(timestamp.toDate()).fromNow()})`
            }
        }
    }
</script>

<style scoped type="scss">

    /* Mobile */
    @media (max-width: 575.98px) {
        .dashboard_container {
            width: 100vw;
        }
        button {
            margin: 0 0.5em 0 0.5em;
        }
    }

    /* Tablets */
    @media (min-width: 576px) {
        .dashboard_container {
            width: 100%;
        }
        .row {
            margin-left: 5em;
            margin-right: 5em;
        }
    }

    /* Desktops and up */
    @media (min-width: 992px) {
        .dashboard_container {
            width: 75%;
        }
    }

</style>