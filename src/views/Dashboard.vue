<template>
    <div>
        dashboard
        <p>
            <router-link to="ratings/create">Rate Something!</router-link>
        </p>

        <table border="1">
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Created</td>
                <td>Location</td>
                <td>User Display Name</td>
                <td>User Full Name</td>
                <td>Ratings</td>
            </tr>
            <tr v-for="rating in current_user_ratings">
                <td>
                    <router-link :to="{ name: 'RatingDetail', params: { rating_id: rating.id }}">{{rating.id}}</router-link>
                </td>
                <td>{{rating.name}}</td>
                <td>{{rating.created | format_date}}</td>
                <td>{{rating.location}}</td>
                <td>{{rating.user_data.display_name}}</td>
                <td>{{rating.user_data.full_name}}</td>
                <td>
                    Taste: {{rating.ratings.taste}}<br>
                    Texture: {{rating.ratings.texture}}<br>
                    Portion Size: {{rating.ratings.portion_size}}<br>
                    Looks: {{rating.ratings.looks}}<br>
                    Price: {{rating.ratings.price}}<br>
                </td>
            </tr>
        </table>
    </div>
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