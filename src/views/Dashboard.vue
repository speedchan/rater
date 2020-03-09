<template>
    <v-container class="container_desktop bg_coral pa-6">
        <v-btn fixed dark fab bottom right color="bg_coral" to="ratings/create">
            <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>

        <v-row>
            <v-col cols="12">
                <v-card dark>
                    <div class="d-flex justify-lg-space-between">
                        <input type="text" placeholder="search name" class="text-center">
                        <input type="text" placeholder="search category" class="text-center">
                        <input type="text" placeholder="search whatever" class="text-center">
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row dense>
            <v-col v-for="(rating, i) in all_ratings" :key="i" cols="12">
                <v-card dark :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title>
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">{{rating.name}}</span>
                                    </template>
                                    <span>{{rating.id}}</span>
                                </v-tooltip>
                            </v-card-title>

                            <v-card-subtitle>
                                Taste: {{rating.ratings.taste}}<br>
                                Texture: {{rating.ratings.texture}}<br>
                                Portion Size: {{rating.ratings.portion_size}}<br>
                                Looks: {{rating.ratings.looks}}<br>
                                Price: {{rating.ratings.price}}<br>
                            </v-card-subtitle>

                            <v-card-actions>
                                <v-btn :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}">
                                    View {{ rating.user_data.display_name }}'s Profile
                                </v-btn>
                            </v-card-actions>
                        </div>

                        <v-avatar class="ma-3" size="125" tile>
                            <v-img src="https://via.placeholder.com/5"></v-img>
                        </v-avatar>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!--        <v-row>-->
        <!--            <v-col cols="12">-->
        <!--                <v-row justify="center">-->
        <!--                    <v-card outlined v-for="rating in all_ratings" >-->
        <!--                        <v-card-subtitle>-->
        <!--                                    {{rating.name}} - {{rating.id}}-->
        <!--                        </v-card-subtitle>-->
        <!--                        <v-card-text>-->
        <!--                            Taste: {{rating.ratings.taste}}<br>-->
        <!--                            Texture: {{rating.ratings.texture}}<br>-->
        <!--                            Portion Size: {{rating.ratings.portion_size}}<br>-->
        <!--                            Looks: {{rating.ratings.looks}}<br>-->
        <!--                            Price: {{rating.ratings.price}}<br>-->
        <!--                        </v-card-text>-->
        <!--                        <v-card-actions>-->
        <!--                                    <v-btn :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">View Details</v-btn>-->
        <!--                                    <v-btn :to="{ name: 'UserDetail', params: { user_uid: rating.user_data.uid }}">View Profile</v-btn>-->
        <!--                                </v-card-actions>-->
        <!--                    </v-card>-->
        <!--                </v-row>-->
        <!--            </v-col>-->
        <!--        </v-row>-->

    </v-container>
</template>

<script>
    import moment from 'moment';
    import { mapState } from 'vuex';

    export default {
        data() {
            return{
                items: [
                    {
                        color: '#1F7087',
                        src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
                        title: 'Supermodel',
                        artist: 'Foster the People',
                    },
                    {
                        color: '#952175',
                        src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
                        title: 'Halcyon Days',
                        artist: 'Ellie Goulding',
                    },
                ],
            }
        },
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

<style scoped type="scss">
    .container_desktop {
        width: 50%;
    }
</style>