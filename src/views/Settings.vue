<template>
    <v-container>
        <h4>Settings</h4>
        <div>
            <form @submit.prevent>
                <label for="full_name">Full Name</label>
                <input type="text" v-model.trim="current_user_profile.full_name" placeholder="Full Name">
                <label for="full_name">Display Name</label>
                <input type="text" v-model.trim="current_user_profile.display_name" placeholder="Display Name">
                <label for="country">Country</label>
                <country-select v-model="current_user_profile.country" id="country" :countryName="true"
                                :removePlaceholder="true"></country-select>
                <button @click="update_user_profile" class="button">Update Profile</button>
            </form>
        </div>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    import Vue from 'vue';
    import vueCountryRegionSelect from 'vue-country-region-select';

    Vue.use(vueCountryRegionSelect);

    export default {
        data() {
            return {
                full_name: "",
                display_name: "",
                country: "",
            }
        },
        methods: {
            update_user_profile() {
                this.$store.dispatch('update_user_profile', {
                    full_name: this.full_name ? this.full_name : this.current_user_profile.full_name,
                    display_name: this.display_name ? this.display_name : this.current_user_profile.display_name,
                    country: this.country ? this.country : this.current_user_profile.country,
                });
                this.full_name = '';
                this.display_name = '';
                console.log("Start updating profiel");
            }
        },
        computed: {
            ...mapState({
                current_user_profile: 'current_user_profile'
            })
        },
    }
</script>