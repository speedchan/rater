<template>
    <v-container class="white">
        <v-btn fixed dark fab bottom right color="bg_coral" to="ratings/create">
            <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>

        <v-layout row wrap class="">
            <v-flex v-for="rating in all_ratings" xs12 ma-3>
                <v-card>
                    <v-card-subtitle>
                        {{rating.name}} - {{rating.id}}
                    </v-card-subtitle>
                    <v-card-text>
                        Taste: {{rating.ratings.taste}}<br>
                        Texture: {{rating.ratings.texture}}<br>
                        Portion Size: {{rating.ratings.portion_size}}<br>
                        Looks: {{rating.ratings.looks}}<br>
                        Price: {{rating.ratings.price}}<br>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">View Details</v-btn>
                        <v-btn :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}">View Profile</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment';
    import { mapState } from 'vuex';

    export default {
        computed: {
            ...mapState({
                current_user: 'current_user',
                current_user_profile: 'current_user_profile',
                categories: 'categories',
                current_user_ratings: 'current_user_ratings',
                all_ratings: 'all_ratings'
            })
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