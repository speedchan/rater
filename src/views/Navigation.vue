<template>
    <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Comparater</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn to="dashboard" text>
            <span class="mr-2">Dashboard</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-btn to="settings" text>
            <span class="mr-2">Settings</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-btn @click="logout" text>
            <span class="mr-2">Logout</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
    const fb = require('../firebaseConfig.js');

    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clear_current_user_data');
                    this.$router.push('/login');
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>