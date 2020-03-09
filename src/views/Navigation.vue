<template>
    <v-layout>
        <v-app-bar app color="bg_coral" dark class="hidden-sm-and-down">
<!--            <v-app-bar-nav-icon></v-app-bar-nav-icon>-->
            <v-toolbar-title>Comparater Desktop</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn to="/dashboard" text>
                <span class="mr-2">Home</span>
                <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-btn :to="{ name: 'UserDetail', params: { user_uid: current_user.uid }}" text>
                <span class="mr-2">My Profile</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-btn to="/settings" text>
                <span class="mr-2">Settings</span>
                <v-icon>mdi-account-details</v-icon>
            </v-btn>
            <v-btn @click="logout" text>
                <span class="mr-2">Logout</span>
                <v-icon>mdi-logout-variant</v-icon>
            </v-btn>
        </v-app-bar>

        <v-app-bar app color="primary" dark class="hidden-md-and-up">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>Comparater Mobile</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn to="/dashboard" text>
                <span class="mr-2">Dashboard</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn :to="{ name: 'UserDetail', params: { user_uid: current_user.uid }}" text>
                <span class="mr-2">My Profile</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn to="/settings" text>
                <span class="mr-2">Settings</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn @click="logout" text>
                <span class="mr-2">Logout</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>
    </v-layout>


    <!--    <v-layout row justify-center>-->
    <!--        <v-app-bar dark color="blue-grey darken-1" class="hidden-xs-and-down">-->
    <!--            <v-toolbar-title>Desktop Menu</v-toolbar-title>-->
    <!--            <v-spacer></v-spacer>-->
    <!--            <v-toolbar-items>-->
    <!--                <v-btn-->
    <!--                    v-for="item in nav"-->
    <!--                    :key="item.icon"-->
    <!--                    to="#"-->
    <!--                    :title="item.title"-->
    <!--                    text-->
    <!--                >{{ item.text }}</v-btn>-->
    <!--            </v-toolbar-items>-->
    <!--        </v-app-bar>-->

    <!--        <v-app-bar dark color="blue-grey darken-3" class="hidden-sm-and-up">-->
    <!--            <v-toolbar-title>Mobile Menu</v-toolbar-title>-->
    <!--            <v-spacer></v-spacer>-->

    <!--            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">-->
    <!--                <v-app-bar-nav-icon dark v-slot:activator="{ on }"></v-app-bar-nav-icon>-->
    <!--                <v-card>-->
    <!--                    <v-toolbar text color="blue-grey darken-2">-->
    <!--                        <v-toolbar-title>Mobile Menu</v-toolbar-title>-->
    <!--                        <v-spacer></v-spacer>-->
    <!--                        <v-btn icon @click.native="dialog = false">-->
    <!--                            <v-icon>close</v-icon>-->
    <!--                        </v-btn>-->
    <!--                    </v-toolbar>-->

    <!--                    <v-list>-->
    <!--                        <v-list-tile-->
    <!--                            v-for="(item, index) in nav"-->
    <!--                            :key="index"-->
    <!--                            to="#"-->
    <!--                        >-->
    <!--                            <v-list-tile-action>-->
    <!--                                <v-icon v-if="item.icon">{{item.icon}}</v-icon>-->
    <!--                            </v-list-tile-action>-->
    <!--                            <v-list-tile-content>-->
    <!--                                <v-list-tile-title :title="item.title">{{ item.text }}</v-list-tile-title>-->
    <!--                            </v-list-tile-content>-->
    <!--                        </v-list-tile>-->
    <!--                    </v-list>-->
    <!--                </v-card>-->
    <!--            </v-dialog>-->
    <!--        </v-app-bar>-->
    <!--    </v-layout>-->
</template>

<script>
    const fb = require('../firebaseConfig.js');
    import { mapState } from 'vuex';

    export default {
        // data() {
        //     return {
        //         dialog: false,
        //         nav: [
        //             {
        //                 icon: 'home',
        //                 text: 'Home',
        //                 title: 'Back to Home page',
        //                 active: true
        //             },
        //             {
        //                 icon: 'info',
        //                 text: 'About',
        //                 title: 'About this demo',
        //                 active: false
        //             },
        //             {
        //                 icon: 'assignment_turned_in',
        //                 text: 'Todos',
        //                 title: 'Some stuff that needs doing',
        //                 active: false
        //             },
        //             {
        //                 icon: 'email',
        //                 text: 'Contact',
        //                 title: 'Our Contact info',
        //                 active: false
        //             }
        //         ]
        //     }
        // },
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clear_current_user_data');
                    this.$router.push('/login');
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        computed: {
            ...mapState({
                current_user: 'current_user'
            })
        }
    }
</script>